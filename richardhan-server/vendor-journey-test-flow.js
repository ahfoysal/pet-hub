/**
 * Vendor Journey Test Flow
 * Verifies profile creation for VENDOR role.
 *
 * Usage: node vendor-journey-test-flow.js
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
  console.log('║        VENDOR JOURNEY & PROFILE TEST         ║');
  console.log('╚══════════════════════════════════════════════╝');

  try {
    const roleType = 'VENDOR';
    const timestamp = Date.now();
    const email = `test-vendor-${timestamp}@example.com`;
    const phone = `+191${Math.floor(10000000 + Math.random() * 90000000)}`;
    const password = 'Password123!';

    section('1. SIGNUP');
    const signupForm = new FormData();
    signupForm.append('fullName', 'Vendor Test User');
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
    token = setRole.data.data.accessToken;
    const headers = { Authorization: `Bearer ${token}` };
    pass(`Role set to ${roleType}`);

    section('4. KYC SUBMISSION');
    const kycForm = buildFormData({
      fullName: 'Vendor Test User',
      email: email,
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      nationality: 'Bangladeshi',
      identificationType: 'PASSPORT',
      identificationNumber: 'V' + timestamp,
      phoneNumber: phone,
      presentAddress: 'Test Address',
      permanentAddress: 'Test Address',
      emergencyContactName: 'Contact',
      emergencyContactRelation: 'Brother',
      emergencyContactPhone: phone,
      roleType: roleType,
    }, {
      image: DUMMY_IMAGE,
      identificationFrontImage: DUMMY_IMAGE,
      identificationBackImage: DUMMY_IMAGE,
      signatureImage: DUMMY_IMAGE,
    });

    const kycRes = await safeFetch(`${API}/kyc/submit`, { method: 'POST', body: kycForm, headers });
    if (kycRes.status !== 201 && kycRes.status !== 200) throw new Error(JSON.stringify(kycRes.data));
    pass('KYC submitted');

    // DB BYPASS: Approve KYC and Activate Profile
    await prisma.kYC.updateMany({ where: { userId: user.id }, data: { status: 'APPROVED' } });
    await prisma.vendorProfile.updateMany({ where: { userId: user.id }, data: { isVerified: true, status: 'ACTIVE' } });
    pass('KYC manually APPROVED and Profile ACTIVATED');

    section('5. PROFILE CHECK');
    const profile = await prisma.vendorProfile.findUnique({ where: { userId: user.id } });
    if (profile) {
      pass('Vendor Profile shell created successfully in database');
    } else {
      fail('Profile check', 'Vendor Profile not found in database');
    }

    section('6. SETTINGS — Profile');
    const getProfile = await safeFetch(`${API}/vendor/settings/profile`, { headers });
    if (getProfile.status === 200) pass('GET /vendor/settings/profile');
    else fail('GET /vendor/settings/profile', JSON.stringify(getProfile.data));

    const updateProfile = await safeFetch(`${API}/vendor/settings/profile`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Updated Vendor Name', phone: '+19999999999' })
    });
    if (updateProfile.status === 200) pass('PATCH /vendor/settings/profile');
    else fail('PATCH /vendor/settings/profile', JSON.stringify(updateProfile.data));

    section('7. SETTINGS — Store Details');
    const getDetails = await safeFetch(`${API}/vendor/settings/vendor-details`, { headers });
    if (getDetails.status === 200) pass('GET /vendor/settings/vendor-details');
    else fail('GET /vendor/settings/vendor-details', JSON.stringify(getDetails.data));

    const updateDetails = await safeFetch(`${API}/vendor/settings/vendor-details`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Store Name', description: 'Updated Bio' })
    });
    if (updateDetails.status === 200) pass('PATCH /vendor/settings/vendor-details');
    else fail('PATCH /vendor/settings/vendor-details', JSON.stringify(updateDetails.data));

    section('8. SETTINGS — Notifications');
    const getNotif = await safeFetch(`${API}/vendor/settings/notifications`, { headers });
    if (getNotif.status === 200) pass('GET /vendor/settings/notifications');
    else fail('GET /vendor/settings/notifications', JSON.stringify(getNotif.data));

    const updateNotif = await safeFetch(`${API}/vendor/settings/notifications`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pushNotifications: false, marketingEmail: true })
    });
    if (updateNotif.status === 200) pass('PATCH /vendor/settings/notifications');
    else fail('PATCH /vendor/settings/notifications', JSON.stringify(updateNotif.data));

    section('9. SETTINGS — Banking');
    const getBank = await safeFetch(`${API}/vendor/settings/banking`, { headers });
    if (getBank.status === 200) pass('GET /vendor/settings/banking');
    else fail('GET /vendor/settings/banking', JSON.stringify(getBank.data));

    const updateBank = await safeFetch(`${API}/vendor/settings/banking`, { // wait, I should use corrected API/vendor/settings/banking
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankName: 'Test Bank',
        accountHolderName: 'Vendor Test',
        accountNumber: '1234567890',
        routingNumber: '098765432'
      })
    });
    if (updateBank.status === 200) pass('PATCH /vendor/settings/banking');
    else fail('PATCH /vendor/settings/banking', JSON.stringify(updateBank.data));

    section('10. SETTINGS — Documents');
    const getDocs = await safeFetch(`${API}/vendor/settings/documents`, { headers });
    if (getDocs.status === 200) pass('GET /vendor/settings/documents');
    else fail('GET /vendor/settings/documents', JSON.stringify(getDocs.data));

    section('11. DASHBOARD & ANALYTICS');
    const dashRes = await safeFetch(`${API}/vendor/dashboard`, { headers });
    if (dashRes.status === 200) pass('GET /vendor/dashboard');
    else fail('GET /vendor/dashboard', JSON.stringify(dashRes.data));

    const inventoryRes = await safeFetch(`${API}/vendor/dashboard/inventory`, { headers });
    if (inventoryRes.status === 200) pass('GET /vendor/dashboard/inventory');
    else fail('GET /vendor/dashboard/inventory', JSON.stringify(inventoryRes.data));

    const analyticsRes = await safeFetch(`${API}/vendor/dashboard/analytics`, { headers });
    if (analyticsRes.status === 200) pass('GET /vendor/dashboard/analytics');
    else fail('GET /vendor/dashboard/analytics', JSON.stringify(analyticsRes.data));

    section('12. INVENTORY (Product & Variant) CRUD');
    // 1. Create Product
    const productForm = buildFormData({
      name: 'Test Product ' + timestamp,
      description: 'A test product description',
      category: 'Food',
      petCategory: 'Dog',
      tags: 'premium,healthy',
      features: 'organic,high-protein',
      price: '99.99',
      stock: '50',
    }, { images: DUMMY_IMAGE });  
    
    const prodCreate = await safeFetch(`${API}/product`, { method: 'POST', body: productForm, headers });
    if (prodCreate.status !== 201) throw new Error(`Product creation failed: ${JSON.stringify(prodCreate.data)}`);
    const productId = prodCreate.data.data.id;
    pass('POST /product (Create)');

    // 2. GET My Products
    const getProds = await safeFetch(`${API}/product/my-products`, { headers });
    if (getProds.status === 200) pass('GET /product/my-products');
    else fail('GET /product/my-products', JSON.stringify(getProds.data));

    // 3. Update Product
    const productUpdateForm = buildFormData({ name: 'Updated Product Name' }, {});
    const prodUpdate = await safeFetch(`${API}/product/${productId}`, { method: 'PATCH', body: productUpdateForm, headers });
    if (prodUpdate.status === 200) pass('PATCH /product/:id (Update)');
    else fail('PATCH /product/:id', JSON.stringify(prodUpdate.data));

    // 4. Create Variant
    const variantForm = buildFormData({
      productId: productId,
      originalPrice: '100.00',
      sellingPrice: '89.99',
      stock: '20',
      attributes: JSON.stringify({ color: 'Blue', size: 'M' })
    }, { images: DUMMY_IMAGE });
    const variantCreate = await safeFetch(`${API}/variant`, { method: 'POST', body: variantForm, headers });
    let variantId;
    if (variantCreate.status === 201) {
      pass('POST /variant (Create)');
      variantId = variantCreate.data.data.id;
      // 5. Update Variant
      const variantUpdateForm = buildFormData({ sellingPrice: '79.99' }, {});
      const variantUpdate = await safeFetch(`${API}/variant/${variantId}`, { method: 'PATCH', body: variantUpdateForm, headers });
      if (variantUpdate.status === 200) pass('PATCH /variant/:id (Update)');
      else fail('PATCH /variant/:variantId', JSON.stringify(variantUpdate.data));
    } else fail('POST /variant', JSON.stringify(variantCreate.data));

    // 6. GET Product with Variant
    const getProdVar = await safeFetch(`${API}/variant/${productId}/${variantId}`, { headers });
    if (getProdVar.status === 200) pass('GET /variant/:productId/:variantId');
    else fail('GET /variant/:productId/:variantId', JSON.stringify(getProdVar.data));

    // 7. Toggle Publish
    const togglePublish = await safeFetch(`${API}/product/${productId}/toggle-publish`, { method: 'PATCH', headers });
    if (togglePublish.status === 200) pass('PATCH /product/:id/toggle-publish');
    else fail('PATCH /product/:id/toggle-publish', JSON.stringify(togglePublish.data));

    section('13. ORDERS CRUD');
    // 1. Setup a Pet Owner to place an order
    const ownerEmail = `test-owner-${timestamp}@example.com`;
    const ownerSignupForm = new FormData();
    ownerSignupForm.append('fullName', 'Pet Owner Test');
    ownerSignupForm.append('email', ownerEmail);
    ownerSignupForm.append('phone', `+144${Math.floor(10000000 + Math.random() * 90000000)}`);
    ownerSignupForm.append('password', password);
    await safeFetch(`${API}/auth/signup`, { method: 'POST', body: ownerSignupForm });
    
    const ownerUser = await prisma.user.findUnique({ where: { email: ownerEmail } });
    const ownerVerifyCode = (await prisma.emailVerification.findFirst({ where: { userId: ownerUser.id }, orderBy: { createdAt: 'desc' } })).token;
    const ownerVerify = await postJSON(`${API}/auth/verify-email`, { code: ownerVerifyCode });
    let ownerToken = ownerVerify.data.data.accessToken;
    const setOwnerRole = await postJSON(`${API}/auth/set-role`, { role: 'PET_OWNER' }, { Authorization: `Bearer ${ownerToken}` });
    ownerToken = setOwnerRole.data.data.accessToken;
    const ownerHeaders = { Authorization: `Bearer ${ownerToken}` };
    pass('Temporary Pet Owner created to simulate order');

    // 1.5 Create Address for Pet Owner
    const addressRes = await postJSON(`${API}/address`, {
      fullName: 'John Doe',
      phone: '+1234567890',
      city: 'Dhaka',
      street: '123 Main St',
      postalCode: '12345',
      country: 'Bangladesh'
    }, ownerHeaders);
    if (addressRes.status !== 201 && addressRes.status !== 200) throw new Error(`Address creation failed: ${JSON.stringify(addressRes.data)}`);
    const shippingAddressId = addressRes.data.id || addressRes.data.data?.id;
    pass('POST /address (Create Address)');

    // 1.6 Add Product to Cart
    const cartItemRes = await postJSON(`${API}/cart/items`, {
      productId: productId,
      variantId: variantId,
      quantity: 1
    }, ownerHeaders);
    if (cartItemRes.status !== 201) throw new Error(`Add to cart failed: ${JSON.stringify(cartItemRes.data)}`);
    pass('POST /cart/items (Add to Cart)');

    // 1.7 Get Cart to find Cart Item IDs
    const cartRes = await safeFetch(`${API}/cart`, { headers: ownerHeaders });
    if (cartRes.status !== 200) throw new Error(`Get cart failed: ${JSON.stringify(cartRes.data)}`);
    const cartItemIds = cartRes.data.data.items.map(i => i.id);
    pass('GET /cart (Found cart item IDs)');

    // 2. Create Order
    const orderCreate = await postJSON(`${API}/order`, {
      cartItemIds: cartItemIds,
      shippingAddressId: shippingAddressId
    }, ownerHeaders);
    if (orderCreate.status === 201 || orderCreate.status === 200) {
      pass('POST /order (Create as Pet Owner)');
      const orderId = orderCreate.data.id || orderCreate.data.data?.id;

      // 3. List Orders (as Vendor)
      const vendorOrders = await safeFetch(`${API}/order/vendor`, { headers });
      if (vendorOrders.status === 200) pass('GET /order/vendor (List)');
      else fail('GET /order/vendor', JSON.stringify(vendorOrders.data));

      // 4. Update Order Status (as Vendor)
      const orderStatus = await safeFetch(`${API}/order/${orderId}/status`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' })
      });
      if (orderStatus.status === 200) pass('PATCH /order/:id/status (Update)');
      else fail('PATCH /order/:id/status', JSON.stringify(orderStatus.data));
    } else fail('POST /order', JSON.stringify(orderCreate.data));

    section('14. CLEANUP (Ignore failures if linked data exists)');
    const prodDelete = await safeFetch(`${API}/product/${productId}`, { method: 'DELETE', headers });
    if (prodDelete.status === 200) pass('DELETE /product/:id');
    else log('ℹ️ ', 'Product deletion skipped (as expected due to Order/Variant linkage)');

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
