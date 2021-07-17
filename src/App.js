import React, { memo } from 'react'
import reactDom from 'react-dom'


let lastState
function useState(initialState) {
  lastState = initialState || lastState
  function setState(newState) {
    lastState = newState
    render()
  }

  return [lastState, setState]
}



function Child ({addClick, data}) {
  console.log('xxx---child-render')
  return (
    <div>
      <span>{data.num}</span>
      <button onClick={addClick}>+</button>
    </div>
  )
}

Child = memo(Child)

function App() {

  const [num, setNum] = useState(0)
  const [name, setName] = useState('')

  // const addClick = useCallback(() => setNum(num + 1), [num])
  // const data = useMemo(() => ({num}), [num])
  return (
    <div className="App">
      <input onChange={(e) => setName(e.target.value)} />
      <span>{name}</span>
      <Child data={{num}} addClick={() => setNum(num + 1)} />
    </div>
  );
}

function render () {
  reactDom.render(<App />)
}


export default App;
