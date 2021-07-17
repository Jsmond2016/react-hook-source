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
