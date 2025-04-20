import { useState, useEffect } from 'react';
import Header from './components/Header';
import SessionInfo from './components/SessionInfo';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import DATA from './components/data/sampleData.json';

function App() {
  const [data, setData] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [editSession, setEditSession] = useState(false);

  const setToEditing = (id) => {
    console.log(id);
    if (id === -1) {
      setEditSession(false);
    } else {
      const session = data.filter((sess) => sess.id === id);
      setCurrentSession(session[0]);
      setEditSession(true);
    }
  };

  useEffect(() => {
    setData(DATA);
  }, []);

  const handleSessionUpdate = (currentShape, sessionId, activityId) => {
    const newSession = data.filter((item) => item.id === sessionId);
    for (const activity of newSession[0].activities) {
      if (activity.id === activityId) {
        activity.elements.push(currentShape);
      }
    }

    const updatedSession = data.map((prevData) => {
      if (prevData.id === sessionId) {
        return newSession[0];
      } else {
        return prevData;
      }
    });
    setData(updatedSession);
  };

  const handleElementMove = (activityShapes, sessionId, activityId) => {
    console.log('handleElementMove');
    const newSession = data.filter((item) => item.id === sessionId);
    for (const activity of newSession[0].activities) {
      if (activity.id === activityId) {
        activity.elements = activityShapes;
      }
    }

    const updatedSession = data.map((prevData) => {
      if (prevData.id === sessionId) {
        return newSession[0];
      } else {
        return prevData;
      }
    });
    console.log(updatedSession);
    setData(updatedSession);
  };

  return (
    <>
      <Router>
        <Header />
        <Sidebar setToEditing={setToEditing} />

        <Routes>
          <Route
            path='/session'
            element={
              <SessionInfo
                data={data}
                handleSessionUpdate={handleSessionUpdate}
                handleElementMove={handleElementMove}
                setToEditing={setToEditing}
                editSession={editSession}
                currentSession={currentSession}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
