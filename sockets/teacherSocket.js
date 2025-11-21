export class TeacherSocket {
    constructor(io, quizRoomService) {
        this.io = io;
        this.quizRoomService = quizRoomService;

        this.b_incoming = this.incoming.bind(this);
        this.b_quizRoomCreate = this.quizRoomCreate.bind(this);
        this.b_quizRoomJoin = this.quizRoomJoin.bind(this);
        this.b_quizRoomLeave = this.quizRoomLeave.bind(this);
        this.b_quizRoomPostQuestion = this.postQuizQuestion.bind(this);
        this.b_quizRoomPostQuestionAnswer = this.postQuizAnswer.bind(this);
    }

    incoming(message) {
        this.io.emit('outgoing', message);
    }

    quizRoomCreate(user) {
        // WO: this socket should likely use some form of middleware to authenticate the user before actually doing any sort of room creation
        let roomId = this.socket.id

        this.socket.join(roomId);
        this.quizRoomService.createAQuizRoom(this.socket.id);
        this.io.emit('quizRoomCreated', { teacher: user, roomId: roomId });

        // USE THE SERVICE TO DEFINE A ROOM FOR THIS CONNECTION
    }

    quizRoomJoin(roomId, nickname) {
        this.socket.join(roomId);
        this.io.to(roomId).emit('userJoined', nickname);

        // USE THE SERVICE TO IDENTIFY THE ROOM CREATED FOR THIS CONNECTION
        this.quizRoomService.addClientToQuizRoom(roomId, this.socket.id);
    }

    quizRoomLeave(roomId, nickname) {
        this.socket.leave(roomId);
        this.io.to(roomId).emit('userLeaves', nickname);

        // USE THE SERVICE TO ASSOCIATE THE CLIENT CONNECTION WITH THE ROOM CONNECTION
        // FOR FUTURE MESSAGES THAT IMPACT THE STATE OF THE OVERALL GAME
    }

    postQuizQuestion(roomId, question) {
        console.log(`${roomId}: ${JSON.stringify(question)}`);
        this.io.to(roomId).emit('questionPosted', question);

        // USE THE SERVICE TO TRACK QUESTION (WILL BE USED FOR STUDENTS TO VERIFY THEIR RESPONSES ARE CORRECT)
    }

    postQuizAnswer(roomId, questionId, response, nickname) {
        console.log(`${this.socket.id}, question-${questionId} response: ${response}`);
        this.io.to(roomId).emit('responsePosted', {
            response: response,
            responder: nickname
        });

        // USE THE SERVICE TO CHECK THAT THE INCOMING RESPONSE TO A QUESTION IS CORRECT.
    }

    registerHandlers(socket) {
        this.socket = socket;

        socket.on('incoming', this.b_incoming);
        socket.on('quizRoomCreate', this.b_quizRoomCreate);
        socket.on('quizRoomJoin', this.b_quizRoomJoin);
        socket.on('quizRoomLeave', this.b_quizRoomLeave);
        socket.on('quizRoomPostQuestion', this.b_quizRoomPostQuestion);
        socket.on('quizRoomPostQuestionAnswer', this.b_quizRoomPostQuestionAnswer);
    }
}