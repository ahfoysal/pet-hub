/**
 * School Journey Test Flow
 * Verifies profile creation for SCHOOL role.
 *
 * Usage: node school-journey-test-flow.js
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
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: { message: text.substring(0, 200) } };
  }
}

async function postJSON(url, body, headers = {}) {
  return safeFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

function buildFormData(fields, files) {
  const form = new FormData();
  for (const [key, val] of Object.entries(fields)) {
    form.append(key, val);
  }
  for (const [key, filePath] of Object.entries(files)) {
    if (fs.existsSync(filePath)) {
      const blob = new Blob([fs.readFileSync(filePath)]);
      form.append(key, blob, 'image.png');
    }
  }
  return form;
}

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║        SCHOOL JOURNEY & PROFILE TEST         ║');
  console.log('╚══════════════════════════════════════════════╝');

  try {
    const roleType = 'PET_SCHOOL';
    const kycRoleType = 'SCHOOL';
    const timestamp = Date.now();
    const email = `test-school-${timestamp}@example.com`;
    const phone = `+192${Math.floor(10000000 + Math.random() * 90000000)}`;
    const password = 'Password123!';

    section('1. SIGNUP');
    const signupForm = new FormData();
    signupForm.append('fullName', 'School Test User');
    signupForm.append('email', email);
    signupForm.append('phone', phone);
    signupForm.append('password', password);
    
    const signup = await safeFetch(`${API}/auth/signup`, { method: 'POST', body: signupForm });
    if (signup.status !== 201 && signup.status !== 200) throw new Error(JSON.stringify(signup.data));
    pass(`Signup succeeded for ${email}`);

    section('2. EMAIL VERIFICATION');
    const user = await prisma.user.findUnique({ where: { email } });
    const verification = await prisma.emailVerification.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    const verify = await postJSON(`${API}/auth/verify-email`, { code: verification.token });
    let token = verify.data.data.accessToken;
    pass('Email verified');

    section('3. SET ROLE');
    const setRole = await postJSON(`${API}/auth/set-role`, { role: roleType }, { Authorization: `Bearer ${token}` });
    if (setRole.status !== 201 && setRole.status !== 200) {
      console.error('SET ROLE FAILED:', JSON.stringify(setRole.data, null, 2));
      throw new Error(`Set role failed with status ${setRole.status}`);
    }
    token = setRole.data.data.accessToken;
    const headers = { Authorization: `Bearer ${token}` };
    pass(`Role set to ${roleType}`);

    section('4. KYC SUBMISSION');
    const kycForm = buildFormData({
      fullName: 'School Test User',
      email: email,
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      nationality: 'Bangladeshi',
      identificationType: 'PASSPORT',
      identificationNumber: 'S' + timestamp,
      phoneNumber: phone,
      presentAddress: 'Test Address',
      permanentAddress: 'Test Address',
      emergencyContactName: 'Contact',
      emergencyContactRelation: 'Brother',
      emergencyContactPhone: phone,
      roleType: kycRoleType,
    }, {
      image: DUMMY_IMAGE,
      identificationFrontImage: DUMMY_IMAGE,
      identificationBackImage: DUMMY_IMAGE,
      signatureImage: DUMMY_IMAGE,
    });

    const kycRes = await safeFetch(`${API}/kyc/submit`, { method: 'POST', body: kycForm, headers });
    if (kycRes.status !== 201 && kycRes.status !== 200) throw new Error(JSON.stringify(kycRes.data));
    pass('KYC submitted');

    section('5. PROFILE CHECK');
    const profile = await prisma.petSchoolProfile.findUnique({ where: { userId: user.id } });
    if (profile) {
      pass('School Profile shell created successfully in database');
    } else {
      fail('Profile check', 'School Profile not found in database');
    }

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
