const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token;
  const authHead = req.headers["authorization"];
  console.log("AUTH HEADER:", req.headers["authorization"]);
  if (authHead && authHead.startsWith("Bearer")) {
    token = authHead.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "no token, authorization denied !" });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log("the decoded user is :", req.user);
      next();
    } catch (error) {
      res.status(400).json({ message: "Token is not valid!" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "no token, authorization denied !" });
  }
};

module.exports = verifyToken;
