import { ApiConstants } from '../constants';

class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  init(token) {
    this.socketUrl = `${ApiConstants.SOCKET.BASE_URL}${ApiConstants.SOCKET.NOTIFICATIONS}`;
    this.socket = new WebSocket(this.socketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket Connected');
      this.socket.send(JSON.stringify({ token: token }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      Object.keys(this.callbacks).forEach((key) => this.callbacks[key](data));
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  addCallback(key, callback) {
    this.callbacks[key] = callback;
  }

  removeCallback(key) {
    delete this.callbacks[key];
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default WebSocketService.getInstance();
