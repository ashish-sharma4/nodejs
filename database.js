import sqlite3 from "sqlite3";
import md5 from "md5";

const sql = sqlite3.verbose();

const DBSOURCE = "db.sqlite";

let con = new sql.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    
    con.run(
      "CREATE TABLE Transactions (id INTEGER PRIMARY KEY AUTOINCREMENT,type text,category text,amount INTEGER,datetime text,user_id INTEGER)"
      ,(err) => {
        console.log("Transaction Table Created")
    });
        
    con.run(
      "CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT,username text,password text)"
    ,(err) => {
        console.log("User Table Created")
    });

  }
});

export default con;
