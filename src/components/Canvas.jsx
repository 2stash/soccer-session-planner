import { useState, useRef, useEffect } from 'react';
import { Shape, Circle, Triangle, Arrow } from './classes/Shapes';
import { FaRegHandPointer } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoTriangleOutline } from 'react-icons/io5';
import { FaRegCircle } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { is_mouse_in_circle, is_mouse_in_arrow, draw } from '../utils/geometry';

import './canvas.css';

const Canvas = ({ session, handleSessionUpdate }) => {
  const [activityId, setActivityId] = useState(1);

  const [elements, setElements] = useState(null);

  const [offsets, setOffsets] = useState({});
  const [prevCordinates, setPrevCordinates] = useState(null);

  const [currentElementIndex, setCurrentElementIndex] = useState(null);
  const [isMovingExistingShape, setIsMovingExistingShape] = useState(null);

  const [readyToDraw, setReadyToDraw] = useState(false);
  const [drawingArrowEnd, setDrawingArrowEnd] = useState(false);
  const [currentShapeType, setCurrentShapeType] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);

  const canvasRef = useRef(null);

  const canvasWidth = 736;
  const canvasHeight = 1104;

  // const tempActivities = [
  //   { name: 'Warmup' },
  //   { name: 'Activity 1' },
  //   { name: 'Activity 2' },
  // ];

  // const baseDataExample = [
  //   {
  //     activities: [
  //       { name: 'Warmup', elements: [] },
  //       { name: 'Activity 1', elements: [] },
  //       { name: 'Activity 2', elements: [] },
  //     ],
  //     metadata: { name: 'New Session' },
  //   },
  // ];

  // const saveData = ({ data }) => {
  //   if (data !== undefined) {
  //     console.log('if = ', data);
  //     setSessionData(data);
  //     localStorage.setItem('soccer-planner', JSON.stringify(data));
  //     return;
  //   } else if (sessionData.length > 0) {
  //     data = sessionData.map((item, idx) => {
  //       console.log(idx, currentSessionIdx);
  //       if (idx === currentSessionIdx) {
  //         return { elements, metadata };
  //       } else {
  //         return item;
  //       }
  //     });
  //   } else {
  //     data = { metadata, elements };
  //   }
  //   setSessionData(data);
  //   console.log('saving data, ', data);
  //   localStorage.setItem('soccer-planner', JSON.stringify(data));
  // };

  // const handleCurrentSessionIdxChange = (idx) => {
  //   console.log(idx);
  //   setCurrentSessionIdx(idx);
  //   setElements(sessionData[idx].elements);
  //   setMetadata(sessionData[idx].metadata);
  // };
  const handleCurrentActvityIdChange = (id) => {
    console.log(id);
    setActivityId(id);
  };

  // useEffect(() => {
  //   // localStorage.removeItem('soccer-planner');

  //   const localData = JSON.parse(localStorage.getItem('soccer-planner'));
  //   console.log('localData ', localData);
  //   let tempMetadata;

  //   console.log('fetch and set localdata', localData);
  //   if (localData) {
  //     tempMetadata = localData;
  //   } else {
  //     tempMetadata = [{ elements: [], metadata: { name: 'New Session' } }];
  //   }
  //   console.log('session data =', tempMetadata);
  //   setCurrentSessionIdx(0);
  //   setMetadata(tempMetadata[currentSessionIdx].metadata);
  //   setElements(tempMetadata[currentSessionIdx].elements);
  //   setSessionData(tempMetadata);
  //   setDataLoaded(true);
  // }, []);

  useEffect(() => {
    console.log(session);
    drawShapes();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentShape, session, activityId]);

  const drawShapes = () => {
    console.log('drawing shapes');

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    calculateOffsets(canvas);

    if (session) {
      const activityToDraw = session.activities.filter(
        (sess) => sess.id === activityId
      );
      if (activityToDraw) {
        console.log(activityToDraw);
        for (let element of activityToDraw[0].elements) {
          draw(element, context);
        }
      }

      if (currentShape) {
        draw(currentShape, context);
      }
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('soccer-planner');
    const tempData = [{ elements: [], metadata: { name: 'New Session' } }];
    // setCurrentSessionIdx(0);
    // setMetadata(tempData[currentSessionIdx].metadata);
    // setElements(tempData[currentSessionIdx].elements);
  };

  // const createNewSession = () => {
  //   // saveData();
  //   const data = [
  //     ...sessionData,
  //     {
  //       elements: [],
  //       metadata: { name: `New Session ${currentSessionIdx + 1}` },
  //     },
  //   ];
  //   setSessionData(data);
  //   setElements([]);
  //   setMetadata({ name: `New Session ${currentSessionIdx + 1}` });
  //   setCurrentSessionIdx(currentSessionIdx + 1);
  //   saveData({ data });
  // };

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
    setPrevCordinates({ x: translatedX, y: translatedY });
    if (readyToDraw) {
      if (currentShapeType.shape === 'arrow') {
        if (currentShape === null) {
          setCurrentShape(
            new Shape({
              startX: translatedX,
              startY: translatedY,
              endX: translatedX,
              endY: translatedY,
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
      handleSessionUpdate(currentShape, session.id, activityId);
      // setElements([...elements, currentShape]);

      setCurrentShape(
        new Shape({
          startX: translatedX,
          startY: translatedY,
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
        startX: translatedX,
        startY: translatedY,
        shape: currentShapeType.shape,
        color: currentShapeType.color,
      });
      setCurrentShape(currentShapePosition);
    } else if (drawingArrowEnd) {
      setCurrentShape(
        new Shape({
          startX: currentShape.startX,
          startY: currentShape.startY,
          endX: translatedX,
          endY: translatedY,
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
              startX: translatedX,
              startY: translatedY,
            };
          }
          return item;
        })
      );
    } else if (
      isMovingExistingShape &&
      elements[currentElementIndex].shape === 'arrow'
    ) {
      const dx = translatedX - prevCordinates.x;
      const dy = translatedY - prevCordinates.y;

      setElements((prevItems) =>
        prevItems.map((item, idx) => {
          if (idx === currentElementIndex) {
            return {
              ...item,
              startX: item.startX + dx,
              startY: item.startY + dy,
              endX: item.endX + dx,
              endY: item.endY + dy,
            };
          }
          return item;
        })
      );
    }
    setPrevCordinates({ x: translatedX, y: translatedY });
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

  // const handleDeleteSession = () => {
  //   let data = sessionData.filter((session, idx) => currentSessionIdx !== idx);
  //   setSessionData(data);
  //   if (data.length === 0) {
  //     data = [{ elements: [], metadata: { name: 'New Session' } }];
  //   }
  //   setMetadata(sessionData[0].metadata);
  //   setElements(sessionData[0].elements);
  //   handleCurrentSessionIdxChange(0);
  //   saveData({ data });
  // };

  const handleShapeSelected = (value) => {
    let shape;
    if (value === 'circle') {
      shape = new Circle();
    } else if (value === 'triangle') {
      shape = new Triangle();
    } else if (value === 'arrow') {
      shape = new Arrow();
    }
    console.log('handle Selected Shape');
    setCurrentShapeType(shape);
    setReadyToDraw(true);
  };

  const resetMoveState = () => {
    // TODO UPDATE
    // setElements((prevItems) =>
    //   prevItems.map((item, idx) => {
    //     if (idx === currentElementIndex) {
    //       return {
    //         ...item,
    //         isMoving: false,
    //       };
    //     }
    //     return item;
    //   })
    // );
    setCurrentElementIndex(null);
  };

  const handleUpdateMetadata = (e) => {
    const name = e.target.value;
  };

  const loading = () => {
    if (!session) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <div>
      <div className='h-16'></div>

      {/* Drawing Section */}
      <div id='overall' className='flex'>
        <div id='drawing'>
          <div id='drawing-savebar' className='flex mb-2 justify-left'>
            <button className='btn btn-white' onClick={clearLocalStorage}>
              Delete Localstorage Data
            </button>
            <button className='btn btn-white ml-4'>Create New Session</button>
            <button className='btn btn-white ml-4'>Save</button>
            <button className='btn-icon btn-white toolbutton ml-4'>
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
              width={canvasWidth}
              height={canvasHeight}
            />
          </div>
        </div>

        {/* Session section */}
        <div className='w-72 flex flex-col rounded-sm border border-slate-400'>
          <div className='flex flex-col grow'>
            <div className='flex flex-col'>
              <label htmlFor='name' className='items-center text-3xl m-2'>
                Session Title
              </label>
              {session && (
                <input
                  type='text'
                  value={session.metadata.name}
                  onChange={(e) => handleUpdateMetadata(e)}
                  className='m-2 p-2 h-10 border-bottom rounded-sm bg-gray-100'
                  placeholder='No Session Selected'
                  name='name'
                />
              )}
            </div>

            <div className='mt-8'>
              <h2>Session Activities</h2>
              <div className='flex flex-col'>
                {session &&
                  session.activities.map((activity) => (
                    <button
                      key={activity.type}
                      className='btn btn-white'
                      onClick={() => handleCurrentActvityIdChange(activity.id)}
                    >
                      {activity.type}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <button className='btn bg-red-500 hover:bg-red-700 m-2 text-white'>
            Delete Session
            {/* TODO: Add deletion check for production */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
