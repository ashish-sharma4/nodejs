import con from '../database.js'
import jwt_decode from "jwt-decode"

  const addTransaction = async(req,res) => {
    try {
      
      const newtransaction = req.body;

      const token = req.header("auth-token");

      const user = jwt_decode(token);

      newtransaction.user_id = user.id;

      let sql = `INSERT INTO Transactions (type,category,amount,datetime,user_id) VALUES ("${newtransaction.type}","${newtransaction.category}","${newtransaction.amount}","${newtransaction.datetime}","${newtransaction.user_id}")`

      con.run(sql,(err,result)=> {
        if(err){
          throw new Error(err)
        }else{
          res.json({message : "Transaction Added Sucessfully"}).status(200);
        }
      })
    } catch (error) {
      res.json({message : "Transaction Adding Failed"}).status(400);
      throw new Error(error)
    }
  }

  const getAllTransaction = async(req,res) => {
    try {
      
      const token = req.header("auth-token");

      const user = jwt_decode(token);

      let sql = `SELECT * FROM Transactions WHERE user_id = "${user.id}"`;

      con.all(sql,(err,result) => {
        if(err){
          throw new Error(err)
        }
        res.json(result).status(200);
      })

    } catch (error) {
      throw new Error(error)
    }
  }

  const getTypeTransaction = async(req,res) => {
    try {
      const type = req.query.type

      const token = req.header("auth-token");

      const user = jwt_decode(token);

      let sql = `SELECT * FROM Transactions WHERE user_id = ${user.id} AND type = ${type}`;

      con.all(sql,(err,result) => {
        if(err){
          throw new Error(err)
        }
        res.json(result).status(200);
      })
    } catch (error) {
      throw new Error(error)
    }
  }

export { addTransaction, getAllTransaction, getTypeTransaction };
