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
        this.b_quizRoomMakeQuestionInactive = this.makeQuizAnswerInactive.bind(this);
        this.b_quizRoomDestroy = this.quizRoomDestroy.bind(this);
    }

    incoming(message) {
        this.sio.emit('outgoing', message);
    }

    quizRoomCreate() {
        console.log(`creating a new quiz room: ${this.socket.id}`);
        try {
            let roomId = this.socket.id;

            this.socket.join(roomId);
            this.quizRoomService.createAQuizRoom(this.socket.id);
            this.tio.to(this.socket.id).emit('quizRoomCreated', roomId);

        } catch (err) {
            this.tio.to(this.socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    quizRoomDestroy(user) {
        console.log(`destroying the quiz room ${this.socket.id}`);
        try {
            let roomId = this.socket.id;
            let quizStats = this.quizRoomService.getQuizRoomStats(roomId);

            console.log(JSON.stringify(quizStats));

            this.tio.to(roomId).emit('quizStats', quizStats);
            this.sio.to(roomId).emit('quizStats', quizStats);

            // Initiate the teardown
            // this.quizRoomService.deleteAQuizRoom(roomId);
            console.log('WE HAVE INITIATED THE TEARDOWN IT IS ALL OVER NOW 🔥🔥🧨🧨💥💥🧨💣💣💣🧨💥🔥');

        } catch (err) {
            this.tio.to(this.socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
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
            this.tio.to(this.socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    postQuizAnswer(roomId, answer) {
        console.log(`${this.socket.id}, answer: ${JSON.stringify(answer)}`);
        try {
            this.quizRoomService.addQuestionResponse(roomId, answer);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.tio.to(roomId).emit('responsePosted', answer);
            this.sio.to(roomId).emit('responsePosted', answer);

        } catch (err) {
            this.tio.to(this.socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    makeQuizAnswerInactive(roomId, questionId) {
        console.log(`${this.socket.id}, roomId: ${roomId}, questionId: ${questionId}`);
        try {
            let question = this.quizRoomService.makeAQuestionInactive(roomId, questionId);

            console.log(JSON.stringify(question));

            this.tio.to(roomId).emit('questionRemoved', question);

            // Bro was correct?
            for(let answer of question.answers) {
                let correct = question.correct === answer.response;
                this.sio.to(answer.clientId).emit('questionClosed', correct);
            }

            this.sio.to(roomId).emit('questionRemoved', question);

        } catch (err) {
            this.tio.to(this.socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    registerHandlers(socket) {
        this.socket = socket;

        socket.on('incoming', this.b_incoming);
        socket.on('quizRoomCreate', this.b_quizRoomCreate);
        socket.on('quizRoomPostQuestion', this.b_quizRoomPostQuestion);
        socket.on('quizRoomPostQuestionAnswer', this.b_quizRoomPostQuestionAnswer);
        socket.on('quizRoomQuestionInactive', this.b_quizRoomMakeQuestionInactive);
        socket.on('quizRoomDestroy', this.b_quizRoomDestroy);
    }
}