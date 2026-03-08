export function createStore(reducer){
 
 let state = {
    itens:[],
    showOptions:{
      active: false,
      id: null
    },
    editMode:{
      active: false,
      id: null
    },
    addTagMode:{
      active: false,
      id: null
    },
    filter: {
      options: false, 
      tags: []
    },
    tagList:[],
    selected: [],
  };

  function getState(){
    return state; 
  }

  let listeners=[];
  
  function subscribe(listener){
    listeners.push(listener);
    
    return function unsubscribe (){
      const index = listeners.indexOf(listener);
      if (index>-1){
        listeners.splice(index,1);
      };
    };
  };

  function dispatch(action){
    state = reducer (state,action);
    listeners.forEach((listener)=>{listener()});
  }
  
  return {getState, dispatch, subscribe};
}
