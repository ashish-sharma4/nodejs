import { Router } from "express";
import {
  addTransaction,
  getAllTransaction,
  getTypeTransaction
} from "../controllers/transaction.js";
import { auth } from "../middlewares/auth.js";

const TransactionRouter = Router();


TransactionRouter.get("/transactions",auth,getAllTransaction);
TransactionRouter.post("/addtransaction",auth,addTransaction);
TransactionRouter.get("/transaction",auth,getTypeTransaction);

export { TransactionRouter };
