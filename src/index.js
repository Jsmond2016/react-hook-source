import React, { memo } from 'react'
import ReactDOM from 'react-dom'


let lastStates = []
let index = 0
function useState(initialState) {
  lastStates[index] = lastStates[index] || initialState
  const currentIndex = index
  function setState(newState) {
    lastStates[currentIndex] = newState
    render()
  }
  return [lastStates[index ++], setState]
}

let lastCallback
let lastCallbackDependencies
function useCallback(callback, dependencies) {
  if (lastCallbackDependencies) {
    // 更新时渲染
    // 判断依赖是否改变
    let changed = !dependencies.every((item, index) => item == lastCallbackDependencies[index])
    if (changed) {
      lastCallback = callback
      lastCallbackDependencies = dependencies
    }
  } else {
    // 初始化
    lastCallback = callback
    lastCallbackDependencies = dependencies
  }
  return lastCallback
}


let lastMemo
let lastMemoDependencies
function useMemo(callback, dependencies) {
  if (lastMemoDependencies) {
    // 更新时渲染
    // 判断依赖是否改变
    let changed = !dependencies.every((item, index) => item == lastMemoDependencies[index])
    if (changed) {
      lastMemo = callback()
      lastMemoDependencies = dependencies
    }
  } else {
    // 初始化
    lastMemo = callback()
    lastMemoDependencies = dependencies
  }
  return lastMemo
}


function Child({data, addClick}) {
  console.log('child---render');
  return (
    <div>
      <span>{data.num}</span>
      <button onClick={addClick}>+</button>
    </div>
  )
}

Child = memo(Child)

function App() {
  const [num, setNum] = useState(1)
  const [str, setStr] = useState('')

  const data = useMemo(() => ({num}), [num])
  const addClick = useCallback(() => setNum(num + 1), [num])

  return (
    <div>
      <input onChange={(e) => setStr(e.target.value)} />
      <p>{str}</p>
      <Child data={data} addClick={addClick} />
    </div>
  )
}

function render () {
  index = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}


render()
