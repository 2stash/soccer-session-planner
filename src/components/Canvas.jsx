import { useState, useRef, useEffect } from 'react';
import { Shape, Circle, Triangle, Arrow } from './classes/Shapes';
import { FaRegHandPointer } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoTriangleOutline } from 'react-icons/io5';
import { FaRegCircle } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { is_mouse_in_circle, is_mouse_in_arrow, draw } from '../utils/geometry';

import './canvas.css';

const Canvas = (props) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [elements, setElements] = useState(null);
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

  const saveData = (newData = null) => {
    let data;
    console.log('sessionData ', sessionData);
    if (newData != null) {
      setSessionData(newData);
      return;
    } else if (sessionData.length > 0) {
      data = sessionData.map((item, idx) => {
        console.log(idx, currentSessionIdx);
        if (idx === currentSessionIdx) {
          return { elements, metadata };
        } else {
          return item;
        }
      });
    } else {
      data = { metadata, elements };
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

    console.log('fetch and set localdata', localData);
    if (localData) {
      console.log('if');
      tempMetadata = localData;
    } else {
      console.log('else');
      tempMetadata = [{ elements: [], metadata: { name: 'New Session' } }];
    }
    console.log('session data =', tempMetadata);
    setCurrentSessionIdx(0);
    setMetadata(tempMetadata[currentSessionIdx].metadata);
    setElements(tempMetadata[currentSessionIdx].elements);
    setSessionData(tempMetadata);
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    drawShapes();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentShape, elements, currentSessionIdx, sessionData]);

  const drawShapes = () => {
    console.log(
      'RELOADED: ',
      'currentSessionIdx = ',
      currentSessionIdx,
      ' currentElementIndex = ',
      currentElementIndex
    );
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    calculateOffsets(canvas);

    if (dataLoaded) {
      for (let element of elements) {
        draw(element, context);
      }

      if (currentShape) {
        draw(currentShape, context);
      }
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('soccer-planner');
    const tempData = [{ elements: [], metadata: { name: 'New Session' } }];
    setCurrentSessionIdx(0);
    setMetadata(tempData[currentSessionIdx].metadata);
    setElements(tempData[currentSessionIdx].elements);
    setSessionData(tempData);
    setDataLoaded(true);
  };

  const createNewSession = () => {
    // saveData();
    const data = {
      elements: [],
      metadata: { name: `New Session ${currentSessionIdx + 1}` },
    };
    setSessionData((prev) => [...prev, data]);
    setElements([]);
    setMetadata({ name: `New Session ${currentSessionIdx + 1}` });
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
    } else if (
      event.key === 'Delete' ||
      (event.key === 'Backspace' && currentElementIndex !== null)
    ) {
      handleDeleteElement();
      console.log(currentElementIndex);
    }
  };

  const handleDeleteElement = () => {
    if (currentElementIndex !== null) {
      setElements((prevItems) =>
        prevItems.filter((item, idx) => idx !== currentElementIndex)
      );
      setReadyToDraw(false);
      setCurrentShapeType(null);
      setCurrentShape(null);
    }
  };

  const handleDeleteSession = () => {
    const newData = sessionData.filter(
      (session, idx) => currentSessionIdx !== idx
    );

    setSessionData(newData);
    if (sessionData.length >= 2) {
      setMetadata(sessionData[0].metadata);
      setElements(sessionData[0].elements);
      handleCurrentSessionIdxChange(0);
    }

    // drawShapes();
    saveData(newData);
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

  const handleUpdateMetadata = (e) => {
    const name = e.target.value;
    setMetadata({ name });
  };

  return (
    <div>
      <div className='h-16'></div>

      {/* Drawing Section */}
      <div id='overall' className='flex'>
        <div className='w-48 bg-slate-100'>
          <h2>Sessions</h2>
          {sessionData &&
            sessionData.map((item, idx) => (
              <button
                key={idx}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded btn-block w-full ${
                  idx === currentSessionIdx && 'bg-blue-800'
                }`}
                type='button'
                onClick={() => handleCurrentSessionIdxChange(idx)}
              >
                {item.metadata.name}
              </button>
            ))}
        </div>
        <div id='drawing'>
          <div id='drawing-savebar' className='flex mb-2 justify-left'>
            <button className='btn btn-white' onClick={clearLocalStorage}>
              Delete Localstorage Data
            </button>
            <button className='btn btn-white ml-4' onClick={createNewSession}>
              Create New Session
            </button>
            <button className='btn btn-white ml-4' onClick={saveData}>
              Save
            </button>
            <button
              className='btn-icon btn-white toolbutton ml-4'
              onClick={handleDeleteElement}
            >
              <FaRegTrashCan size={24} className='icon' />
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

        {/* Session section */}
        <div className='bg-red-300 w-48 flex flex-col justify-start'>
          <div>
            {metadata && (
              <input
                type='text'
                value={metadata.name}
                onChange={(e) => handleUpdateMetadata(e)}
                className='h-14'
                placeholder='No Session Selected'
              />
            )}
          </div>
          <button className='btn btn-white' onClick={handleDeleteSession}>
            Delete Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
