
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeBackground = ({ children }) => {
  const { theme } = useTheme();

  const backgrounds = {
    light: {
      image: '/assets/images/bg-light.jpg',
      color: 'bg-white',
      overlay: 'bg-white/80'
    },
    dark: {
      image: '/assets/images/bg-dark.jpg',
      color: 'bg-gray-900',
      overlay: 'bg-gray-900/80'
    },
    corporate: {
      image: '/assets/images/bg-corporate.jpg',
      color: 'bg-blue-50',
      overlay: 'bg-blue-50/80'
    }
  };

  const currentBg = backgrounds[theme] || backgrounds.light;

  return (
    <div 
      className={`min-h-screen ${currentBg.color} relative`}
      style={{
        backgroundImage: `url('${currentBg.image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${currentBg.overlay}`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};