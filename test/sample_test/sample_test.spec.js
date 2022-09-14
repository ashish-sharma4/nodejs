import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.js";
import jwt_decode from "jwt-decode";
import con from "../database.js";

const should = chai.should();
chai.use(chaiHttp);

const port = process.env.PORT || 9090;
const server = app.listen(port);

describe("Sample-Tests", function () {
  this.afterAll(async function () {
    server.close();
  });

  this.beforeAll(() => {
    let sql = "DELETE FROM user; DELETE FROM Transactions";
    con.run(sql, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  });

  it("Register", async function () {
    try {
      const res = await chai
        .request(server)
        .post("/register")
        .send({ username: "test", password: "test" });

      res.should.have.status(201);
      res.body.should.have.property("msg");
      res.body.msg.should.eq("Users created Successfully");
    } catch (error) {
      throw new Error(error);
    }
  });

  it("Login", async function () {
    try {
      const res = await chai
        .request(server)
        .post("/login")
        .send({ username: "test", password: "test" });

      res.should.have.status(200);
      res.body.should.have.property("msg");
      res.body.msg.should.eq("Success");
      res.body.should.have.property("token");
    } catch (error) {
      throw new Error(error);
    }
  });
});
