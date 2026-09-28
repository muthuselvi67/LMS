import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: '🎉 Welcome to Learnlike LMS!',
    message: 'Explore our 7 structured software engineering tracks and start your learning journey.',
    category: 'system',
    time: 'Just now',
    createdAt: new Date().toISOString(),
    unread: true,
    link: '/courses'
  },
  {
    id: 2,
    title: '📚 Continue HTML 5 Bootcamp',
    message: 'You have completed 3 of 14 lessons. Keep up the momentum to earn your certificate!',
    category: 'course',
    time: '2 hours ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: true,
    link: '/my-learning'
  },
  {
    id: 3,
    title: '📄 New Resource Available for Download',
    message: 'HTML5 Semantic Tags & CSS Flexbox cheat sheets are ready in your Downloads section.',
    category: 'download',
    time: 'Yesterday',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread: true,
    link: '/downloads'
  },
  {
    id: 4,
    title: '🏆 Verified Certificate Notice',
    message: 'Finish your enrolled courses to 100% to generate official verifiable certificates.',
    category: 'certificate',
    time: '3 days ago',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    link: '/certificates'
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('learnlike_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('learnlike_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage:', e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      time: 'Just now',
      unread: true,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
