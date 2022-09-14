import jsonwebtoken from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(401).send({ errMsg: "Token Missing Access denied" });
    }
    const verified = jsonwebtoken.verify(token,"ExpenseTracker");
    req.payload = verified;

    next();
  } catch (e) {
    console.log(e);
    res.status(400).send({ errMsg: "InvalidToken" });
  }
};

export { auth };
