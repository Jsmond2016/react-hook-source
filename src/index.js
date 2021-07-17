import React from 'react'
import ReactDOM from 'react-dom'


function reducer(state, action) {
  if (action.type === 'add') {
    return state + 1
  } else {
    return state
  }
}

let lastState
function useReducer(reducer, initialState) {
  lastState = lastState || initialState
  function dispatch(action) {
    lastState = reducer(lastState, action)
    render()
  }
  return [lastState, dispatch]
}


function Counter() {
  console.log('Counter---render');
  const [state, dispatch] = useReducer(reducer, 0)
  return (
    <div>
      <p>{state}</p>
      <button onClick={() => dispatch({type: 'add'})}>+</button>
    </div>
  )
}


function render () {
  ReactDOM.render(<Counter />, document.getElementById('root'))
}


render()
