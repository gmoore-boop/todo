export function createStore(reducer){
 let state = {
    past: [],
    data: {
      itens:[],
      tagList:[],
    },
    ui:{
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
      selected: [],
    },
    future: [], 
 }

  function getState(){
    const {data, ui} = state; 
    return {data, ui};   
  }

  function getPast(){
    return state.past;
  }

  function getFuture(){
    return state.future; 
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
  
  return {getState, dispatch, subscribe, getPast, getFuture};
}
