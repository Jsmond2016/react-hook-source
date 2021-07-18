import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import ReactDOM from 'react-dom'



function App() {
  const divRef = useRef()

  let styl = {
    width: '100px',
    height: '100px',
    backgroundColor: 'yellow'
  }
  useLayoutEffect(() => {
    divRef.current.style.transform = "translate(500px)"
    divRef.current.style.transition = "all 800ms"
  })
  return (
    <div style={styl} ref={divRef}>
      content....
    </div>
  )
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()
