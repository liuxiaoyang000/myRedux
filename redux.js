function createStore(reducer,fn) {
  let state;
  let listeners = [];
  let getState = () => state;
  let subscribe = (fn) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l =>l!=fn);
    }
  }
  // 如果传进来的是一个函数 说明这个是applyMiddleware
  if(typeof fn === 'function'){
    return fn(createStore)(reducer);
  }
  let dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(fn => fn());
  }
  dispatch({ type: '@INIT' });
  return {
    subscribe,
    getState,
    dispatch
  }
}
let combineReducers = (reducers) => {
  let obj = {}
  return (state = {}, action) => {
    for (let key in reducers) {
      obj[key] = reducers[key](state[key], action);
    }
    return obj;
  }
}
// mapStateToProps, (dispatch)=>bindActionCreators(actions,dispatch)
let bindActionCreators = (actions, dispatch) => {
  let obj = {}
  for(let key in actions){
    obj[key] = (...args) => dispatch(actions[key](...args));
  }
  return obj;
}

let compose = (...fns)=>{
  return fns.reduce((a,b)=>(...args)=>a(b(...args)));
}
let applyMiddleware = (...middlewares)=> (createStore)=> (reducer)=>{
  let store = createStore(reducer);
  let middles = middlewares.map(middle=>middle(store));
  let dispatch = compose(...middles)(store.dispatch);
  return {
    ...store,
    dispatch
  }
}


export  {
  createStore,
  applyMiddleware,
  compose,
  bindActionCreators,
  combineReducers
}