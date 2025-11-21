export class QuizRoomService {
    constructor() {
        this.rooms = {};
    }

    // Create a new room, will be associated with connection
    createAQuizRoom(roomConnectionId) {
        this.rooms[roomConnectionId] = {};

        this.rooms[roomConnectionId].clients = [];
        this.rooms[roomConnectionId].questions = [];
        this.rooms[roomConnectionId].responses = [];
    }

    // Associate a client connection with the quiz room
    addClientToQuizRoom(roomConnectionId, clientConnectionId) {
        if (!this.rooms[roomConnectionId]) {
            throw new Error('QUIZ ROOM CONNECTION NOT REAL');
        } else {
            this.rooms[roomConnectionId].clients.push(clientConnectionId);
        }

        console.log(this.rooms[roomConnectionId]);
    }

    // Disassociate a client connection with the quiz room
    removeClientFromQuizRoom(roomConnectionId, clientConnectionId) {

    }

    // Add a question to a room
}