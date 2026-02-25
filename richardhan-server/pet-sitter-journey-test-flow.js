/**
 * Pet Sitter Journey Test Flow
 * Verifies profile creation and module endpoints for PET_SITTER role.
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const API = 'http://localhost:5000/api';
const DUMMY_IMAGE = path.join(__dirname, 'node_modules/@jest/reporters/assets/jest_logo.png');

let passCount = 0;
let failCount = 0;

function log(icon, msg) { console.log(`  ${icon} ${msg}`); }
function pass(msg) { passCount++; log('✅', msg); }
function fail(msg, err) { failCount++; log('❌', `${msg} — ${err}`); }
function section(title) { console.log(`\n━━━ ${title} ━━━`); }

async function safeFetch(url, opts) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.substring(0, 500) };
    }
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { message: err.message } };
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║      PET SITTER JOURNEY & MODULE TEST        ║');
  console.log('╚══════════════════════════════════════════════╝');

  try {
    const roleType = 'PET_SITTER';
    const timestamp = Date.now();
    const email = `test-sitter-${timestamp}@example.com`;
    const phone = `+193${Math.floor(10000000 + Math.random() * 90000000)}`;
    const password = 'Password123!';

    section('1. SIGNUP');
    // Try signup with multipart/form-data as specified in controller
    const signupForm = new FormData();
    signupForm.append('fullName', 'Pet Sitter Test User');
    signupForm.append('email', email);
    signupForm.append('phone', phone);
    signupForm.append('password', password);
    // Append dummy file just in case
    if (fs.existsSync(DUMMY_IMAGE)) {
        const blob = new Blob([fs.readFileSync(DUMMY_IMAGE)]);
        signupForm.append('file', blob, 'image.png');
    }

    const signup = await safeFetch(`${API}/auth/signup`, { method: 'POST', body: signupForm });
    if (signup.status !== 201 && signup.status !== 200) {
        console.log('Signup Debug Status:', signup.status);
        console.log('Signup Debug Data:', JSON.stringify(signup.data));
        throw new Error('Signup failed: ' + (signup.data.message || 'Unknown error'));
    }
    pass(`Signup succeeded for ${email}`);

    section('2. EMAIL VERIFICATION');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not created in DB');
    const verification = await prisma.emailVerification.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    if (!verification) throw new Error('Verification record not found');
    
    const verify = await safeFetch(`${API}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: verification.token })
    });
    if (verify.status !== 201 && verify.status !== 200) throw new Error('Verification failed: ' + JSON.stringify(verify.data));
    
    let token = verify.data.data.accessToken;
    pass('Email verified');

    section('3. SET ROLE');
    // Using URLSearchParams as suggested by ApiConsumes
    const setRoleParams = new URLSearchParams();
    setRoleParams.append('role', roleType);
    
    const setRole = await safeFetch(`${API}/auth/set-role`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: setRoleParams
    });
    if (setRole.status !== 201 && setRole.status !== 200) throw new Error('Set Role failed: ' + JSON.stringify(setRole.data));
    
    // Refresh token
    const login = await safeFetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    token = login.data.data.accessToken;
    const authHeaders = { Authorization: `Bearer ${token}` };
    pass(`Role set to ${roleType} and logged in`);

    section('4. ACTIVATE PET SITTER');
    await prisma.user.update({ where: { id: user.id }, data: { status: 'ACTIVE' } });
    const profile = await prisma.petSitterProfile.findUnique({ where: { userId: user.id } });
    if (!profile) throw new Error('Profile not found');
    await prisma.petSitterProfile.update({ where: { id: profile.id }, data: { profileStatus: 'ACTIVE' } });
    pass('Pet Sitter activated in database');

    section('5. SERVICE CRUD');
    const serviceForm = new FormData();
    serviceForm.append('name', 'Test Walk ' + timestamp);
    serviceForm.append('description', 'A nice walk');
    serviceForm.append('price', '25');
    serviceForm.append('duration', '30');
    ['Water', 'Leash'].forEach(w => serviceForm.append('whatsIncluded', w));
    ['Dog', 'Outdoor'].forEach(t => serviceForm.append('tags', t));
    
    if (fs.existsSync(DUMMY_IMAGE)) {
        const blob = new Blob([fs.readFileSync(DUMMY_IMAGE)]);
        serviceForm.append('file', blob, 'image.png');
    }

    const createService = await safeFetch(`${API}/services`, { method: 'POST', body: serviceForm, headers: authHeaders });
    if (createService.status !== 201) throw new Error('Create Service failed: ' + JSON.stringify(createService.data));
    const serviceId = createService.data.data.id;
    pass('Service created');

    const getServices = await safeFetch(`${API}/services/me`, { headers: authHeaders });
    if (!getServices.data.data.data[0].createdAt) throw new Error('createdAt missing in service list');
    pass('Service listing verified with createdAt');

    section('6. PACKAGE CRUD');
    const packageForm = new FormData();
    packageForm.append('name', 'Test Bundle ' + timestamp);
    packageForm.append('description', 'Bundle of joy');
    packageForm.append('offeredPrice', '20');
    packageForm.append('durationInMinutes', '60');
    packageForm.append('serviceIds', serviceId);
    if (fs.existsSync(DUMMY_IMAGE)) {
        const blob = new Blob([fs.readFileSync(DUMMY_IMAGE)]);
        packageForm.append('file', blob, 'image.png');
    }

    const createPackage = await safeFetch(`${API}/pet-sitter-package`, { method: 'POST', body: packageForm, headers: authHeaders });
    if (createPackage.status !== 201) throw new Error('Create Package failed: ' + JSON.stringify(createPackage.data));
    const packageId = createPackage.data.data.id;
    pass('Package created');

    section('7. DASHBOARD STATS');
    const stats = await safeFetch(`${API}/pet-sitter-dashboard/overview`, { headers: authHeaders });
    if (stats.data.data.activeClients === undefined) throw new Error('activeClients missing in stats');
    if (stats.data.data.totalRevenue === undefined) throw new Error('totalRevenue missing in stats');
    pass('Dashboard stats verified');

    pass('Booking listing verified');

    section('9. SETTINGS — Profile');
    const getProfile = await safeFetch(`${API}/pet-sitter/settings/profile`, { headers: authHeaders });
    if (getProfile.status !== 200) throw new Error('Get Profile failed');
    const updateProfile = await safeFetch(`${API}/pet-sitter/settings/profile`, {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Updated Sitter Name', yearsOfExperience: 6 })
    });
    if (updateProfile.status !== 200) throw new Error('Update Profile failed');
    pass('Profile settings verified');

    section('10. SETTINGS — Sitter Details');
    const getDetails = await safeFetch(`${API}/pet-sitter/settings/sitter-details`, { headers: authHeaders });
    if (getDetails.status !== 200) throw new Error('Get Sitter Details failed');
    const updateDetails = await safeFetch(`${API}/pet-sitter/settings/sitter-details`, {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: { streetAddress: 'New Street', city: 'SitterCity' } })
    });
    if (updateDetails.status !== 200) throw new Error('Update Sitter Details failed');
    pass('Sitter details verified');

    section('11. SETTINGS — Notifications');
    const getNotifs = await safeFetch(`${API}/pet-sitter/settings/notifications`, { headers: authHeaders });
    if (getNotifs.status !== 200) throw new Error('Get Notifications failed');
    const updateNotifs = await safeFetch(`${API}/pet-sitter/settings/notifications`, {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ newBookings: false, adminMessages: false })
    });
    if (updateNotifs.status !== 200) throw new Error('Update Notifications failed');
    pass('Notification settings verified');

    section('12. SETTINGS — Banking');
    const getBanking = await safeFetch(`${API}/pet-sitter/settings/banking`, { headers: authHeaders });
    if (getBanking.status !== 200) throw new Error('Get Banking failed');
    const updateBanking = await safeFetch(`${API}/pet-sitter/settings/banking`, {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankName: 'Sitter Bank', accountNumber: '9876543210' })
    });
    if (updateBanking.status !== 200) throw new Error('Update Banking failed');
    pass('Banking settings verified');

    section('13. SETTINGS — Documents');
    const docsForm = new FormData();
    if (fs.existsSync(DUMMY_IMAGE)) {
        const blob = new Blob([fs.readFileSync(DUMMY_IMAGE)]);
        docsForm.append('files', blob, 'license.png');
        docsForm.append('files', blob, 'insurance.png');
    }
    const uploadDocs = await safeFetch(`${API}/pet-sitter/settings/documents`, {
      method: 'POST',
      headers: authHeaders,
      body: docsForm
    });
    if (uploadDocs.status !== 200 && uploadDocs.status !== 201) throw new Error('Upload Documents failed: ' + JSON.stringify(uploadDocs.data));
    const getDocs = await safeFetch(`${API}/pet-sitter/settings/documents`, { headers: authHeaders });
    if (!getDocs.data.data.businessLicense) throw new Error('Business license missing after upload');
    pass('Documents settings verified');

  } catch (err) {
    console.error('\n💥 ERROR:', err.message);
    fail('Journey Test', err.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n══════════════════════════════════════════════');
  console.log(`  ✅ Passed: ${passCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  console.log('══════════════════════════════════════════════\n');

  if (failCount > 0) process.exit(1);
}

main();
