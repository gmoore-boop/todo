export function reducer (state, action){
  switch (action.type){
    case "UNDONE":{
  
    }
    case "MANAGE_OPTIONS": {
      const {id, active} = action.payload;

      return {
        ...state, 
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
    case "MANAGE_FILTER":{
      const options = action.payload.options; 
      return{...state, filter:{...state.filter, options:options}};
    }
    case "LOAD_STATE": {
      return action.payload;
    }
    case "ADD_ITEM": {
      const {id, text} = action.payload;
      const tags = state.filter.tags //if there is tags being filtered, item inherit them
      return {...state, itens: [
        ...state.itens, 
        {id, text, done:false, tags:tags}
      ]};
    }
    case "DELETE_ITEM":{
      const id = action.payload.id; 
      const itensArray = state.itens.filter ((item)=>{return item.id!==id;})
      return {
        ...state, 
        itens: itensArray,
        showOptions: {
          active:false, 
          id:null
        }
      }
    }
    case "DELETE_ITENS":{
      const ids = [...state.selected]; 
      const array = [...state.itens];

      ids.forEach(id=>{
        state.itens.forEach(item=>{
          if (item.id === id){
            const index = array.indexOf(item);
            if (index!==-1) array.splice(index,1); 
          }
        })
      })

      return {
        ...state, 
        itens: array,
        showOptions: {
          active:false, 
          id:null
        },
        selected: []
      };
    }
    case "EDITMODE_ON": {
      const id = action.payload.id;
      return {...state, editMode:{
        active: true,
        id: id
      }}
    }
    case "EDIT_ITEM":{
      const {newText, id} = action.payload; 
      const array = state.itens.map((item)=>{
        if (id===item.id) return {...item, text: newText};
        else return item; 
      });

       
      return {...state, 
        itens:[...array], 
        editMode:{
          active: false,
          id: null
        },
        showOptions:{
          active: false,
          id: null
        }
      };
     
    }
    case "ADD_DONE":{
      const id = action.payload.id;
      const array = state.itens.map ((item)=>{
        if (item.id===id) return {...item, done:true};
        else return item; 
      })
      return {...state, itens:array, showOptions: {active: false, id:null}}; 
    }
    case "REM_DONE":{
      const id = action.payload.id;
      const array = state.itens.map ((item)=>{
        if (item.id===id) return {...item, done:false}
        else return item; 
      })
      return {...state, itens: array, showOptions: {active:false, id:null}}; 
    }
    case "ADDTAG_ON":{
      const id = action.payload.id; 
      return {...state, addTagMode:{
        active: true,
        id: id
      }}
    }
    case "ADD_TAG":{
      const {id, tag} = action.payload; 
      const ItensArray = state.itens.map((item)=>{
        if (id===item.id) return {...item, tags:[...item.tags, tag]}
        else {return item}; 
      })
  
      const tagArray = [...state.tagList]; 
      const exists = tagArray.some(t => t===tag);
      if (!exists) tagArray.push(tag); 

      return {...state, 
        itens:[...ItensArray],
        addTagMode:{
          active: false, 
          id:null
        },
        showOptions:{
          active:false,
          id:null
        },
        tagList:[...tagArray],
      }

    }
    case "DELETE_TAG":{
      const {id,text} = action.payload; 

      const itensArray = state.itens.map((item)=>{
        if (item.id===id){
          const tags = item.tags.filter((tag)=>{return tag!==text})
          return {...item, tags: tags}; 
        }
        return item; 
      })
    

      let tagArray=[...state.tagList];
      const exists = itensArray.some((item)=>item.tags.some(tag=>tag===text))
      if (!exists){
        tagArray = tagArray.filter((tag)=>{return tag!==text})
      }
    

      return {
        ...state,
        itens: itensArray,
        tagList: tagArray
      }

    }
    case "FILTER_TAG":{
      const tag = action.payload.tag; 

      if (state.filter.tags.includes(tag)){
        const array = state.filter.tags.filter((tagName)=>{return tagName!==tag})

        return {...state, filter:{
          ...state.filter, tags:array
        }}

      }
      else {
        return {
          ...state, filter:{
            ...state.filter, tags:[...state.filter.tags, tag]
          }
        }
      }
    }
    case "MANAGE_SELECTION":{
      const id = action.payload.id; 
      const exists = state.selected.includes(id);
      const array = exists? 
        state.selected.filter(selId=>selId!==id) : [...state.selected, id] ; 
      return {...state, selected: array};
    }
    case "ADD_DONES":{
    }
  
    default:{
      return state;
    }
  }
}