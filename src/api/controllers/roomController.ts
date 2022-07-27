import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("New User joining room: ", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    if (message.isScrumMaster) {
      await socket.join(message.roomId);
      socket.emit("scrum_master_joined", { username: message.username });
    } else {
      await socket.join(message.roomId)
      socket.emit("participant_joined", { username: message.username });
    }
  }

  @OnMessage("start_game")
  public async startGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    socket.emit("game_started", {
      start: true,
      userStory: message.userStory,
      isAnonymousVoting: message.isAnonymousVoting
    })
  }
}
