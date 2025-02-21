"use client";

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  const [lightLevel, setLightLevel] = useState('Unknown');
  const [logs, setLogs] = useState([]);

  const log = (message) => {
    console.log(message); // Eruda will capture this
    setLogs((prev) => [...prev, message]);
  };

  const checkSensor = () => {
    log('Checking sensor support: ' + ('AmbientLightSensor' in window));
    
    if ('AmbientLightSensor' in window) {
      log('Sensor API is available, requesting permission...');
      navigator.permissions.query({ name: 'ambient-light-sensor' })
        .then((result) => {
          log('Permission status: ' + result.state);
          if (result.state === 'granted') {
            startSensor();
          } else if (result.state === 'prompt') {
            setLightLevel('Please allow light sensor access when prompted');
            startSensor();
          } else {
            setLightLevel('Permission denied - check browser settings');
          }
        })
        .catch((error) => {
          log('Permission query error: ' + error.message);
          setLightLevel('Error checking permissions: ' + error.message);
        });
    } else {
      log('AmbientLightSensor not detected in this browser');
      setLightLevel('Sorry, this browser doesn’t support the light sensor');
    }
  };

  useEffect(() => {
    checkSensor();
  }, []);

  const startSensor = () => {
    try {
      log('Starting sensor...');
      const sensor = new AmbientLightSensor();
      sensor.onreading = () => {
        const lux = sensor.illuminance;
        log('Sensor reading: ' + lux);
        let lightType;
        if (lux > 10000) {
          lightType = 'Direct Sunlight';
        } else if (lux > 100) {
          lightType = 'Indirect Light';
        } else {
          lightType = 'Shade';
        }
        setLightLevel(`${lightType} (${lux} lux)`);
      };
      sensor.onerror = (event) => {
        log('Sensor error: ' + event.error.message);
        setLightLevel('Sensor error: ' + event.error.message);
      };
      sensor.start();
    } catch (error) {
      log('Sensor startup error: ' + error.message);
      setLightLevel('Startup error: ' + error.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Plant Lighting App</h1>
      <p>Light Level: {lightLevel}</p>
      <button onClick={checkSensor} style={{ margin: '10px', padding: '5px 10px' }}>
        Check Sensor Again
      </button>
      <div>
        <h3>Debug Logs:</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      <Script
        src="https://cdn.jsdelivr.net/npm/eruda"
        onLoad={() => {
          window.eruda.init();
        }}
      />
    </div>
  );
}