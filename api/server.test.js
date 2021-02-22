const db = require('../data/dbConfig.js');
const server = require('./server.js');
const supertest = require('supertest');
const User = require('./users/users-model');
// Write your tests here

const validUser = { username: 'testuser', password: 'test'}

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async () => {
    await db('users').truncate();
});

afterAll(async () => {
    await db.destroy();
})

test('sanity', () => {
  expect(true).toBe(false)
})

describe('server', () => {

	describe('insert()', () => {

		it("POST /login, if there is no user found it returns an error", async () => {
        const res = await supertest(server)
         .post("/api/auth/login")
         .send({
             username: "fakeuser",
             password: "fakepassword"
         })
        expect(res.statusCode).toBe(401)
    })

		it("POST /login, if the password input is wrong it returns an error", async () => {
        const res = await supertest(server)
         .post("/api/auth/login")
         .send({
             username: "testuser",
             password: "fakepassword"
         })
        expect(res.statusCode).toBe(401)
    })

		it("POST /register, if the username already exists it returns an error", async () => {
        let res = await supertest(server)
         .post("/api/auth/register")
         .send(validUser)
        let res1 = await supertest(server)
         .post("/api/auth/register")
         .send(validUser)
        expect(res.statusCode).toBe(409)
    })

    it("POST /register, if everything checks out it returns a success message", async () => {
        const res = await supertest(server)
         .post("/api/auth/register")
         .send(validUser)
        expect(res.statusCode).toBe(201)
    })
	})

	describe("Dad jokes tests", () => {
		
		it("returns a JSON object", async () => {
		    const res = await supertest(server).get("/api/jokes");
		    expect(res.type).toBe("application/json");
		  });

		it("GET /, if the user is not authenticated, they will not be let in", async () => {
		    const res = await supertest(server)
		     .get("/api/jokes")
		    expect(res.statusCode).toBe(401)

		})
	})
})