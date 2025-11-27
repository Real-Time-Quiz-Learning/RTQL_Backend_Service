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
        this.b_quizRoomMakeQuestionInactive = this.makeQuizQuestionInactive.bind(this);
        this.b_quizRoomStats = this.quizRoomStats.bind(this);
        this.b_quizRoomDestroy = this.quizRoomDestroy.bind(this);
    }

    incoming(message) {
        this.sio.emit('outgoing', message);
    }

    quizRoomCreate(socket) {
        console.log(`creating a new quiz room: ${socket.id}`);
        try {
            let roomId = socket.id;

            socket.join(roomId);
            this.quizRoomService.createAQuizRoom(socket.id);
            this.tio.to(socket.id).emit('quizRoomCreated', roomId);

        } catch (err) {
            this.tio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    quizRoomDestroy(socket) {
        console.log(`destroying the quiz room ${socket.id}`);
        try {
            let roomId = socket.id;
            let quizStats = this.quizRoomService.getQuizRoomStats(roomId);

            console.log(JSON.stringify(quizStats));

            this.tio.to(roomId).emit('quizStats', quizStats);
            this.sio.to(roomId).emit('quizStats', quizStats);

            // Initiate the teardown
            this.quizRoomService.deleteAQuizRoom(roomId);

            console.log('WE HAVE INITIATED THE TEARDOWN IT IS ALL OVER NOW 🔥🔥🧨🧨💥💥🧨💣💣💣🧨💥🔥');
            // console.log(JSON.stringify(this.quizRoomService.rooms));

        } catch (err) {
            this.tio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    quizRoomStats(socket, roomId) {
        console.log(`getting quiz stats for room: ${roomId}`);
        try {
            let quizStats = this.quizRoomService.getQuizRoomStats(roomId);
            this.tio.to(roomId).emit('quizStats', quizStats);
        } catch (err) {
            this.tio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    postQuizQuestion(socket, roomId, question) {
        console.log(`${roomId}: ${JSON.stringify(question)}`);
        try {
            let addedQuestion = this.quizRoomService.addQuestion(roomId, question);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.tio.to(roomId).emit('questionPosted', addedQuestion);
            this.sio.to(roomId).emit('questionPosted', addedQuestion);

        } catch (err) {
            this.tio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    postQuizAnswer(socket, roomId, answer) {
        console.log(`${socket.id}, answer: ${JSON.stringify(answer)}`);
        try {
            this.quizRoomService.addQuestionResponse(roomId, answer);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.tio.to(roomId).emit('responsePosted', answer);
            this.sio.to(roomId).emit('responsePosted', answer);

        } catch (err) {
            this.tio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    makeQuizQuestionInactive(socket, roomId, questionId) {
        console.log(`${socket.id}, roomId: ${roomId}, questionId: ${questionId}`);
        try {
            let question = this.quizRoomService.makeAQuestionInactive(roomId, questionId);

            console.log(JSON.stringify(question));

            this.tio.to(roomId).emit('questionRemoved', question);

            // Bro was correct?
            for(let answer of question.answers) {
                let response = question.responses.filter(r => r.id === answer.responseId)[0];
                let correct = new Boolean(response.correct);

                this.sio.to(answer.clientId).emit('questionClosed', correct);
            }

            this.sio.to(roomId).emit('questionRemoved', question);

        } catch (err) {
            this.tio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    registerHandlers(socket) {
        socket.on('incoming', (incoming) => {
            this.b_incoming(socket, incoming);
        });
        socket.on('quizRoomCreate', () => {
            this.b_quizRoomCreate(socket);
        });
        socket.on('quizRoomPostQuestion', (roomId, question) => {
            this.b_quizRoomPostQuestion(socket, roomId, question);
        });
        socket.on('quizRoomPostQuestionAnswer', (roomId, answer) => {
            this.b_quizRoomPostQuestionAnswer(socket, roomId, answer);
        });
        socket.on('quizRoomQuestionInactive', (roomId, questionId) => {
            this.b_quizRoomMakeQuestionInactive(socket, roomId, questionId);
        });
        socket.on('quizRoomDestroy', () => {
            this.b_quizRoomDestroy(socket);
        });
        socket.on('quizRoomStats', (roomId) => {
            this.b_quizRoomStats(socket, roomId);
        });
        socket.on('disconnect', () => {
            this.b_quizRoomDestroy(socket);
        });
    }
}