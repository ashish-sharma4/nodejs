import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../app.js";
import jwt_decode from "jwt-decode";
import con from "../database.js";

const should = chai.should();
chai.use(chaiHttp);

const port = process.env.PORT || 9090;
const server = app.listen(port);

describe("Main-Tests", function () {
  this.afterAll(async function () {
    server.close();
  });

  this.afterEach(() => {
    let sql = "DELETE FROM user; DELETE FROM Transactions";
    con.run(sql, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  });

  this.beforeAll(() => {
    let sql = "DELETE FROM user; DELETE FROM Transactions";
    con.run(sql, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  });

  describe("User Register", () => {
    it("Invalid Case", async function () {
      try {
        const res = await chai
          .request(server)
          .post("/register")
          .send({ username: "test" });

        res.should.have.status(400);
        res.body.should.have.property("errMsg");
        res.body.errMsg.should.eq("username or password missing");
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe("User Login", () => {
    // Creating A User
    it("Invalid Case", async function () {
      try {
        const res = await chai
          .request(server)
          .post("/login")
          .send({ username: "test" });

        res.should.have.status(400);
        res.body.should.have.property("errMsg");
        res.body.errMsg.should.eq("username or password missing");
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe("All Transactions methods", () => {
    let token1;
    // Creating A User
    this.beforeAll(async () => {
      try {
        const requester = chai.request(server).keepOpen();
        await requester
          .post("/register")
          .send({ username: "test", password: "test" });
        const res = await requester
          .post("/login")
          .send({ username: "test", password: "test" });
        requester.close();
        token1 = res.body.token;
      } catch (error) {
        throw new Error(error);
      }
    });

    it("Token Missing Error For Adding A transaction", async function () {
      try {
        const res = await chai
          .request(server)
          .post("/addtransaction")
          .send({ username: "test", password: "test" });

        res.should.have.status(401);
        res.body.should.have.property("errMsg");
        res.body.errMsg.should.eq("Token Missing Access denied");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("Adding a transaction", async function () {
      try {
        const res = await chai
          .request(server)
          .post("/addtransaction")
          .set("auth-token", token1)
          .send({
            type: "EXPENSE",
            category: "Food",
            datetime: "2022-01-25T19:32:59.362Z",
            amount: 2000,
          });

        res.should.have.status(200);
        res.body.should.have.property("message");
        res.body.message.should.eq("Transaction Added Sucessfully");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("Token Missing Error For getting all transaction", async function () {
      try {
        const res = await chai.request(server).get("/transactions");

        res.should.have.status(401);
        res.body.should.have.property("errMsg");
        res.body.errMsg.should.eq("Token Missing Access denied");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("Getting All Transactions", async function () {
      try {
        const res = await chai
          .request(server)
          .get("/transactions")
          .set("auth-token", token1);

        const userid = jwt_decode(token1);

        res.should.have.status(200);
        res.body[0].should.have.property("amount");
        res.body[0].amount.should.eq(2000);
        res.body[0].should.have.property("type");
        res.body[0].type.should.eq("EXPENSE");
        res.body[0].should.have.property("category");
        res.body[0].category.should.eq("Food");
        res.body[0].should.have.property("datetime");
        res.body[0].datetime.should.eq("2022-01-25T19:32:59.362Z");
        res.body[0].should.have.property("id");
        res.body[0].should.have.property("user_id");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("Token Missing Error For getting type transaction", async function () {
      try {
        const res = await chai.request(server).get("/transaction");

        res.should.have.status(401);
        res.body.should.have.property("errMsg");
        res.body.errMsg.should.eq("Token Missing Access denied");
      } catch (error) {
        throw new Error(error);
      }
    });

    it("Getting Transaction of type EXPENSE", async function () {
      try {
        const res = await chai
          .request(server)
          .get("/transactions?type=EXPENSE")
          .set("auth-token", token1);

        const userid = jwt_decode(token1);

        res.should.have.status(200);
        res.body[0].should.have.property("amount");
        res.body[0].amount.should.eq(2000);
        res.body[0].should.have.property("type");
        res.body[0].type.should.eq("EXPENSE");
        res.body[0].should.have.property("category");
        res.body[0].category.should.eq("Food");
        res.body[0].should.have.property("datetime");
        res.body[0].datetime.should.eq("2022-01-25T19:32:59.362Z");
        res.body[0].should.have.property("id");
        res.body[0].should.have.property("user_id");
        res.body[0].user_id.should.eq(userid.id);
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
