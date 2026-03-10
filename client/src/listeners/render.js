import {ul, input, containerFilter} from "./dom.js";
import {todoTemplate, editTemplate, todoOptionsTemplate} from "./dom.js";
import {doneEditTemplate, doneTodoTemplate, doneOptionsTemplate} from "./dom.js";
import {AddTagTemplate, tagTemplate} from "./dom.js";
import {filterOptionsTemplate, selectedFilterOptionsTemplate} from "./dom.js";
import {selectedItemTemplate} from "./dom.js";

import {store} from "../index.js";

export function render(){
  //console.log(store.getState())
  renderItem();
  renderShowOptions();
  renderEdit(); 
  renderAddTag();
  renderTags();
  renderFilter();
  renderSelected();
}

function renderItem(){
  const state = store.getState();
  ul.replaceChildren();  
  const itens = [...state.data.itens];
  if (!itens) return;
  

  itens.forEach((item)=>{

    const tags = [...item.tags]; 
    const filterTags = [...state.ui.filter.tags];

    let exists = true; 
    filterTags.forEach ((filterTag)=>{
      if (!tags.includes(filterTag)) exists = false; 
    })

    if (filterTags.length===0 || exists){
      const template = item.done? doneTodoTemplate : todoTemplate;
      const li = template.content.querySelector("li").cloneNode(true);
      const buttonTodo = li.querySelector("button");
      buttonTodo.dataset.id = item.id;
      li.querySelector(".spanText").textContent = item.text; 
      ul.append(li);
    }
    else return; 

  })
  input.value = ""; 
}
function renderShowOptions () {

  const state = store.getState();
  
  if (state.ui.showOptions.active){
    

    const id = state.ui.showOptions.id; 

    const buttonsTodo = [...ul.querySelectorAll(".liTodo")];
    const buttonTodo = buttonsTodo.find(li =>( Number(li.dataset.id)) === id);
    if (!buttonTodo) return; 

    const item = state.data.itens.find(item => item.id === id);
    const template = item.done? doneOptionsTemplate : todoOptionsTemplate;
    const div = template.content.querySelector(".divTodoOptions").cloneNode(true);
    buttonTodo.append(div);
    buttonTodo.focus() 
  }
    
 
}
function renderEdit () {

  const state = store.getState();

  if (state.ui.editMode.active){
   

    const id = state.ui.editMode.id;
    

    const buttonsTodo = [...ul.querySelectorAll(".liTodo")];
    const buttonTodo = buttonsTodo.find(li =>( Number(li.dataset.id)) === id);
    if (!buttonTodo) return; 

    const item = state.data.itens.find(item => item.id === id);

    const template = item.done? doneEditTemplate : editTemplate;

    const div = template.content.querySelector(".divEdit").cloneNode(true);
    div.querySelector(".inputEdit").value = item.text; 
    buttonTodo.replaceChildren(div);
  }
   
}
function renderAddTag (){

  const state = store.getState();

  if(state.ui.addTagMode.active){
   
    const id = state.ui.addTagMode.id;

    const buttonsTodo = [...ul.querySelectorAll(".liTodo")];
    const buttonTodo = buttonsTodo.find((buttonTodo) =>( buttonTodo.dataset.id === id));
    if (!buttonTodo) return; 

    const template = AddTagTemplate;

    const div = template.content.querySelector(".divAddTag").cloneNode(true);
    buttonTodo.replaceChildren(div);
  }
}
function renderTags(){

  const state = store.getState();

  if (state.ui.showOptions.active){
    
   
    
    const id = state.ui.showOptions.id; 

    const buttonsTodo = [...ul.querySelectorAll(".liTodo")];
    const buttonTodo = buttonsTodo.find(li =>( Number(li.dataset.id)) === id);
    if (!buttonTodo) return; 

    const ulTag = buttonTodo.querySelector(".ulTagList");
    
    
    const item = state.data.itens.find(item => item.id === id);
    item.tags.forEach((tag)=>{
      const template = tagTemplate;
      const li = template.content.querySelector(".liTag").cloneNode(true);
      const span = li.querySelector(".spanTagText"); 

      span.textContent = tag; 

      if (ulTag) ulTag.append(li);
      else return;
    })

  }
}
function renderFilter(){
  const state = store.getState();

  if (state.ui.filter.options){
    let divFilter = containerFilter.querySelector(".divFilter");
    if (!divFilter){
      divFilter = filterOptionsTemplate.content.querySelector(".divFilter").cloneNode(true);
      containerFilter.append(divFilter);
    }

  divFilter.replaceChildren();

    state.data.tagList.forEach((tag)=>{
      const isFiltering = state.ui.filter.tags.includes(tag);
      const template = isFiltering? selectedFilterOptionsTemplate: filterOptionsTemplate;
      const buttonTag = template.content.querySelector(".buttonTag, .selectedButtonTag").cloneNode(true); 
      buttonTag.textContent = tag; 
      divFilter.append(buttonTag);
    })
  }
  else {
    const buttonFilter = containerFilter.querySelector(".buttonFilter"); 
    containerFilter.replaceChildren(buttonFilter);
  }
  
 
}
function renderSelected(){
  const state = store.getState();
  const selected = [...state.ui.selected];

  if (selected.length!==0){
    const buttonsTodo = ul.querySelectorAll(".liTodo"); 

    buttonsTodo.forEach(buttonTodo=>{
      const id = Number(buttonTodo.dataset.id);
      const includes = selected.includes(id);
      if (includes){
        const template = selectedItemTemplate.content;
        const btnSelected = template.querySelector(".btnSelected").cloneNode(true);
        const li = buttonTodo.parentNode;
        
        li.replaceChildren(btnSelected, buttonTodo);
      }
    })
 }

}