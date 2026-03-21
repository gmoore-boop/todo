import {todos, idCounter} from "../data/todos.js";
export function  Controller () {
  this.postTodo = function (req, res){
    try{
      const data = JSON.parse(req.body);

      idCounter.value++; 
      data.id = idCounter.value; 

      todos.push(data);

      res.end(JSON.stringify({message: "Todo received"}));
    } 
    catch (error){
      res.statusCode = 400; 

      res.end(JSON.stringify({message:"Invalid JSON"}));
    }
    return;
  }
  this.getTodo = function (req, res){
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(todos));
    return;
  }
  this.deleteTodo = function (req, res){
    const id = Number(req.params.id); 
    
    //find index of the obj that contains that id 
    const index = todos.findIndex(todo=>todo.id===id);
    
    //if dont find
    if (index===-1) {
      res.statusCode=404;
      res.end (JSON.stringify({message:"Todo not Found"}))
      return;
    }

    //delete that obj using splice
    todos.splice(index,1);

    res.end (JSON.stringify({message:"Item Deleted"}))
    return;
  }
}

