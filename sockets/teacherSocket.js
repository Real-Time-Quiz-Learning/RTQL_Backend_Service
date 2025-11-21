export class TeacherSocket {
    constructor(io) {
        this.io = io;

        this.b_incoming         = this.incoming.bind(this);
        this.b_quizRoomCreate   = this.quizRoomCreate.bind(this);
    }

    incoming(message) {
        this.io.emit('outgoing', message);
    }

    quizRoomCreate(user) {
        // WO: this socket should likely use some form of middleware to authenticate the user before actually doing any sort of room creation
        this.io.emit('quizRoomCreated', `${JSON.stringify(user)}, ${this.socket.id}`);
    }

    registerHandlers(socket) {
        this.socket = socket;

        socket.on('incoming',       this.b_incoming);
        socket.on('quizRoomCreate', this.b_quizRoomCreate);
    }
}