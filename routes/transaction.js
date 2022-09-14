import { Router } from "express";
import {
  addTransaction,
  getAllTransaction,
  getTypeTransaction
} from "../controllers/transaction.js";
import { auth } from "../middlewares/auth.js";

const TransactionRouter = Router();


export { TransactionRouter };
