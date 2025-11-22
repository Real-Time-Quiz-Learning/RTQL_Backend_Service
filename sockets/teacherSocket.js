import { RtqlMessage } from '../models/message.js';

export class TeacherSocket {
    static questionPostError = 'failed to create question';

    constructor(tio, sio, quizRoomService) {
        this.tio = tio;
        this.sio = sio;
        this.quizRoomService = quizRoomService;

        this.b_incoming = this.incoming.bind(this);
        this.b_quizRoomCreate = this.quizRoomCreate.bind(this);
        this.b_quizRoomPostQuestion = this.postQuizQuestion.bind(this);
        this.b_quizRoomPostQuestionAnswer = this.postQuizAnswer.bind(this);
    }

    incoming(message) {
        this.sio.emit('outgoing', message);
    }

    quizRoomCreate(user) {
        console.log(`creating a new quiz room: ${this.socket.id}`);
        try {
            // WO: this socket should likely use some form of middleware to authenticate the user before actually doing any sort of room creation
            let roomId = this.socket.id;

            this.socket.join(roomId);

            // USE THE SERVICE TO DEFINE A ROOM FOR THIS CONNECTION
            this.quizRoomService.createAQuizRoom(this.socket.id);

            this.tio.emit('quizRoomCreated', { teacher: user, roomId: roomId });
        } catch (err) {
            this.tio.emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    postQuizQuestion(roomId, question) {
        console.log(`${roomId}: ${JSON.stringify(question)}`);
        try {
            let addedQuestion = this.quizRoomService.addQuestion(roomId, question);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.tio.to(roomId).emit('questionPosted', addedQuestion);
            this.sio.to(roomId).emit('questionPosted', addedQuestion);

        } catch (err) {
            this.tio.emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    postQuizAnswer(roomId, answer) {
        console.log(`${this.socket.id}, answer: ${JSON.stringify(answer)}`);
        try {
            // USE THE SERVICE TO CHECK THAT THE INCOMING RESPONSE TO A QUESTION IS CORRECT.
            this.quizRoomService.addQuestionResponse(roomId, answer);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.tio.to(roomId).emit('responsePosted', answer);
            this.sio.to(roomId).emit('responsePosted', answer);
        } catch (err) {
            this.tio.emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    registerHandlers(socket) {
        this.socket = socket;

        socket.on('incoming', this.b_incoming);
        socket.on('quizRoomCreate', this.b_quizRoomCreate);
        socket.on('quizRoomPostQuestion', this.b_quizRoomPostQuestion);
        socket.on('quizRoomPostQuestionAnswer', this.b_quizRoomPostQuestionAnswer);
    }
}