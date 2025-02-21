"use client"; // This tells Next.js to run this on the browser, not the server

import { useState, useEffect } from 'react';

export default function Home() {
  const [lightLevel, setLightLevel] = useState('Unknown'); // Store the light reading

  useEffect(() => {
    // Check if the browser supports the light sensor
    if ('AmbientLightSensor' in window) {
      try {
        const sensor = new AmbientLightSensor();
        sensor.onreading = () => {
          const lux = sensor.illuminance; // Light level in lux
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
          setLightLevel('Error: Could not access light sensor');
        };
        sensor.start(); // Start the sensor
      } catch (error) {
        setLightLevel('Error: Sensor not supported or permission denied');
      }
    } else {
      setLightLevel('Sorry, your device doesn’t support the light sensor');
    }
  }, []); // Empty array means this runs once when the page loads

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Plant Lighting App</h1>
      <p>Light Level: {lightLevel}</p>
    </div>
  );
}