// components/Toast.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (event) => {
      const { type, message, duration = 3000 } = event.detail;
      
      const id = Date.now();
      const newToast = { id, type, message };
      
      setToasts(prev => [...prev, newToast]);
      
      // Auto remove after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    };

    window.addEventListener('show-toast', handleShowToast);
    
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-400 text-green-800';
      case 'error': return 'bg-red-100 border-red-400 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      default: return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md animate-slide-in-right ${getBgColor(toast.type)}`}
        >
          <div className="flex-shrink-0">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-current hover:opacity-70"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;