import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(sessionId, onSeatUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    socketRef.current = io('http://localhost:3001');
    const socket = socketRef.current;

    socket.emit('join-session', sessionId);

    socket.on('seat:update', onSeatUpdate);

    return () => {
      socket.emit('leave-session', sessionId);
      socket.disconnect();
    };
  }, [sessionId, onSeatUpdate]);

  return socketRef.current;
}

