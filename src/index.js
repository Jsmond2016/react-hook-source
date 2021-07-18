import React, { useState } from 'react'
import ReactDOM from 'react-dom'


let AppContext = React.createContext()

function useContext(context) {
  console.log('context._currentValue: ', context._currentValue);
  return context._currentValue
}


function Counter() {
  console.log('Counter---render');
  console.log('AppContext: ', AppContext);
  const { state, setState } = useContext(AppContext)
  return (
    <div>
      <p>{state.num}</p>
      <button onClick={() => setState({num: state.num + 1})}>+</button>
    </div>
  )
}

function App() {
  let [state, setState] = useState({ num: 0 })
  return (
    <AppContext.Provider value={{ state, setState }}>
      <div>
        <div>
          <Counter />
        </div>
      </div>
    </AppContext.Provider>
  )
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()
