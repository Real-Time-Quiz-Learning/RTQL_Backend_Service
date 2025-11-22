export class StudentSocket {
    constructor(sio, tio, quizRoomService) {
        this.sio = sio;
        this.tio = tio;
        this.quizRoomService = quizRoomService;

        this.b_incoming = this.incoming.bind(this);
        this.b_quizRoomJoin = this.quizRoomJoin.bind(this);
        this.b_quizRoomLeave = this.quizRoomLeave.bind(this);
        this.b_quizRoomPostQuestionAnswer = this.postQuizAnswer.bind(this);
    }

    incoming(message) {
        this.io.emit('outgoing', message);
    }

    quizRoomJoin(roomId, nickname) {
        this.socket.join(roomId);

        // USE THE SERVICE TO IDENTIFY THE ROOM CREATED FOR THIS CONNECTION
        let clientId = this.socket.id;

        this.quizRoomService.addClientToQuizRoom(roomId, clientId, nickname);
        console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

        this.sio.to(roomId).emit('userJoined', nickname);
        this.tio.to(roomId).emit('userJoined', nickname);
    }

    quizRoomLeave(roomId) {
        this.socket.leave(roomId);

        // USE THE SERVICE TO IDENTIFY THE 
        this.sio.to(roomId).emit('userLeaves', nickname);
        this.tio.to(roomId).emit('userLeaves', nickname);
    }

    /**
     * ```json
     * {
     *      question: Integer,
     *      response: Integer,
     * }
     * ```
     * @param {*} roomId 
     * @param {*} response 
     */
    postQuizAnswer(roomId, answer) {
        console.log(`${this.socket.id}, answer: ${JSON.stringify(answer)}`);

        // USE THE SERVICE TO CHECK THAT THE INCOMING RESPONSE TO A QUESTION IS CORRECT.
        this.quizRoomService.addQuestionResponse(roomId, answer);
        console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

        this.tio.to(roomId).emit('responsePosted', answer);
        this.sio.to(roomId).emit('responsePosted', answer);
    }

    registerHandlers(socket) {
        this.socket = socket;

        socket.on('incoming', this.b_incoming);
        socket.on('quizRoomJoin', this.b_quizRoomJoin);
        socket.on('quizRoomLeave', this.b_quizRoomLeave);
        socket.on('quizRoomPostQuestionAnswer', this.b_quizRoomPostQuestionAnswer);
    }
}