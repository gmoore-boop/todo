import http from "http"; 
import { routes } from "./routes/todos.js";
import { cors } from "./middleware/cors.js";
import { bodyParser } from "./middleware/bodyParser.js";

function runMiddlewares (req, res, middlewares){
  let index = 0; 

  function next() {
    const middleware = middlewares[index]; 
    index++; 

    if (middleware) {
      middleware (req, res, next); 
    }
  }
  next(); 
}

const server = http.createServer((req, res)=>{
 runMiddlewares(req, res, [cors, bodyParser, routes]); 
});



 

server.listen(3000); 