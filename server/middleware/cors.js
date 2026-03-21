export function cors (req, res, next) {
  if (req.method==="OPTION"){ 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, DELETE, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    next(); 
  }
  else {
    next()
  }
}