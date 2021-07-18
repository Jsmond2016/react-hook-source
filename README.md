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

### 自定义 useReducer

```jsx
let lastState
function useReducer(reducer, initialState) {
  lastState = lastState || initialState
  function dispatch(action) {
    lastState = reducer(lastState, action)
    render()
  }
  return [lastState, dispatch]
}
```

基本使用：

```jsx
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

```

### useContext

useContext 的基本使用

- 外层使用 `React.createContext()`
- 父级提供 `Provider, value`
- 子级使用 `useContext(AppContext)`，注意参数为外层定义的 `context` 

示例代码：

```jsx
import React, { useContext, useState } from 'react'
import ReactDOM from 'react-dom'


let AppContext = React.createContext()

function Counter() {
  console.log('Counter---render');
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
```

### useContext 手写实现

```jsx
function useContext(context) {
  return context._currentValue
}

```

示例：

```jsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'


let AppContext = React.createContext()

function useContext(context) {
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
```

### useEffect

基本使用：

```jsx
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

```

手写实现 useEffect

```jsx
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
```

使用例子：

useEffect 第二个依赖项有多种情况

- 空数组
- 空
- 数组含有多个依赖


```jsx
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

```

### useLayoutEffect

关于 useLayoutEffect 和 useEffect 区别

- 其函数签名与 `useEffect` 相同，但是它会在所有的 DOM 变更之后同步调用 effect
- `useEffect` 不会阻塞浏览器渲染，而 `useLayoutEffect` 会阻塞浏览器渲染
- `useEffect` 会在浏览器渲染结束后执行，`useLayoutEffect` 则是在 DOM 更新完成后，浏览器绘制前执行

关于事件循环：

- 从宏任务队列取出一个宏任务执行
- 检查微任务队列,执行并清空微任务队列,如果在微任务的执行中又加入了新的微任务,则会继续执行新的微任务
- 进入更新渲染阶段判断是否需要渲染.要根据屏幕刷新率、页面性能、页面是否在后台运行来共同决定,通常来说这个渲染间隔是固定的;一般为60帧秒。
- 如果确定要更新会进入下面的步骤,否则本循环结束
  - 如果窗口大小发生了变化,执行监听的 `resize` 事件
  - 如果页面发生了滚动,执行 `scroll` 方法
  - 执行帧动画回调,也就是 `requestAnimationFrame` 的回调
  - 重新渲染用户界面
- 判断是否宏任务和微任务队列为空则判断是否执行 `requestldleCallback` 的回调函数

![](./imgs/useLayoutEffect.jpg)