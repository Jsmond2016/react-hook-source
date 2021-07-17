## 手写 React-Hooks

## Hooks 的基本使用

```jsx
// App.js
import { useState, useMemo, useCallback, memo } from 'react'


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

  const addClick = useCallback(() => setNum(num + 1), [num])
  const data = useMemo(() => ({num}), [num])
  return (
    <div className="App">
      <input onChange={(e) => setName(e.target.value)} />
      <span>{name}</span>
      <Child data={data} addClick={addClick} />
    </div>
  );
}

export default App;


```

## useState 初步实现

```jsx
import ReactDOM from 'react-dom'


let lastState
function useState(initialState) {
  lastState = lastState || initialState
  function setState(newState) {
    lastState = newState
    render()
  }
  return [lastState, setState]
}

function App() {
  const [num, setNum] = useState(1)
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

```

### 完善 useState

前面的 state 存储在一个 lastState 变量中，当定义多个 state 的时候会导致变量覆盖，需要使用数组

```jsx
let lastState
function useState(initialState) {
  lastState = initialState || lastState
  function setState(newState) {
    lastState = newState
    render()
  }

  return [lastState, setState]
}

// 每次 render 的时候讲 state 的index 重置为 0 

function render () {
  index = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
```

通过上面的代码可以看出，state 和  index 是强关联关系，因此，不能再 if，while 等判断条件下使用 setState ，不然会导致 state 更新错乱


### 实现 useCallBack

主要功能：缓存函数

```jsx
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
```


### 实现 useMemo

原理和 useCallback 相似

主要功能：缓存变量值，因此返回的是一个函数的返回值

```jsx
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
```

### 使用自定义 useState, useCallback, useMemo 的具体例子

```jsx
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

```

### useReducer

useReducer 的基本使用


```jsx
import React, { useReducer } from 'react'
import ReactDOM from 'react-dom'

function reducer(state, action) {
  if (action.type === 'add') {
    return state + 1
  } else {
    return state
  }
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
```