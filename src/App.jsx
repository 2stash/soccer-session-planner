import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Canvas />
    </>
  );
}

export default App;
