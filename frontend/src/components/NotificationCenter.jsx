import { useState, useEffect } from 'react';
import { Bell, X, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { realtimeHelpers, dbHelpers } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useAuthStore((state) => state.user);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-black stroke-[3]" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-white stroke-[3]" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-black stroke-[3]" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-black stroke-[3]" />;
    }
  };

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const data = await dbHelpers.getUserNotifications(user.id, false, 50);
        setNotifications(data || []);
        setUnreadCount(data?.filter((n) => !n.read).length || 0);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    })();

    const channel = realtimeHelpers.subscribeToNotifications(
      user.id,
      (payload) => {
        const newNotification = payload.new;
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.custom((t) => (
          <div
            className={`max-w-md w-full bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-3 flex items-start justify-between gap-3 font-mono text-xs`}
          >
            <div>
              <p className="font-black text-black uppercase">{newNotification.title}</p>
              <p className="text-gray-700 mt-0.5">{newNotification.message}</p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-2 py-0.5 bg-[#FFE600] border border-black font-bold uppercase"
            >
              OK
            </button>
          </div>
        ));
      }
    );

    return () => {
      realtimeHelpers.unsubscribe(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      await dbHelpers.markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await dbHelpers.markAllNotificationsRead(user.id);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      toast.success('All marked read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'JUST NOW';
    if (minutes < 60) return `${minutes}M AGO`;
    if (hours < 24) return `${hours}H AGO`;
    if (days < 7) return `${days}D AGO`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications panel"
        className="relative p-2 bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all"
      >
        <Bell className="w-5 h-5 stroke-[2.5]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.2 font-mono text-[9px] font-black text-white bg-[#FF5500] border border-black">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <div
              className="absolute right-0 mt-2 w-96 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] z-50 max-h-[500px] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-[#FFE600] border-b-2 border-black">
                <h3 className="font-display font-black text-sm uppercase text-black">
                  SYSTEM NOTIFICATIONS
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="font-mono text-[10px] font-black text-black bg-white px-2 py-0.5 border border-black hover:bg-[#00FF00] uppercase"
                    >
                      READ ALL
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close notifications panel"
                    className="p-1 bg-white border border-black hover:bg-[#FF5500] hover:text-white"
                  >
                    <X className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-[#FDF6E3]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 font-mono text-xs font-bold text-gray-500 uppercase">
                    <Bell className="w-8 h-8 stroke-[2] mb-2 text-black" />
                    <p>NO ACTIVE ALERTS</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer ${
                        !notification.read ? 'bg-[#00FFFF]' : 'bg-white'
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0 font-mono">
                          <p className="text-xs font-black text-black uppercase">
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-800 font-medium">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-[9px] font-bold text-gray-600 uppercase">
                            {formatTime(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
