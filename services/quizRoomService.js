export class QuizRoomService {
    constructor(io) {
        this.io = io;
    }

    start() {
        this.io.on('connection', (socket) => {
            console.log('client connected');

            socket.on('incoming', (user, msg) => {
                this.io.emit('outgoing', msg);
            });

            socket.on('')

            socket.on('disconnect', (user, message) => {
                console.log('client disconnected');
                console.log(`client ${user}`);
            });
        });
    }
}