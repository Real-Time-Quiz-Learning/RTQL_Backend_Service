import { RtqlMessage } from "../models/message.js";

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
        console.log(`${this.socket.id} joins ${roomId} w/ nickname ${nickname}`);
        try {
            this.socket.join(roomId);

            // USE THE SERVICE TO IDENTIFY THE ROOM CREATED FOR THIS CONNECTION
            let clientId = this.socket.id;

            this.quizRoomService.addClientToQuizRoom(roomId, clientId, nickname);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.sio.to(roomId).emit('userJoined', nickname);
            this.tio.to(roomId).emit('userJoined', nickname);

        } catch (err) {
            this.sio.emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    quizRoomLeave(roomId) {
        console.log(`${this.socket.id} leaves ${roomId}`);
        try {
            this.socket.leave(roomId);

            // USE THE SERVICE TO IDENTIFY THE 
            this.sio.to(roomId).emit('userLeaves', nickname);
            this.tio.to(roomId).emit('userLeaves', nickname);
        } catch (err) {
            this.sio.emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
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
            this.sio.emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    registerHandlers(socket) {
        this.socket = socket;

        socket.on('incoming', this.b_incoming);
        socket.on('quizRoomJoin', this.b_quizRoomJoin);
        socket.on('quizRoomLeave', this.b_quizRoomLeave);
        socket.on('quizRoomPostQuestionAnswer', this.b_quizRoomPostQuestionAnswer);
    }
}