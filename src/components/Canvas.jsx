import { useState, useRef, useEffect } from 'react';
import { Shape, Circle, Triangle, Arrow } from './classes/Shapes';
import { FaRegHandPointer } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoTriangleOutline } from 'react-icons/io5';
import { FaRegCircle } from 'react-icons/fa';
import { is_mouse_in_circle, is_mouse_in_arrow, draw } from '../utils/geometry';

import './canvas.css';

const Canvas = (props) => {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [sessionData, setSessionData] = useState([]);
  const [metadata, setMetadata] = useState({ name: 'hi' });
  const [elements, setElements] = useState([]);
  // const [availableSessions, setAvailableSessions] = useState([]);
  const [currentSessionIdx, setCurrentSessionIdx] = useState(0);

  const [offsets, setOffsets] = useState({});
  const [prevCordinates, setPrevCordinates] = useState(null);
  const [currentElementIndex, setCurrentElementIndex] = useState(null);
  const [isMovingExistingShape, setIsMovingExistingShape] = useState(null);

  const [readyToDraw, setReadyToDraw] = useState(false);
  const [drawingArrowEnd, setDrawingArrowEnd] = useState(false);
  const [currentShapeType, setCurrentShapeType] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const canvasRef = useRef(null);

  const saveData = () => {
    let data;
    console.log('sessionData ', sessionData);
    if (sessionData.length > 0) {
      data = sessionData.map((item, idx) => {
        console.log(idx, currentSessionIdx);
        if (idx === currentSessionIdx) {
          return { elements, metadata };
        } else {
          return item;
        }
      });
    } else {
      data = [{ metadata, elements }];
    }
    setSessionData(data);
    console.log('saving data, ', data);
    localStorage.setItem('soccer-planner', JSON.stringify(data));
  };

  const handleCurrentSessionIdxChange = (idx) => {
    console.log(idx);
    setCurrentSessionIdx(idx);
    setElements(sessionData[idx].elements);
    setMetadata(sessionData[idx].metadata);
  };

  useEffect(() => {
    // localStorage.removeItem('soccer-planner');

    const localData = JSON.parse(localStorage.getItem('soccer-planner'));
    console.log('localData ', localData);
    let tempMetadata;
    if (localData) {
      const data = localData;
      console.log('fetch and set localdata', data);
      if (data[currentSessionIdx]) {
        tempMetadata = data[currentSessionIdx];
      } else {
        tempMetadata = { name: 'fake news' };
      }
      setMetadata(tempMetadata);
      setElements(data[currentSessionIdx].elements);
      setSessionData(data);
    }
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    console.log('RELOADED', currentSessionIdx);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    calculateOffsets(canvas);

    window.addEventListener('keydown', handleKeyDown);
    if (dataLoaded) {
      for (let element of elements) {
        draw(element, context);
      }

      if (currentShape) {
        draw(currentShape, context);
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentShape, elements, currentSessionIdx]);

  const clearLocalStorage = () => {
    localStorage.removeItem('soccer-planner');
    setElements([]);
  };

  const createNewSession = () => {
    // saveData();
    const data = { elements: [], metadata: { name: 'New Session' } };
    console.log('createNewSession, ', sessionData);
    setSessionData((prev) => [...prev, data]);
    setElements([]);
    setMetadata('');
    setCurrentSessionIdx(currentSessionIdx + 1);
  };

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
    let isMoving = false;
    for (let element of elements) {
      if (element.shape === 'triangle' || element.shape == 'circle') {
        if (is_mouse_in_circle(startX, startY, element)) {
          setCurrentElementIndex(index);
          setIsMovingExistingShape(true);
          isMoving = true;
          break;
        }
      } else if (element.shape === 'arrow') {
        if (is_mouse_in_arrow(startX, startY, element)) {
          setCurrentElementIndex(index);
          setIsMovingExistingShape(true);
          isMoving = true;
          break;
        }
      }
      index++;
    }
    if (isMoving) {
      const update = elements.map((prevElement, idx) => {
        if (index === idx) {
          return { ...prevElement, isMoving: true };
        } else {
          return { ...prevElement, isMoving: false };
        }
      });
      setElements(update);
    } else {
      resetMoveState();
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
    if (isMovingExistingShape) {
      setIsMovingExistingShape(false);
    }
  };

  const handleMouseOut = (event) => {};

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setReadyToDraw(false);
      setCurrentShapeType(null);
      setCurrentShape(null);
      resetMoveState();
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

  const resetMoveState = () => {
    setElements((prevItems) =>
      prevItems.map((item, idx) => {
        if (idx === currentElementIndex) {
          return {
            ...item,
            isMoving: false,
          };
        }
        return item;
      })
    );
    setCurrentElementIndex(null);
  };

  return (
    <div>
      <div className='h-16'>
        {/* <h2>{metadata ? metadata.name : 'New Session'}</h2> */}
      </div>

      {/* Drawing Section */}
      <div id='overall' className='flex'>
        <div className='w-48 bg-slate-100'>
          {sessionData.map((item, idx) => (
            <button
              key={idx}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded btn-block w-full'
              type='button'
              onClick={() => handleCurrentSessionIdxChange(idx)}
            >
              {item.metadata.name} Names
            </button>
          ))}
        </div>
        <div id='drawing'>
          <div id='drawing-savebar' className='mb-2'>
            <button className='btn btn-white' onClick={clearLocalStorage}>
              Delete Localstorage Data
            </button>
            <button className='btn btn-white ml-4' onClick={createNewSession}>
              Create New Session
            </button>
            <button className='btn btn-white ml-4' onClick={saveData}>
              Save
            </button>
          </div>
          <div id='drawing-canvas' className='flex flex-row'>
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
      </div>
    </div>
  );
};

export default Canvas;
