import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Header from './components/Header';
import SessionInfo from './components/SessionInfo';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import DATA from './components/data/sampleData.json';

function App() {
  const [data, setData] = useState(DATA);

  return (
    <>
      <Router>
        <Header />
        <Sidebar />

        <Routes>
          <Route path='/session' element={<SessionInfo data={data} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
