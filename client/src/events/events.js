import {input, body} from "../listeners/dom.js";
import {store} from "../index.js";


export function registerEvents(){
  //cliques no container 
  
  body.addEventListener("click", (event)=>{
    if(event.ctrlKey){

      if(event.target.classList.contains("liTodo")){
        const buttonTodo = event.target;
        const id= Number(buttonTodo.dataset.id);
       
        store.dispatch({
          type: "MANAGE_SELECTION",
          payload: {id}
        })
      }
    }
    else {
      const action = event.target.dataset.action; 
      if (!action) return; 

      switch (action){
        case "addTodo":{ 
          const text = input.value;
          if (!text.trim()) return;
          const id = Number(Date.now()); 
          store.dispatch({type:"ADD_ITEM", payload:{id,text}});
          break;
        }
        case "hideOptions":{ 
          const id = null; 
          const active = false; 

          store.dispatch({
            type: "MANAGE_OPTIONS",
            payload: {id,active}
          });
            break;
          }
        case "showOptions":{
          const buttonTodo = event.target;
          const id = Number(buttonTodo.dataset.id); 
          if (store.getState().ui.showOptions.id===id) return;
          const active = true; 
          store.dispatch({
            type: "MANAGE_OPTIONS",
            payload: {id,active}
          });
          break;
        }
        case "delete": {
          const buttonTodo = event.target.closest(".liTodo");
          const id = Number(buttonTodo.dataset.id); 
          store.dispatch({
              type: "DELETE_ITEM",
              payload: {id}
          });
          
          //dispathing possible deleting of item tags
          const tags = buttonTodo.querySelectorAll(".spanTagText");
          tags.forEach((tag)=>{
            const text = tag.textContent; 
            store.dispatch({
              type: "DELETE_TAG",
              payload: {text, id}
            })
          })

          break;
        }
        case "edit": {
          const buttonTodo = event.target.closest(".liTodo");
          const id = Number(buttonTodo.dataset.id);
          store.dispatch ({
              type: "EDITMODE_ON",
              payload: {id}
          })
          break;
        }
        case "confirmEdit": {
          const buttonTodo = event.target.closest(".liTodo");
          const id = Number(buttonTodo.dataset.id);

          const parent = event.target.parentNode;
          const input = parent.querySelector("input");
          store.dispatch({
              type: "EDIT_ITEM",
              payload:{
              newText: input.value,
              id:id 
              }
          });
          break;
        }
        case "addDone":{
          const buttonTodo = event.target.closest(".liTodo");
          const text = buttonTodo.querySelector("span").textContent; 
          const id = Number(buttonTodo.dataset.id);

          store.dispatch({
            type: "ADD_DONE",
            payload:{id,text}
          });

          const tag = "DONE"

          store.dispatch({
            type: "ADD_TAG",
            payload: {id,tag}
          })
          break;
        }
        case "remDone":{
          const buttonTodo = event.target.closest(".liTodo");
          const id = Number(buttonTodo.dataset.id);

          store.dispatch({
            type: "REM_DONE",
            payload:{id}
          });

          const text = "DONE"

          store.dispatch({
            type: "DELETE_TAG",
            payload: {id,text}
          })

          break;
        }
        case "addTagOn":{
          const buttonTodo = event.target.closest(".liTodo");
          const id = buttonTodo.dataset.id; 

          store.dispatch({
            type: "ADDTAG_ON",
            payload: {id}
          })
          break; 
        }
        case "confirmTag":{
          const buttonTodo = event.target.closest(".liTodo");
          const id = Number(buttonTodo.dataset.id);
          const input = buttonTodo.querySelector(".inputTag");
          if (!input.value.trim()) return; 
          store.dispatch({
            type: "ADD_TAG", 
            payload: {
              id: id, 
              tag: input.value.trim().toUpperCase()
            }
          })
          break;
        }
        case "deleteTag":{
          const li = event.target.closest(".liTag");
          const buttonTodo = li.closest(".liTodo");
          const id = Number(buttonTodo.dataset.id);
          const text = li.querySelector(".spanTagText").textContent.trim().toUpperCase();
          
          store.dispatch({
            type: "DELETE_TAG",
            payload: {id, text}
          })

          break;
        }
        case "manageFilterOptions":{
          store.dispatch({
            type:"MANAGE_FILTER",
            payload:{
              options: !store.getState().ui.filter.options
            }
          })
          break;
        }
        case "filterTag":{
          const tag = event.target.textContent; 
          store.dispatch({
            type: "FILTER_TAG",
            payload: {tag}
          })
        }
        default: return; 
      };
    }
});

  body.addEventListener("keydown", (event)=>{
    const classList = event.target.classList;  
    if (event.ctrlKey){
      switch (event.key){
        case "Backspace":{
          const selected = [...store.getState().ui.selected];
          const items = [...store.getState().data.itens];


          //find the items that are selected
          const selectedItems = items.filter((item)=>{
            return selected.includes(item.id); 
          })


          //find the item tags and respectives ids and put it in a array of obj 
          const arrObj = []; 
          selectedItems.forEach(item=>{
            const id = item.id;
            const tags = item.tags;
  
            tags.forEach(tag=>{
              const text = tag; 
              arrObj.push({text,id});
            })
          })

   

          //iterate in the array of obj and call a delete tag for eachOne 
          arrObj.forEach(element=>{
            const {text,id} = element; 
            store.dispatch({
              type: "DELETE_TAG",
              payload: {text,id}
            })
          })
          
          
          store.dispatch({
            type:"DELETE_ITENS"
          });

          break;
        }
        case "Enter":{
          
          break;
        }
        case "z":{
          const past = store.getPast(); 
          if (past.length===0) return; 
          store.dispatch({
            type: "UNDO",
          })
          break;
        }
        case "m":{
          const future = store.getFuture(); 
          if (future.length===0) return; 
          store.dispatch({
            type: "REDO",
          })
          break;
        }
      } 
       
    }

    if (classList.contains("liTodo")){ 
      switch (event.key){
        case "Backspace":{
            const buttonTodo = event.target;
            const id = Number(buttonTodo.dataset.id); 

            store.dispatch({
              type: "DELETE_ITEM",
              payload: {id}
            });

            //dispathing possible deleting of item tags
            const tags = buttonTodo.querySelectorAll(".spanTagText");
            tags.forEach((tag)=>{
              const text = tag.textContent; 

              store.dispatch({
                type: "DELETE_TAG",
                payload: {text, id}
              })
            })
            
            break;
        }
        case "Enter": {
          const buttonTodo = event.target; 
          const id = Number(buttonTodo.dataset.id); 
          const text = buttonTodo.querySelector("span").textContent; 
          const type = buttonTodo.name==="doneLiTodo"? "REM_DONE" : "ADD_DONE"; 
            
          store.dispatch({
            type: type,
            payload:{
              text, 
              id
            }
          })



          
          if (type==="REM_DONE") {
            const text = "DONE"
            store.dispatch({type: "DELETE_TAG", payload: {id,text}})
          }
          else {
            const tag = "DONE"
            store.dispatch({type: "ADD_TAG", payload: {id,tag}})
          }
          break;
        }
        default:{return}
       }
    }

    if (classList.contains("inputAdd")){
      if (event.key==="Enter"){
        const text = input.value;
        if (!text.trim()) return;
        const id = Number(Date.now()); 
        store.dispatch({type:"ADD_ITEM", payload:{id,text}});
      }
      else return; 
    }
    
    if (classList.contains("inputEdit")){
      if (event.key==="Enter"){
        const input = event.target; 
        const buttonTodo = input.parentNode.parentNode;
        const id = Number(buttonTodo.dataset.id);
        
        store.dispatch({
          type: "EDIT_ITEM",
          payload:{
            newText: input.value,
            id:id 
          }
        });
      }
      else return
    }

    if (classList.contains("inputTag")){
      if (event.key==="Enter"){

        const input = event.target; 

        const buttonTodo = input.parentNode.parentNode;
        const id = Number(buttonTodo.dataset.id);

        if (!input.value.trim()) return;

        store.dispatch({
          type: "ADD_TAG", 
          payload: {
            id: id, 
            tag: input.value.trim().toUpperCase()
          }
        })
      }
      else return

   }
  
  });

};
