import React, { useState, useEffect } from 'react';
import InfoCard from './InfoCard';
import Canvas from './Canvas';

const SessionInfo = ({
  data,
  handleSessionUpdate,
  handleElementMove,
  currentSession,
  setToEditing,
  editSession,
}) => {
  const display = () => {
    if (editSession) {
      return (
        <Canvas
          session={currentSession}
          handleSessionUpdate={handleSessionUpdate}
          handleElementMove={handleElementMove}
        />
      );
    } else {
      return data.map((session) => (
        <InfoCard
          key={session.id}
          session={session}
          setToEditing={setToEditing}
        />
      ));
    }
  };

  return (
    <div className='p-4 sm:ml-64'>
      <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14'>
        {display()}
      </div>
    </div>
  );
};

export default SessionInfo;
