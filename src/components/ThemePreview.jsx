
import React from 'react';
import { useTheme } from '../context/ThemeProvider';

export default function ThemePreview() {
  
  let themeContext;
  try {
    themeContext = useTheme();
  } catch (error) {
   
    return null;
  }

  const { theme, setLightTheme, setDarkTheme, toggleTheme } = themeContext;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="dropdown dropdown-top dropdown-end">
        <div tabIndex={0} className="btn btn-circle btn-primary shadow-lg">
          <span className="text-xl">🎨</span>
        </div>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
          <li className="px-4 py-2 border-b">
            <span className="font-semibold">Theme Settings</span>
          </li>
          <li>
            <button 
              onClick={setLightTheme}
              className={`flex items-center justify-between py-3 ${theme === 'light' ? 'bg-base-200' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">☀️</span>
                <span>Light Mode</span>
              </div>
              {theme === 'light' && <span className="badge badge-primary">Active</span>}
            </button>
          </li>
          <li>
            <button 
              onClick={setDarkTheme}
              className={`flex items-center justify-between py-3 ${theme === 'dark' ? 'bg-base-200' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌙</span>
                <span>Dark Mode</span>
              </div>
              {theme === 'dark' && <span className="badge badge-primary">Active</span>}
            </button>
          </li>
          <li>
            <button 
              onClick={toggleTheme}
              className="py-3 text-primary font-medium"
            >
              Toggle Theme
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}