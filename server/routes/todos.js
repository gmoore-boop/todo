import { Controller } from "../controllers/todosController.js";
const controller = new Controller()

const objRoutes = [
  { method: "GET", path: "/todos", handler: controller.getTodo},
  { method: "POST", path: "/todos", handler: controller.postTodo},
  { method: "DELETE", path: "/todos/:id", handler: controller.deleteTodo}
];

export function routes (req, res){
  for (const route of objRoutes) {
    
    if (req.method!==route.method) continue; 
    
    const pathParts = route.path.split("/"); 
    const urlParts = req.url.split("/");
    if (urlParts.length!==pathParts.length) continue; 

    let match = true; 
    const params = {};

    for (let [index, value] of pathParts.entries()) {

      if (value.startsWith(":")){
        const id = urlParts[index]; 

        const key = value.slice(1); 
        params[key] = id; 

        if (isNaN(Number(id))) {
          match = false; 
          break;
        }
      }
      else {
        if (value!==urlParts[index]) {
          match = false; 
          break;
        }
      }
    }
    if (match) {
      req.params = params; 
      route.handler (req ,res); 
      return; 
    }
  }
  res.statusCode=404; 
  res.end (JSON.stringify({message:"Route not Found"}));
  return;
}