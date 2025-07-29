// src/assets/Clock.jsx
import React, { useState, useEffect } from 'react';
import './Clock.css';

const Clock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const worker = new Worker(new URL('./clockWorker.js', import.meta.url)); // updated path

    worker.onmessage = (e) => {
      setTime(e.data);
    };

    return () => worker.terminate();
  }, []);

  return <div className="clock">{time}</div>;
};

export default Clock;
