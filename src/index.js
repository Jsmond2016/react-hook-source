import React, { useState } from 'react'
import ReactDOM from 'react-dom'


let lastDependencies
function useEffect(callback, dependencies) {
  if (lastDependencies) {
    let changed = !dependencies.every((item, index) => item == lastDependencies[index])
    if (changed) {
      callback()
      lastDependencies = dependencies
    }
  } else {
    // 首次渲染
    callback()
    lastDependencies = dependencies
  }
}

function App() {
  let [num, setNum] = useState(0)
  let [name, setName] = useState('')
  useEffect(() => {
    console.log('num',num)
  }, [num])
  return (
    <div>
      <input onChange={(e) => setName(e.target.value)  } />
      <p>{name}</p>
      <button onClick={() => setNum(num + 1)}>+</button>
      <p>{num}</p>
    </div>
  )
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()
