import con from "../database.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const createUsers = async (req, res) => {
  try {
    const body = req.body;
    if (!body.password || !body.username) {
      return res.status(400).send({ errMsg: "username or password missing" });
    }

    let sql = `SELECT * FROM user WHERE username = "${body.username}"`;

    con.all(sql, async (err, result) => {
      if (err) {
        res.status(400).send({ errMsg: "UnknownError", error: err });
        throw err;
      } else {
        if (result.length == 0) {
          const salt = await bcrypt.genSalt(8);
          const hashpswd = await bcrypt.hash(body.password, salt);

          sql = `INSERT INTO user (username,password) VALUES ("${body.username}","${hashpswd}")`;

          con.run(sql, (err, result) => {
            res.status(201).send({ msg: "Users created Successfully" });
          });
        } else {
          return res.status(401).send({ errMsg: "Username already exists" });
        }
      }
    });
  } catch (e) {
    res.status(400).send({ errMsg: "UnknownError", error: e });
  }
};
const loginUsers = async (req, res) => {
  try {
    const body = req.body;
    if (!body.username || !body.password) {
      return res.status(400).send({ errMsg: "username or password missing" });
    }

    let sql = `SELECT * FROM user WHERE username = "${body.username}"`;

    con.all(sql, async (err, result) => {
      if (result.length == 0) {
        return res
          .status(400)
          .send({ errMsg: "incorrect username or password" });
      } else {
        const verify = await bcrypt.compare(body.password, result[0].password);
        if (!verify) {
          return res
            .status(400)
            .send({ errMsg: "incorrect username or password" });
        }
        const token = jsonwebtoken.sign({ id: result[0].id }, "ExpenseTracker");
        res.status(200).send({ msg: "Success", token });
      }
    });
  } catch (e) {
    res.status(400).send({ errMsg: "UnknownError", error: e });
  }
};

export { loginUsers, createUsers };
