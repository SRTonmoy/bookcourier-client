
import React from 'react';
import Particles from 'react-tsparticles';

const AnimatedBackground = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 relative overflow-hidden">
     
      <Particles
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true
            }
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.3 },
            move: { enable: true, speed: 1 },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 3 } }
          }
        }}
        className="absolute inset-0"
      />
      
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};