import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Header from './components/Header';
import SessionInfo from './components/SessionInfo';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import DATA from './components/data/sampleData.json';

function App() {
  const [data, setData] = useState([]);

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

  return (
    <>
      <Router>
        <Header />
        <Sidebar />

        <Routes>
          <Route
            path='/session'
            element={
              <SessionInfo
                data={data}
                handleSessionUpdate={handleSessionUpdate}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
