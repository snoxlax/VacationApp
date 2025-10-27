import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';

const randomSuffix = () => Math.random().toString(36).slice(2, 8);

test('Requester can submit a vacation request and view it in my list', async () => {
  const email = `req_${randomSuffix()}@example.com`;
  const password = 'Password123!';

  // Sign up requester
  const signup = await request(app)
    .post('/api/auth/signup')
    .send({ email, password, name: 'Requester One', role: 'REQUESTER' })
    .expect(201);

  assert.equal(signup.body.success, true);
  assert.ok(signup.body.token);

  // Submit request
  const token = signup.body.token;
  const today = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const submit = await request(app)
    .post('/api/requests')
    .set('Authorization', `Bearer ${token}`)
    .send({
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      reason: 'Vacation',
    })
    .expect(201);

  assert.equal(submit.body.success, true);
  assert.ok(submit.body.request?.id);

  // List my requests
  const my = await request(app)
    .get('/api/requests/my-requests')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  assert.equal(my.body.success, true);
  assert.ok(Array.isArray(my.body.requests));
  assert.ok(my.body.requests.some((r) => r.id === submit.body.request.id));
});

test('Validator can list, approve and reject requests', async () => {
  // Create requester and submit one
  const emailReq = `req_${randomSuffix()}@example.com`;
  const password = 'Password123!';
  const { body: s1 } = await request(app).post('/api/auth/signup').send({
    email: emailReq,
    password,
    name: 'Requester Two',
    role: 'REQUESTER',
  });
  const tokenReq = s1.token;
  const today = new Date();
  const day2 = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const { body: r1 } = await request(app)
    .post('/api/requests')
    .set('Authorization', `Bearer ${tokenReq}`)
    .send({ startDate: today.toISOString(), endDate: day2.toISOString() });

  // Create validator
  const emailVal = `val_${randomSuffix()}@example.com`;
  const { body: s2 } = await request(app)
    .post('/api/auth/signup')
    .send({ email: emailVal, password, name: 'Validator', role: 'VALIDATOR' });
  const tokenVal = s2.token;

  // List all
  const listAll = await request(app)
    .get('/api/requests/all-requests')
    .set('Authorization', `Bearer ${tokenVal}`)
    .expect(200);
  assert.equal(listAll.body.success, true);

  // Approve the pending request
  const id = r1.request.id;
  const approve = await request(app)
    .put(`/api/requests/${id}/approve`)
    .set('Authorization', `Bearer ${tokenVal}`)
    .expect(200);
  assert.equal(approve.body.success, true);
  assert.equal(approve.body.request.status, 'APPROVED');
});
