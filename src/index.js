import React  from 'react'
import ReactDOM from 'react-dom'



let lastDependencies
function useEffect(callback, dependencies) {
  if (lastDependencies) {
    let changed = !dependencies.every((item, index) => item == lastDependencies[index])
    if (changed) {
      setTimeout(callback)
      lastDependencies = dependencies
    }
  } else {
    // 首次渲染
    setTimeout(callback)
    lastDependencies = dependencies
  }
}


let lastLayoutDependencies
function useLayoutEffect(callback, dependencies) {
  if (lastLayoutDependencies) {
    let changed = !dependencies.every((item, index) => item == lastLayoutDependencies[index])
    if (changed) {
      Promise.resolve().then(callback)
      lastLayoutDependencies = dependencies
    }
  } else {
    // 首次渲染
    Promise.resolve().then(callback)
    lastLayoutDependencies = dependencies
  }
}


let lastRef
function useRef(initialRef) {
  lastRef = lastRef || initialRef
  return {
    current: lastRef
  }
}

function App() {
  const divRef = useRef()

  let styl = {
    width: '100px',
    height: '100px',
    backgroundColor: 'yellow'
  }
  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    // while(true){}
    divRef.current.style.transform = "translate(500px)"
    divRef.current.style.transition = "all 800ms"
  })

  console.log('render')

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
