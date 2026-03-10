import { createStore} from "./store/store.js";
import { render } from "./listeners/render.js";
import { reducer } from "./store/reducer.js";
import { registerEvents } from "./events/events.js";


export const store = createStore(reducer);

//localStorage.clear();
/*
if (localStorage.getItem("state")){
    const state = JSON.parse(localStorage.getItem("state"));
    store.dispatch({
        type: "LOAD_STATE",
        payload: state
    })
}
*/

render();
store.subscribe(render);


/*
function saveState () {
    const state = store.getState();
    localStorage.setItem("state", JSON.stringify(state));
}
store.subscribe(saveState);
*/

registerEvents();