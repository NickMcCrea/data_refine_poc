// SocketClient.ts
import io, { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

class SocketClient extends EventEmitter {
  private socket!: Socket;
  private static instance: SocketClient;

  constructor(apiUrl: string) {
    super();
    this.connectSocket(apiUrl);
  }

  // Singleton implementation
  static getInstance = (apiUrl: string) => {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient(apiUrl);
    }
    return SocketClient.instance;
  };

  private connectSocket = (apiUrl: string) => {
    this.socket = io(apiUrl);

    // Generic event listener that re-emits all received events
    this.socket.onAny((event, ...args) => {
      this.emit(event, ...args);
      //console.log(event, args);
    });
  };

  // Subscribe to a specific event
  subscribe = (event: string, listener: (...args: any[]) => void) => {
    this.on(event, listener);
  };

  // Method to send a message via WebSocket
  sendSocketMessage = (event: string, message: any) => {
    this.socket.emit(event, message);
  };

  // Cleanup method
  cleanup = () => {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  };
}

export default SocketClient;
