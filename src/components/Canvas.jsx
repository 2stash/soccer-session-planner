import { useState, useRef, useEffect } from 'react';
import { Shape, Circle, Triangle } from './classes/Shapes';
import { FaRegHandPointer } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoTriangleOutline } from 'react-icons/io5';
import { FaRegCircle } from 'react-icons/fa';

import './canvas.css';

const Canvas = (props) => {
  const [offsets, setOffsets] = useState({});
  const [elements, setElements] = useState([]);
  const [readyToDraw, setReadyToDraw] = useState(false);
  const [currentShapeType, setCurrentShapeType] = useState(false);
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
      setCurrentShape(
        new Shape({
          position: { x: clientX, y: clientY },
          shape: currentShapeType.shape,
          color: currentShapeType.color,
        })
      );
    }
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    if (readyToDraw) {
      const currentShapePosition = new Shape({
        position: { x: clientX, y: clientY },
        shape: currentShapeType.shape,
        color: currentShapeType.color,
      });
      setCurrentShape(currentShapePosition);
    }
  };

  const handleMouseUp = (event) => {
    console.log('handleMouseUp');
  };

  const handleMouseOut = (event) => {
    console.log('handleMouseOut');
  };

  const handleShapeSelected = (value) => {
    let shape;
    if (value === 'circle') {
      shape = new Circle();
    } else if (value === 'triangle') {
      shape = new Triangle();
    }
    setCurrentShapeType(shape);

    setReadyToDraw(true);
  };

  useEffect(() => {
    console.log('rerender');
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    calculateOffsets(canvas);
    for (let element of elements) {
      element.draw(context, offsets);
    }

    if (currentShape) {
      currentShape.draw(context, offsets);
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
          <button className='btn-icon btn-white toolbutton' id='move'>
            <FaRegHandPointer size={24} className='icon' />
          </button>
          <button
            className='btn-icon btn-white toolbutton'
            id='triangle'
            onClick={() => handleShapeSelected('triangle')}
          >
            <IoTriangleOutline size={32} color={'blue'} className='icon' />
          </button>
          <button
            className='btn-icon btn-white toolbutton'
            id='circle'
            onClick={() => handleShapeSelected('circle')}
          >
            <FaRegCircle size={32} color={'red'} className='icon' />
          </button>
          <button className='btn-white toolbutton'>
            <FiArrowUpRight size={48} className='icon' id='arrow' />
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
