const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Import our Express app

// Configure chai to use chai-http for making requests
chai.use(chaiHttp);
const { expect } = chai;

describe('Authentication API Tests', () => {
  
  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', (done) => {
      const uniqueEmail = `test${Date.now()}@example.com`; // Unique email every time
      
      chai.request(app)
        .post('/api/auth/signup')
        .send({ email: uniqueEmail, password: 'password123' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data.email).to.equal(uniqueEmail);
          done();
        });
    });

    it('should fail if email or password is missing', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send({ email: 'nopassword@example.com' }) // Missing password
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.message).to.include('required');
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should fail with invalid credentials', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Invalid credentials');
          done();
        });
    });
  });
  
});