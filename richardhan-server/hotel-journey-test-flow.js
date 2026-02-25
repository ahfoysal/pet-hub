/**
 * Full-Flow API Test Script — Hotel Journey
 * Tests the entire user journey: Signup → Verify → Set Role → KYC → All Hotel Modules
 *
 * Usage: node hotel-journey-test-flow.js
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const API = 'http://localhost:5000/api';

const TEST_EMAIL = `hotel-test-${Date.now()}@example.com`;
const TEST_PHONE = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
const TEST_PASSWORD = 'Password123!';
const DUMMY_IMAGE = path.join(__dirname, 'node_modules/@jest/reporters/assets/jest_logo.png');

// ─── Helpers ──────────────────────────────────────────────

let passCount = 0;
let failCount = 0;
let skipCount = 0;

function log(icon, msg) { console.log(`  ${icon} ${msg}`); }
function pass(msg) { passCount++; log('✅', msg); }
function fail(msg, err) { failCount++; log('❌', `${msg} — ${err}`); }
function skip(msg) { skipCount++; log('⏭️ ', msg); }
function section(title) { console.log(`\n━━━ ${title} ━━━`); }

async function safeFetch(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: { message: text.substring(0, 200) } };
  }
}

async function get(url, headers) {
  return safeFetch(url, { headers });
}

async function patch(url, body, headers) {
  return safeFetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function del(url, headers) {
  return safeFetch(url, {
    method: 'DELETE',
    headers,
  });
}

async function postJSON(url, body, headers = {}) {
  return safeFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function postForm(url, formData, headers = {}) {
  return safeFetch(url, {
    method: 'POST',
    headers: { ...headers },
    body: formData,
  });
}

async function patchForm(url, formData, headers = {}) {
  return safeFetch(url, {
    method: 'PATCH',
    headers: { ...headers },
    body: formData,
  });
}

// FormData helper that works in Node 18+
function buildFormData(fields, files) {
  const form = new FormData();
  for (const [key, val] of Object.entries(fields)) {
    if (Array.isArray(val)) {
      if (val.length === 0) form.append(key, ''); // Send empty string for empty array
      else val.forEach(v => form.append(key, v));
    } else {
      form.append(key, val);
    }
  }
  for (const [key, filePath] of Object.entries(files)) {
    if (fs.existsSync(filePath)) {
      const blob = new Blob([fs.readFileSync(filePath)]);
      form.append(key, blob, 'image.png');
    }
  }
  return form;
}

// ─── Test Steps ──────────────────────────────────────────

async function testAuthFlow() {
  section('1. USER SIGNUP');
  // Signup uses FileInterceptor which requires multipart/form-data
  const signupForm = new FormData();
  signupForm.append('fullName', 'Hotel Test Owner');
  signupForm.append('email', TEST_EMAIL);
  signupForm.append('phone', TEST_PHONE);
  signupForm.append('password', TEST_PASSWORD);
  const signup = await safeFetch(`${API}/auth/signup`, {
    method: 'POST',
    body: signupForm,
  });
  if (signup.status === 201 || signup.status === 200) pass('Signup succeeded');
  else fail('Signup', JSON.stringify(signup.data));

  section('2. EMAIL VERIFICATION (via DB bypass)');
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (!user) throw new Error('User not found in DB after signup — aborting');
  const token = await prisma.emailVerification.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  if (!token) throw new Error('Verification token not found');
  const verify = await postJSON(`${API}/auth/verify-email`, { code: token.token });
  if (verify.data?.data?.accessToken) pass('Email verified — token received');
  else fail('Email verification', JSON.stringify(verify.data));

  return verify.data.data; // { accessToken, refreshToken }
}

async function testSetRole(authHeaders) {
  section('3. SET ROLE → PET_HOTEL');
  const role = await postJSON(`${API}/auth/set-role`, { role: 'PET_HOTEL' }, authHeaders);
  if (role.data?.data?.accessToken) pass('Role set to PET_HOTEL — new token received');
  else fail('Set role', JSON.stringify(role.data));
  return { Authorization: `Bearer ${role.data.data.accessToken}` };
}

async function testKYC(hotelHeaders) {
  section('4. KYC SUBMISSION');
  const kycForm = buildFormData(
    {
      fullName: 'Hotel Test Owner',
      email: TEST_EMAIL,
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      nationality: 'Bangladeshi',
      identificationType: 'PASSPORT',
      identificationNumber: 'A12345678',
      phoneNumber: TEST_PHONE,
      presentAddress: '123 Test St, Dhaka',
      permanentAddress: '456 Real St, Dhaka',
      emergencyContactName: 'Emergency Contact',
      emergencyContactRelation: 'Brother',
      emergencyContactPhone: '+880123456789',
      roleType: 'HOTEL',
    },
    {
      image: DUMMY_IMAGE,
      identificationFrontImage: DUMMY_IMAGE,
      identificationBackImage: DUMMY_IMAGE,
      signatureImage: DUMMY_IMAGE,
    }
  );
  const kyc = await postForm(`${API}/kyc/submit`, kycForm, hotelHeaders);
  if (kyc.status === 201 || kyc.status === 200) {
    pass('KYC submitted — profile auto-created');
    
    // Manually approve KYC and activate profile in DB
    const profile = await prisma.hotelProfile.findFirst({
      where: { user: { email: TEST_EMAIL } }
    });
    if (profile) {
      await prisma.hotelProfile.update({
        where: { id: profile.id },
        data: { 
          status: 'ACTIVE', 
          isVerified: true 
        }
      });
      // Also update KYC record
      await prisma.kYC.updateMany({
        where: { userId: profile.userId },
        data: { status: 'APPROVED' }
      });
      pass('KYC manually APPROVED and Profile ACTIVATED');
    }
  } else fail('KYC submit', JSON.stringify(kyc.data));
}

async function testEndpoint(label, url, headers) {
  try {
    const res = await get(url, headers);
    if (res.status === 200 || res.status === 201) pass(label);
    else fail(label, `Status ${res.status}: ${JSON.stringify(res.data).substring(0, 120)}`);
    return res.data;
  } catch (e) {
    fail(label, e.message);
  }
}

async function testPatchEndpoint(label, url, body, headers) {
  try {
    const res = await patch(url, body, headers);
    if (res.status === 200 || res.status === 201) pass(label);
    else fail(label, `Status ${res.status}: ${JSON.stringify(res.data).substring(0, 120)}`);
  } catch (e) {
    fail(label, e.message);
  }
}

// ─── Main ────────────────────────────────────────────────

async function run() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   FULL-FLOW API TEST — Hotel Owner Journey   ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`  Email: ${TEST_EMAIL}`);
  console.log(`  Phone: ${TEST_PHONE}`);

  try {
    // ── Auth Flow ──
    const tokens = await testAuthFlow();
    const authHeaders = { Authorization: `Bearer ${tokens.accessToken}` };

    // ── Set Role ──
    const hotelHeaders = await testSetRole(authHeaders);

    // ── KYC ──
    await testKYC(hotelHeaders);

    // ══════════════════════════════════════════════════
    // ██ MODULE TESTS (all Figma sidebar modules) ██
    // ══════════════════════════════════════════════════

    section('5. DASHBOARD');
    await testEndpoint('GET /pet-hotel/dashboard', `${API}/pet-hotel/dashboard`, hotelHeaders);

    section('6. ANALYTICS');
    await testEndpoint('GET /analytics/overview',        `${API}/pet-hotel/analytics/overview`, hotelHeaders);
    await testEndpoint('GET /analytics/trend',           `${API}/pet-hotel/analytics/trend`, hotelHeaders);
    await testEndpoint('GET /analytics/revenue-growth',  `${API}/pet-hotel/analytics/revenue-growth`, hotelHeaders);
    await testEndpoint('GET /analytics/distribution',    `${API}/pet-hotel/analytics/distribution`, hotelHeaders);
    await testEndpoint('GET /analytics/occupancy-weekly', `${API}/pet-hotel/analytics/occupancy-weekly`, hotelHeaders);

    section('7. ROOM MANAGEMENT');
    // CREATE
    const roomForm = buildFormData({
      roomName: 'Suite 101',
      roomNumber: 'S-101',
      description: 'Luxury suite with garden view',
      roomAmenities: ['WiFi', 'AC'],
      roomType: 'PET_ONLY',
      status: 'AVAILABLE',
      petCapacity: '2',
      humanCapacity: '1',
      price: '5000'
    }, { images: DUMMY_IMAGE });
    const createRoom = await postForm(`${API}/room`, roomForm, hotelHeaders);
    let roomId;
    if (createRoom.status === 201) {
      pass('POST /room (Create)');
      roomId = createRoom.data.data.id;
    } else fail('POST /room', JSON.stringify(createRoom.data));

    // LIST
    const myRooms = await testEndpoint('GET /room/me (My Rooms)', `${API}/room/me`, hotelHeaders);
    
    // GET ONE
    if (roomId) {
      await testEndpoint(`GET /room/details/${roomId}`, `${API}/room/details/${roomId}`, hotelHeaders);
      
      // UPDATE
      const updateForm = buildFormData({ description: 'Updated luxury suite' }, {});
      const updateRoom = await patchForm(`${API}/room/update/${roomId}`, updateForm, hotelHeaders);
      if (updateRoom.status === 200) pass('PATCH /room/update/:id (Update)');
      else fail('PATCH /room/update/:id', JSON.stringify(updateRoom.data));

      // DELETE
      const deleteRoom = await del(`${API}/room/remove/${roomId}`, hotelHeaders);
      if (deleteRoom.status === 200) pass('DELETE /room/remove/:id (Delete)');
      else fail('DELETE /room/remove/:id', JSON.stringify(deleteRoom.data));
    }

    section('8. FOOD MENU');
    // CREATE
    const foodForm = buildFormData({
      foodType: 'DRY',
      foodFor: 'PET',
      name: 'Salmon Kibble',
      ingredients: ['Salmon', 'Potato'],
      description: 'High protein salmon kibble',
      price: '1500',
      numberOfServing: '1',
      gramPerServing: '500',
      petCategory: 'Dog',
      petBreed: 'Any',
      calories: '300',
      protein: '25',
      fat: '12',
      isAvailable: 'true'
    }, { files: DUMMY_IMAGE });
    const createFood = await postForm(`${API}/food`, foodForm, hotelHeaders);
    let foodId;
    if (createFood.status === 201) {
      pass('POST /food (Create)');
      foodId = createFood.data.data.id;
    } else fail('POST /food', JSON.stringify(createFood.data));

    // LIST
    await testEndpoint('GET /food/my-foods', `${API}/food/my-foods`, hotelHeaders);
    
    // GET ONE
    if (foodId) {
      await testEndpoint(`GET /food/${foodId}`, `${API}/food/${foodId}`, hotelHeaders);
      
      // UPDATE
      const foodUpdateForm = buildFormData({ price: '1600', prevImages: [] }, {});
      const updateFood = await patchForm(`${API}/food/${foodId}`, foodUpdateForm, hotelHeaders);
      if (updateFood.status === 200) pass('PATCH /food/:id (Update)');
      else fail('PATCH /food/:id', JSON.stringify(updateFood.data));

      // DELETE
      const deleteFood = await del(`${API}/food/${foodId}`, hotelHeaders);
      if (deleteFood.status === 200) pass('DELETE /food/:id (Delete)');
      else fail('DELETE /food/:id', JSON.stringify(deleteFood.data));
    }

    section('9. GUESTS (Bookings)');
    await testEndpoint('GET /booking/hotel-bookings', `${API}/booking/hotel-bookings`, hotelHeaders);

    section('10. FINANCE');
    await testEndpoint('GET /finance/overview',  `${API}/pet-hotel/finance/overview`, hotelHeaders);
    await testEndpoint('GET /finance/history',   `${API}/pet-hotel/finance/history`, hotelHeaders);
    await testEndpoint('GET /finance/timeline',  `${API}/pet-hotel/finance/timeline`, hotelHeaders);

    section('11. SETTINGS — Profile');
    await testEndpoint('GET  /settings/profile', `${API}/pet-hotel/settings/profile`, hotelHeaders);
    await testPatchEndpoint('PATCH /settings/profile', `${API}/pet-hotel/settings/profile`,
      { fullName: 'Updated Hotel Owner' }, hotelHeaders);

    section('12. SETTINGS — Hotel Details');
    await testEndpoint('GET  /settings/hotel', `${API}/pet-hotel/settings/hotel`, hotelHeaders);
    await testPatchEndpoint('PATCH /settings/hotel', `${API}/pet-hotel/settings/hotel`,
      { description: 'A wonderful pet hotel' }, hotelHeaders);

    section('13. SETTINGS — Security');
    await testPatchEndpoint('PATCH /settings/security/2fa', `${API}/pet-hotel/settings/security/2fa`,
      { enable: true }, hotelHeaders);

    section('14. SETTINGS — Notifications');
    await testEndpoint('GET  /settings/notifications', `${API}/pet-hotel/settings/notifications`, hotelHeaders);
    await testPatchEndpoint('PATCH /settings/notifications', `${API}/pet-hotel/settings/notifications`,
      { newBookings: false, paymentUpdates: false }, hotelHeaders);

    section('15. SETTINGS — Banking');
    await testEndpoint('GET  /settings/banking', `${API}/pet-hotel/settings/banking`, hotelHeaders);
    await testPatchEndpoint('PATCH /settings/banking', `${API}/pet-hotel/settings/banking`,
      { bankName: 'Test Bank', accountNumber: '1234567890' }, hotelHeaders);

    section('16. SETTINGS — Documents');
    await testEndpoint('GET /settings/documents', `${API}/pet-hotel/settings/documents`, hotelHeaders);

  } catch (err) {
    console.error('\n💥 FATAL ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }

  // ── Summary ──
  console.log('\n══════════════════════════════════════════════');
  console.log(`  ✅ Passed: ${passCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log(`  ⏭️  Skipped: ${skipCount}`);
  console.log('══════════════════════════════════════════════\n');

  if (failCount > 0) process.exit(1);
}

run();
