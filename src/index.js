import React, { memo, useCallback, useMemo } from 'react'
import ReactDOM from 'react-dom'


let lastState
function useState(initialState) {
  lastState = lastState || initialState
  function setState(newState) {
    console.log('newState: ', newState);
    lastState = newState
    render()
  }
  return [lastState, setState]
}



// function Child ({addClick, data}) {
//   console.log('data: ', data);
//   console.log('xxx---child-render')
//   return (
//     <div>
//       <span>{data.num}</span>
//       <button onClick={addClick}>+</button>
//     </div>
//   )
// }

// Child = memo(Child)

// function App1() {

//   const [num, setNum] = useState(1)
//   // const [name, setName] = useState('')

//   const addClick = useCallback(() => setNum(num + 1), [num])
//   const data = useMemo(() => ({num}), [num])
//   return (
//     <div className="App">
//       {/* <input onChange={(e) => setName(e.target.value)} /> */}
//       {/* <span>{name}</span> */}
//       <Child data={data} addClick={addClick} />
//     </div>
//   );
// }

function App() {
  const [num, setNum] = useState(1)
  console.log('num: ', num);
  return (
    <div>
      <span>{num}</span>
      <button onClick={() => setNum(num + 1)}>+</button>
    </div>
  )
}

function render () {
  ReactDOM.render(<App />, document.getElementById('root'))
}


render()
