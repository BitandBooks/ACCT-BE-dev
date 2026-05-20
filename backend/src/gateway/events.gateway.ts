import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-event')
  handleJoinEvent(client: Socket, eventId: string) {
    client.join(`event-${eventId}`);
    return { success: true, message: `Joined event ${eventId}` };
  }

  @SubscribeMessage('leave-event')
  handleLeaveEvent(client: Socket, eventId: string) {
    client.leave(`event-${eventId}`);
    return { success: true, message: `Left event ${eventId}` };
  }

  // Method to broadcast booking updates
  notifyEventUpdate(eventId: string, data: any) {
    this.server.to(`event-${eventId}`).emit('event-updated', data);
  }

  // Method to broadcast new bookings
  notifyNewBooking(eventId: string, bookingData: any) {
    this.server.to(`event-${eventId}`).emit('booking-created', bookingData);
  }
}
