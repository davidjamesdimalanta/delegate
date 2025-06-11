import { AppState, AppStateStatus } from 'react-native';

// WebSocket Message Types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  id?: string;
}

// Connection States
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

// Event Callback Types
export type MessageCallback = (message: WebSocketMessage) => void;
export type StatusCallback = (status: ConnectionStatus) => void;

// WebSocket Service Configuration
interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

/**
 * React Native WebSocket Service
 * Provides reliable real-time communication with automatic reconnection,
 * message queuing, and proper lifecycle management
 */
class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private config: WebSocketConfig;
  private status: ConnectionStatus = 'disconnected';
  
  // Message handling
  private messageCallbacks = new Map<string, Set<MessageCallback>>();
  private statusCallbacks = new Set<StatusCallback>();
  private messageQueue: WebSocketMessage[] = [];
  
  // Reconnection management
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  
  // App state management
  private appStateSubscription: any = null;
  private isInBackground = false;

  private constructor() {
    this.config = {
      url: '',
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000
    };
    
    this.setupAppStateHandling();
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Initialize and connect to WebSocket server
   */
  async connect(config: WebSocketConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('🔌 WebSocket already connected');
      return;
    }

    this.setStatus('connecting');
    
    try {
      await this.createConnection();
    } catch (error) {
      console.error('❌ Failed to connect WebSocket:', error);
      this.setStatus('error');
      this.scheduleReconnect();
    }
  }

  /**
   * Create WebSocket connection with proper event handlers
   */
  private async createConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔄 Creating WebSocket connection to:', this.config.url);
        
        this.socket = new WebSocket(this.config.url);

        this.socket.onopen = () => {
          console.log('✅ WebSocket connected');
          this.setStatus('connected');
          this.reconnectAttempts = 0;
          this.clearReconnectTimeout();
          this.startHeartbeat();
          this.processMessageQueue();
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('❌ Failed to parse WebSocket message:', error);
          }
        };

        this.socket.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.setStatus('error');
          reject(error);
        };

        this.socket.onclose = (event) => {
          console.log('🔌 WebSocket closed:', event.code, event.reason);
          this.setStatus('disconnected');
          this.stopHeartbeat();
          
          // Only reconnect if not manually closed and not in background
          if (event.code !== 1000 && !this.isInBackground) {
            this.scheduleReconnect();
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    console.log('🔌 Disconnecting WebSocket');
    
    this.clearReconnectTimeout();
    this.stopHeartbeat();
    
    if (this.socket) {
      this.socket.close(1000, 'Manual disconnect');
      this.socket = null;
    }
    
    this.setStatus('disconnected');
  }

  /**
   * Send message to server
   */
  sendMessage(type: string, payload: any): boolean {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      id: this.generateMessageId()
    };

    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
        console.log('📤 Message sent:', type);
        return true;
      } catch (error) {
        console.error('❌ Failed to send message:', error);
        this.queueMessage(message);
        return false;
      }
    } else {
      console.log('📥 Queueing message (not connected):', type);
      this.queueMessage(message);
      return false;
    }
  }

  /**
   * Subscribe to messages of a specific type
   */
  subscribe(messageType: string, callback: MessageCallback): () => void {
    if (!this.messageCallbacks.has(messageType)) {
      this.messageCallbacks.set(messageType, new Set());
    }
    
    this.messageCallbacks.get(messageType)!.add(callback);
    
    console.log('📡 Subscribed to message type:', messageType);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.messageCallbacks.get(messageType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.messageCallbacks.delete(messageType);
        }
      }
      console.log('📡 Unsubscribed from message type:', messageType);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback: StatusCallback): () => void {
    this.statusCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.status === 'connected' && this.socket?.readyState === WebSocket.OPEN;
  }

  // Private methods

  private handleMessage(message: WebSocketMessage): void {
    console.log('📨 Received message:', message.type);
    
    const callbacks = this.messageCallbacks.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('❌ Error in message callback:', error);
        }
      });
    }
  }

  private setStatus(status: ConnectionStatus): void {
    if (this.status !== status) {
      this.status = status;
      console.log('🔄 WebSocket status changed to:', status);
      
      this.statusCallbacks.forEach(callback => {
        try {
          callback(status);
        } catch (error) {
          console.error('❌ Error in status callback:', error);
        }
      });
    }
  }

  private queueMessage(message: WebSocketMessage): void {
    this.messageQueue.push(message);
    
    // Limit queue size to prevent memory issues
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift();
    }
  }

  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;
    
    console.log('📤 Processing message queue:', this.messageQueue.length, 'messages');
    
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    
    messages.forEach(message => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        try {
          this.socket.send(JSON.stringify(message));
        } catch (error) {
          console.error('❌ Failed to send queued message:', error);
          this.queueMessage(message);
        }
      } else {
        this.queueMessage(message);
      }
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.log('❌ Max reconnection attempts reached');
      this.setStatus('error');
      return;
    }

    const delay = Math.min(
      this.config.reconnectInterval! * Math.pow(2, this.reconnectAttempts),
      30000 // Cap at 30 seconds
    );
    
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts + 1} in ${delay}ms`);
    
    this.setStatus('reconnecting');
    this.reconnectAttempts++;
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.config);
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage('ping', { timestamp: new Date().toISOString() });
      }
    }, this.config.heartbeatInterval!);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private setupAppStateHandling(): void {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('📱 App became active');
        this.isInBackground = false;
        
        // Reconnect if needed
        if (this.status === 'disconnected' && this.config.url) {
          setTimeout(() => this.connect(this.config), 1000);
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('📱 App went to background');
        this.isInBackground = true;
        
        // Don't disconnect immediately - give some time for quick app switches
        setTimeout(() => {
          if (this.isInBackground) {
            this.disconnect();
          }
        }, 5000);
      }
    });
  }

  private generateMessageId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Cleanup method for when service is no longer needed
   */
  cleanup(): void {
    this.disconnect();
    
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    
    this.messageCallbacks.clear();
    this.statusCallbacks.clear();
    this.messageQueue = [];
  }
}

// Export singleton instance
export const websocketService = WebSocketService.getInstance();
