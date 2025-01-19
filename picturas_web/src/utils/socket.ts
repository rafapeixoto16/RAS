import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

let socket: Socket | null = null;
const isConnected = ref(false);

export function initializeSocket(token: string) {
  if (socket) return;

socket = io('http://192.168.49.2', {
    auth: { token },
    path: '/api/ws'
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
}

export function getSocket() {
  return socket;
}

export function useSocketStatus() {
  return { isConnected };
}