import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'



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
