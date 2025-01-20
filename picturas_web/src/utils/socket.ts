import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

let socket: Socket | null = null;
const isConnected = ref(false);

export function initializeSocket(token?: string) {
  const authToken = token || localStorage.getItem('socketToken');
  if (!authToken) {
    console.error('No token provided for socket connection');
    return;
  }

  if (socket) return;

  localStorage.setItem('socketToken', authToken);

  socket = io('http://192.168.49.2', {
    auth: { token: authToken },
    path: '/api/ws',
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    isConnected.value = true;
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    isConnected.value = false;
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    isConnected.value = false;
  });
}

export function deactivateSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected.value = false;
    console.log('Socket deactivated');
  }

  localStorage.removeItem('socketToken');
}

export function getSocket() {
  return socket;
}

export function useSocketStatus() {
  return { isConnected };
}

if (localStorage.getItem('socketToken')) {
  initializeSocket();
}
