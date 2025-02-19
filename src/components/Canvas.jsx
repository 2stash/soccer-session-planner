import { useState, useRef, useEffect } from 'react';
import { FaRegHandPointer } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoTriangleOutline } from 'react-icons/io5';
import { FaRegCircle } from 'react-icons/fa';

import './canvas.css';

const Canvas = (props) => {
  const [offsets, setOffsets] = useState({});
  const [elements, setElements] = useState([]);
  const [readyToDraw, setReadyToDraw] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const canvasRef = useRef(null);

  const calculateOffsets = (canvas) => {
    const canvas_offsets = canvas.getBoundingClientRect();
    const updatedOffsets = {
      offset_x: canvas_offsets.left,
      offset_y: canvas_offsets.top,
    };
    setOffsets(updatedOffsets);
  };

  const handleMouseDown = (event) => {
    console.log('handleMouseDown');
    if (readyToDraw) {
      const { clientX, clientY } = event;
      console.log(currentShape);
      setElements([...elements, currentShape]);
      setCurrentShape(create(clientX, clientY));
    }
  };

  const create = (x, y) => {
    return { position: { x, y } };
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    if (readyToDraw) {
      const currentShapePosition = { position: { x: clientX, y: clientY } };
      setCurrentShape(currentShapePosition);
    } else if (drawing) {
      const currentShapeCopy = currentShape;
      currentShapeCopy.position.x = clientX;
      currentShapeCopy.position.y = clientY;
      setCurrentShape(currentShapeCopy);
    }
  };

  const handleMouseUp = (event) => {
    console.log('handleMouseUp');
    setDrawing(false);
  };

  const handleMouseOut = (event) => {
    console.log('handleMouseOut');
  };

  const handleShapeSelected = (value) => {
    setReadyToDraw(true);
  };

  useEffect(() => {
    console.log('rerender');
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    calculateOffsets(canvas);
    for (let element of elements) {
      context.beginPath();

      context.arc(
        element.position.x - offsets.offset_x,
        element.position.y - offsets.offset_y,
        50,
        0,
        2 * Math.PI
      );

      context.stroke();
    }

    if (currentShape) {
      context.beginPath();

      context.arc(
        currentShape.position.x - offsets.offset_x,
        currentShape.position.y - offsets.offset_y,
        50,
        0,
        2 * Math.PI
      );

      context.stroke();
    }
  }, [currentShape, elements]);

  return (
    <div>
      <div id='savebar' className='mb-2'>
        <button className='btn btn-white'>Clear</button>
        <button className='btn btn-white ml-4'>Save</button>
      </div>
      <div className='flex flex-row'>
        <div className='flex flex-col'>
          <button className='btn-icon btn-white toolbutton'>
            <FaRegHandPointer size={24} className='icon' />
          </button>
          <button className='btn-icon btn-white toolbutton'>
            <IoTriangleOutline size={32} color={'blue'} className='icon' />
          </button>
          <button
            className='btn-icon btn-white toolbutton'
            onClick={() => handleShapeSelected('circle')}
          >
            <FaRegCircle size={32} color={'red'} className='icon' />
          </button>
          <button className='btn-white toolbutton'>
            <FiArrowUpRight size={48} className='icon' />
          </button>
        </div>
        <canvas
          id='canvas'
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
          {...props}
        />
      </div>
    </div>
  );
};

export default Canvas;
