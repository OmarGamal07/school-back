const jwt = require("jsonwebtoken");

const TOKEN_KEY = process.env.TOKEN_KEY;

const auth = function (req, res, next) {
  const token = req.headers["x-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("invalid Token");
  }
  return next();
};

module.exports = auth;
