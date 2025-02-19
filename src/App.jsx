import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import './App.css';

function App() {
  const canvasWidth = 736;
  const canvasheight = 1104;
  return (
    <>
      <div className='container p-8'>
        <Canvas width={canvasWidth} height={canvasheight} />
      </div>
    </>
  );
}

export default App;
