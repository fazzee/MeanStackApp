const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
  try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "hamari_secret_key_hy_yeh_bandhu");
    next();
  } catch{
    res.status(401).json({
      message: "Authorization Failed by middleware"
    });
  }
}
