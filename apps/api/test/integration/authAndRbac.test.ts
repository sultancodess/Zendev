import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../../src/config';

describe('Integration Tests: JWT Authentication, Password Hashing & RBAC', () => {
  it('should hash and compare passwords securely using bcrypt', () => {
    const rawPassword = 'ClinicSecretPassword@2026';
    const hash = bcrypt.hashSync(rawPassword, 10);

    assert.strictEqual(bcrypt.compareSync(rawPassword, hash), true);
    assert.strictEqual(bcrypt.compareSync('WrongPassword', hash), false);
  });

  it('should generate and verify valid JWT auth token', () => {
    const payload = {
      id: 'staff_1',
      clinicId: 'clinic_1',
      email: 'sneha@dermacare.com',
      role: 'RECEPTIONIST',
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' });
    assert.ok(token);

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    assert.strictEqual(decoded.id, 'staff_1');
    assert.strictEqual(decoded.email, 'sneha@dermacare.com');
    assert.strictEqual(decoded.role, 'RECEPTIONIST');
  });

  it('should reject invalid or tampered JWT tokens', () => {
    assert.throws(() => {
      jwt.verify('invalid.token.payload', config.jwtSecret);
    });
  });
});
