export function reducer (state, action){
  switch (action.type){
    case "MANAGE_OPTIONS": {
      const {id, active} = action.payload;

      return {
        ...state, 
        ui: { 
          ...state.ui,
          showOptions:{id, active},
          editMode:{
            active: false,
            id: null
          },
          addTagMode:{
            active: false, 
            id: null
          }
        }
       
      }
    }
    case "MANAGE_FILTER":{
      const options = action.payload.options; 
      return{
        ...state, 
        ui: {
          ...state.ui,
          filter:{...state.ui.filter, options:options}
        }

      };
    }
    case "LOAD_STATE": {
      return action.payload;
    }
    case "ADD_ITEM": { //data change
      const {id, text} = action.payload;
      const tags = state.ui.filter.tags //if there is tags being filtered, item inherit them
      return {
        ...state, 
        data : {
          ...state.data,
          itens: [
            ...state.data.itens, 
            {id, text, done:false, tags:tags}
          ]
        },
        past: [...state.past, state.data]
      }
    }
    case "DELETE_ITEM":{ //data change
      const id = action.payload.id; 
      const itensArray = state.data.itens.filter ((item)=>{return item.id!==id;})
      return {
        ...state, 
        data: {
          ...state.data,
          itens: itensArray,
        },
        ui: {
          ...state.ui,
          showOptions: {
            active:false, 
            id:null
          }
        },
        past: [...state.past, state.data]
      }
    }
    case "DELETE_ITENS":{ //data change
      const ids = [...state.ui.selected]; 
      const array = [...state.data.itens];

      ids.forEach(id=>{
        state.data.itens.forEach(item=>{
          if (item.id === id){
            const index = array.indexOf(item);
            if (index!==-1) array.splice(index,1); 
          }
        })
      })

      return {
        ...state, 
        data:{
          ...state.data,
          itens:array,
        },

        ui: {
          ...state.ui, 
          showOptions: {
            active:false, 
            id:null
          },
          selected: []
        },
        past: [...state.past, state.data]
       
      };
    }
    case "EDITMODE_ON": {
      const id = action.payload.id;
      return {
        ...state,
        ui:{
          ...state.ui, 
          editMode:{
            active: true,
            id: id
          }
        }
      }
    }
    case "EDIT_ITEM":{//data change
      const {newText, id} = action.payload; 
      const array = state.data.itens.map((item)=>{
        if (id===item.id) return {...item, text: newText};
        else return item; 
      });

       
      return {
        ...state, 
        data: {
          ...state.data,  
          itens:[...array], 
        },

        ui:{
          ...state.ui,
          editMode:{
            active: false,
            id: null
          },
          showOptions:{
            active: false,
            id: null
          }
        },
        past: [...state.past, state.data]
      };
     
    }
    case "ADD_DONE":{//data change
      const id = action.payload.id;
      const array = state.data.itens.map ((item)=>{
        if (item.id===id) return {...item, done:true};
        else return item; 
      })
      return {
        ...state, 
        data:{
          ...state.data,
          itens:array, 
        },

        ui:{
          ...state.ui,
          showOptions: {active: false, id:null}
        },
        past: [...state.past, state.data],
      }; 
    }
    case "REM_DONE":{ //data change
      const id = action.payload.id;
      const array = state.data.itens.map ((item)=>{
        if (item.id===id) return {...item, done:false}
        else return item; 
      })
      return {
        ...state, 
        data:{
          ...state.data,
          itens: array, 
        },
        ui: {
          ...state.ui,
          showOptions: {active:false, id:null}
        },
        past: [...state.past, state.data],
      }; 
    }
    case "ADDTAG_ON":{
      const id = action.payload.id; 
      return {
        ...state, 
        ui:{
          ...state.ui,
          addTagMode:{
            active: true,
            id: id
          }
        } 
      }
    }
    case "ADD_TAG":{ //data change
      const {id, tag} = action.payload; 
      const ItensArray = state.data.itens.map((item)=>{
        if (id===item.id) return {...item, tags:[...item.tags, tag]}
        else {return item}; 
      })
  
      const tagArray = [...state.data.tagList]; 
      const exists = tagArray.some(t => t===tag);
      if (!exists) tagArray.push(tag); 

      return {
        ...state, 
        data: {
          ...state.data,
          itens:[...ItensArray],
          tagList:[...tagArray],
        },

        ui:{
          ...state.ui,
          addTagMode:{
            active: false, 
            id:null
          },
          showOptions:{
            active:false,
            id:null
          },
        },
        past: [...state.past, state.data],
      }

    }
    case "DELETE_TAG":{//data change
      const {id,text} = action.payload; 

      const itensArray = state.data.itens.map((item)=>{
        if (item.id===id){
          const tags = item.tags.filter((tag)=>{return tag!==text})
          return {...item, tags: tags}; 
        }
        return item; 
      })
    

      let tagArray=[...state.data.tagList];
      let filter = {...state.ui.filter}; 
      const exists = itensArray.some((item)=>item.tags.some(tag=>tag===text))
      if (!exists){
        tagArray = tagArray.filter((tag)=>{return tag!==text});
        filter.tags = filter.tags.filter((tag)=>{return tag!==text}); //clean filter
      };
      
      //if filter tags is empty, clear it 
      if (filter.tags.length==0) return {
        ...state, 
        data: {
          ...state.data,
          itens: itensArray,
          tagList: tagArray,
        }, 
        ui:{
          ...state.ui,
          filter: {
            options: false, 
            tags: [],
          }
        },
        past: [...state.past, state.data],
      }
      return {
        ...state,
        data: {
          ...state.data,
          itens: itensArray,
          tagList: tagArray
        },
        past: [...state.past, state.data],
      }

    }
    case "FILTER_TAG":{
      const tag = action.payload.tag; 

      if (state.ui.filter.tags.includes(tag)){
        const array = state.ui.filter.tags.filter((tagName)=>{return tagName!==tag})

        return {
          ...state, 
          ui:{
            ...state.ui,
            filter:{
              ...state.ui.filter, tags:array
            }
          }
        }

      }
      else {
        return {
          ...state, 
          ui: {
            ...state.ui,
            filter:{
              ...state.ui.filter, 
              tags:[...state.ui.filter.tags, tag]
            }
          }
        }
      }
    }
    case "MANAGE_SELECTION":{
      const id = action.payload.id; 
      const exists = state.ui.selected.includes(id);
      const array = exists? 
        state.ui.selected.filter(selId=>selId!==id) : [...state.ui.selected, id] ; 
      return {...state, ui: {...state.ui, selected: array}};
    }
    case "UNDO": {
      const past = [...state.past];
      const future = [...state.future]; 

      future.push(state.data); 
      const data = past.pop(); 

      return {
        ...state, 
        past,
        future,
        data
      }
    }
    case "REDO": {
      const past = [...state.past];
      const future = [...state.future]; 

      past.push(state.data);
      const data = future.pop();

      return {
        ...state, 
        past,
        future,
        data
      }
    }
    case "ADD_DONES":{
    }
  
    default:{
      return state;
    }
  }
}