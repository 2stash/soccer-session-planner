import { useState, useRef, useEffect } from 'react';

const Canvas = (props) => {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef(null);

  const handleMouseDown = (event) => {
    console.log('handleMouseDown');
    setDrawing(true);
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    console.log('handleMouseMove', clientX, clientY);
  };

  const handleMouseUp = (event) => {
    console.log('handleMouseUp');
    setDrawing(false);
  };

  const handleMouseOut = (event) => {
    console.log('handleMouseOut');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'green';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'black';
    context.fillRect(50, 50, 100, 100);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
      />
    </div>
  );
};

export default Canvas;
