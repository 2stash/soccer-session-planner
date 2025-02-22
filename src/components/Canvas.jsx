import { useState, useRef, useEffect } from 'react';
import { Shape, Circle, Triangle, Arrow } from './classes/Shapes';
import { FaRegHandPointer } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoTriangleOutline } from 'react-icons/io5';
import { FaRegCircle } from 'react-icons/fa';
import { is_mouse_in_circle, is_mouse_in_arrow, draw } from '../utils/geometry';

import './canvas.css';

const Canvas = (props) => {
  const [offsets, setOffsets] = useState({});
  const [elements, setElements] = useState([]);
  const [prevCordinates, setPrevCordinates] = useState(null);
  const [currentElementIndex, setCurrentElementIndex] = useState(null);
  const [isMovingExistingShape, setIsMovingExistingShape] = useState(null);

  const [readyToDraw, setReadyToDraw] = useState(false);
  const [drawingArrowEnd, setDrawingArrowEnd] = useState(false);
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
    const { clientX, clientY } = event;
    const translatedX = parseInt(clientX - offsets.offset_x);
    const translatedY = parseInt(clientY - offsets.offset_y);
    setPrevCordinates({ position: { x: translatedX, y: translatedY } });
    if (readyToDraw) {
      if (currentShapeType.shape === 'arrow') {
        if (currentShape === null) {
          setCurrentShape(
            new Shape({
              position: {
                startX: translatedX,
                startY: translatedY,
                endX: translatedX,
                endY: translatedY,
              },
              shape: currentShapeType.shape,
              color: currentShapeType.color,
              radius: 10,
            })
          );
          setDrawingArrowEnd(true);
          setReadyToDraw(false);
          return;
        }
      }
      setElements([...elements, currentShape]);
      setCurrentShape(
        new Shape({
          position: { startX: translatedX, startY: translatedY },
          shape: currentShapeType.shape,
          color: currentShapeType.color,
        })
      );
      return;
    } else if (drawingArrowEnd) {
      setElements([...elements, currentShape]);
      setCurrentShape(null);
      setReadyToDraw(true);
      setDrawingArrowEnd(false);
      return;
    }

    let startX = parseInt(translatedX);
    let startY = parseInt(translatedY);
    let index = 0;
    for (let element of elements) {
      if (element.shape === 'triangle' || element.shape == 'circle') {
        if (is_mouse_in_circle(startX, startY, element)) {
          console.log(element);
          setCurrentElementIndex(index);
          element.isMoving = true;
          setIsMovingExistingShape(true);
          return;
        }
      } else if (element.shape === 'arrow') {
        if (is_mouse_in_arrow(startX, startY, element)) {
          console.log(element);
          setCurrentElementIndex(index);
          element.isMoving = true;
          setIsMovingExistingShape(true);
          return;
        }
      }
      index++;
    }
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const translatedX = parseInt(clientX - offsets.offset_x);
    const translatedY = parseInt(clientY - offsets.offset_y);
    if (readyToDraw) {
      if (currentShapeType.shape === 'arrow') {
        return;
      }

      const currentShapePosition = new Shape({
        position: { startX: translatedX, startY: translatedY },
        shape: currentShapeType.shape,
        color: currentShapeType.color,
      });
      setCurrentShape(currentShapePosition);
    } else if (drawingArrowEnd) {
      setCurrentShape(
        new Shape({
          position: {
            startX: currentShape.position.startX,
            startY: currentShape.position.startY,
            endX: translatedX,
            endY: translatedY,
          },
          shape: currentShapeType.shape,
          color: currentShapeType.color,
          radius: 10,
        })
      );
    } else if (
      isMovingExistingShape &&
      elements[currentElementIndex].shape !== 'arrow'
    ) {
      setElements((prevItems) =>
        prevItems.map((item, idx) => {
          if (idx === currentElementIndex) {
            return {
              ...item,
              position: {
                ...item.position,
                startX: translatedX,
                startY: translatedY,
              },
            };
          }
          return item;
        })
      );
    } else if (
      isMovingExistingShape &&
      elements[currentElementIndex].shape === 'arrow'
    ) {
      const dx = translatedX - prevCordinates.position.x;
      const dy = translatedY - prevCordinates.position.y;

      setElements((prevItems) =>
        prevItems.map((item, idx) => {
          if (idx === currentElementIndex) {
            return {
              ...item,
              position: {
                ...item.position,
                startX: item.position.startX + dx,
                startY: item.position.startY + dy,
                endX: item.position.endX + dx,
                endY: item.position.endY + dy,
              },
            };
          }
          return item;
        })
      );
    }
    setPrevCordinates({ position: { x: translatedX, y: translatedY } });
  };
  const handleMouseUp = (event) => {
    setIsMovingExistingShape(false);
  };

  const handleMouseOut = (event) => {};

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setReadyToDraw(false);
      setCurrentShapeType(null);
      setCurrentShape(null);
    }
    console.log(event.key);
  };

  const handleShapeSelected = (value) => {
    let shape;
    if (value === 'circle') {
      shape = new Circle();
    } else if (value === 'triangle') {
      shape = new Triangle();
    } else if (value === 'arrow') {
      shape = new Arrow();
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

    window.addEventListener('keydown', handleKeyDown);

    for (let element of elements) {
      draw(element, context);
    }

    if (currentShape) {
      currentShape.draw(context);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
            <FiArrowUpRight
              size={48}
              className='icon'
              id='arrow'
              onClick={() => handleShapeSelected('arrow')}
            />
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
