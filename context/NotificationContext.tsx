
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, SparklesIcon } from '../components/icons.tsx';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem: React.FC<{ notification: Notification; onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
    const [exiting, setExiting] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(notification.id), 300);
        }, 4700);
        return () => clearTimeout(timer);
    }, [notification.id, onDismiss]);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(notification.id), 300);
    };

    const typeClasses = {
        success: 'bg-green-500/90 border-green-400',
        error: 'bg-red-500/90 border-red-400',
        info: 'bg-blue-500/90 border-blue-400',
    };
    
    const Icon = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        info: SparklesIcon,
    }[notification.type];

    return (
        <div 
             className={`flex items-start p-4 rounded-lg shadow-2xl border-l-4 text-white transition-all duration-300 transform ${typeClasses[notification.type]} ${exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
             style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'}}
        >
            <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium flex-grow">{notification.message}</p>
            <button onClick={handleDismiss} className="ml-4 text-white/70 hover:text-white">&times;</button>
        </div>
    );
};


const NotificationContainer: React.FC<{ notifications: Notification[]; onDismiss: (id: number) => void }> = ({ notifications, onDismiss }) => (
    <div className="fixed top-6 right-6 z-50 space-y-3 w-80">
        {notifications.map(n => (
            <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} />
        ))}
    </div>
);


export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);
  
  const removeNotification = useCallback((id: number) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onDismiss={removeNotification}/>
    </NotificationContext.Provider>
  );
};
