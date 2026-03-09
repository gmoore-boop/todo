export function createStore(reducer){
 let state = {
    past: [],
    present: {
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
    },
    future: [], 
 }

  function getState(){
    return state.present; 
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
    if (action.type==="UNDO"){
      state.future.push(state.present); 
      state.present = state.past.pop(); 
    }
    else if (action.type==="REDO"){
      state.past.push(state.present);
      state.present = state.future.pop(); 
    }
    else{
      state.past.push(state.present);
      state.present = reducer (state.present,action);
    }
    listeners.forEach((listener)=>{listener()});
  }
  
  return {getState, dispatch, subscribe, getPast, getFuture};
}
