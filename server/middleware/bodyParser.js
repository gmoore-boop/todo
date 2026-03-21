export function bodyParser (req, res, next) { 
  let parsed = ""; 
  if (req.method === "POST") { 
    req.on ("data", (chunck) =>{
      parsed+=chunck.toString(); 
    });

    req.on("end", ()=>{
      req.body = parsed; 
      next(); 
    })
  }
  else {
    next(); 
  }
}