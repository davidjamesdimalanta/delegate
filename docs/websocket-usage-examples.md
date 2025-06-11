# WebSocket Implementation Guide

This guide shows how to use the new React Native WebSocket implementation in the medical app.

## Overview

The app now uses:
- **React Native's built-in WebSocket API** (no Node.js dependencies)
- **Supabase realtime** for database subscriptions 
- **Custom WebSocket service** for additional real-time features
- **Automatic reconnection** and proper app lifecycle management

## Key Components

### 1. WebSocket Service (`lib/websocket-service.ts`)
- Singleton service using React Native's native WebSocket
- Automatic reconnection with exponential backoff
- Message queuing during disconnections
- App state management (background/foreground)

### 2. React Hooks (`hooks/useWebSocket.ts`)
- `useWebSocket()` - Main hook for WebSocket connections
- `useWebSocketSubscription()` - Subscribe to specific message types
- `useWebSocketStatus()` - Get connection status

### 3. Database Real-time (`lib/database.ts`, etc.)
- Supabase realtime subscriptions for database changes
- Real-time updates for patients, tasks, visits, clinical notes

## Usage Examples

### Basic WebSocket Connection

```tsx
import { useWebSocket } from '../hooks/useWebSocket';

function MyComponent() {
  const { 
    isConnected, 
    sendMessage, 
    subscribe, 
    connectionStatus 
  } = useWebSocket({
    url: 'wss://your-websocket-server.com',
    autoConnect: true
  });

  useEffect(() => {
    // Subscribe to real-time notifications
    subscribe('notification', (message) => {
      console.log('New notification:', message.payload);
    });
  }, [subscribe]);

  const handleSendMessage = () => {
    sendMessage('user_action', {
      action: 'visit_completed',
      visitId: '123'
    });
  };

  return (
    <View>
      <Text>Status: {connectionStatus}</Text>
      <Button 
        title="Send Message" 
        onPress={handleSendMessage}
        disabled={!isConnected}
      />
    </View>
  );
}
```

### Database Real-time Subscriptions

```tsx
import { usePatients } from '../hooks/usePatients';

function PatientsList() {
  const { patients, loading } = usePatients();

  // Real-time updates are automatically handled by the hook
  // Patients list will update when database changes occur

  return (
    <FlatList
      data={patients}
      renderItem={({ item }) => (
        <PatientCard patient={item} />
      )}
    />
  );
}
```

### Message Type Subscriptions

```tsx
import { useWebSocketSubscription } from '../hooks/useWebSocket';

function NotificationsComponent() {
  const [notifications, setNotifications] = useState([]);

  // Subscribe to specific message types
  useWebSocketSubscription('patient_alert', (message) => {
    setNotifications(prev => [...prev, message.payload]);
  }, []);

  useWebSocketSubscription('visit_update', (message) => {
    console.log('Visit updated:', message.payload);
  }, []);

  return (
    <View>
      {notifications.map(notification => (
        <NotificationCard key={notification.id} data={notification} />
      ))}
    </View>
  );
}
```

### Connection Status Monitoring

```tsx
import { useWebSocketStatus } from '../hooks/useWebSocket';

function ConnectionIndicator() {
  const status = useWebSocketStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'green';
      case 'connecting': 
      case 'reconnecting': return 'orange';
      case 'disconnected':
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <View style={[styles.indicator, { backgroundColor: getStatusColor() }]}>
      <Text>{status}</Text>
    </View>
  );
}
```

## Real-time Features Now Available

### 1. Patient Updates
```tsx
// Automatic real-time updates when:
// - New patients are added
// - Patient information is updated
// - Patient status changes
```

### 2. Task Management
```tsx
// Real-time task updates for:
// - New tasks assigned
// - Task status changes
// - Task completions
```

### 3. Visit Tracking
```tsx
// Live visit updates including:
// - Visit status changes
// - Nursing interventions
// - Clinical notes additions
```

### 4. Clinical Notes
```tsx
// Real-time clinical documentation:
// - AI Scribe transcriptions
// - Note approvals
// - Clinical assessments
```

## Best Practices

### 1. Connection Management
```tsx
// Let the service handle reconnections automatically
// Use the hooks to monitor connection status
// Don't manually manage WebSocket connections
```

### 2. Message Handling
```tsx
// Always check connection status before sending
if (isConnected) {
  sendMessage('type', payload);
} else {
  // Message will be queued automatically
  console.log('Message queued for when connection resumes');
}
```

### 3. Subscription Cleanup
```tsx
useEffect(() => {
  const unsubscribe = subscribe('message_type', handleMessage);
  
  // Cleanup is handled automatically by hooks
  return unsubscribe;
}, []);
```

### 4. Error Handling
```tsx
// Monitor connection status for error states
useEffect(() => {
  if (connectionStatus === 'error') {
    // Handle connection errors
    console.log('WebSocket connection failed');
  }
}, [connectionStatus]);
```

## Migration from Polling

The app has been updated from polling-based updates to real-time WebSocket subscriptions:

### Before (Polling)
```tsx
// ❌ Old approach - polling every 30 seconds
setInterval(async () => {
  const data = await fetchPatients();
  setPatients(data);
}, 30000);
```

### After (Real-time)
```tsx
// ✅ New approach - instant real-time updates
useEffect(() => {
  const unsubscribe = subscribeToPatients((patients) => {
    setPatients(patients);
  });
  return unsubscribe;
}, []);
```

## Troubleshooting

### Connection Issues
1. Check WebSocket URL is accessible
2. Verify network connectivity
3. Monitor console logs for connection attempts
4. Check if firewall blocks WebSocket connections

### Message Delivery
1. Messages are queued during disconnections
2. Check `isConnected` status before sending
3. Monitor `messagesReceived` counter for activity

### Real-time Subscriptions
1. Ensure Supabase project has realtime enabled
2. Check database RLS policies allow subscriptions
3. Verify table names match subscription filters

## Performance Considerations

- WebSocket reconnections use exponential backoff
- Message queue is limited to 100 messages
- Subscriptions are automatically cleaned up
- App state changes pause/resume connections appropriately
- Real-time updates are throttled to prevent excessive renders 