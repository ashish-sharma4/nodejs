import express from "express";
import dotenv from "dotenv";
import { UsersRouter } from "./routes/users.js";
import {TransactionRouter} from "./routes/transaction.js"
import con from './database.js'


dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Content-Type, auth-token');
  // response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.get('/',(req,res) => {res.send("Welcome Node")});

app.use(UsersRouter,TransactionRouter);

export { app };
