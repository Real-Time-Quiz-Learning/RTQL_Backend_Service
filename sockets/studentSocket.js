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

    quizRoomJoin(socket, roomId, nickname) {
        console.log(`${socket.id} joins ${roomId} w/ nickname ${nickname}`);
        // console.log(typeof nickname);
        try {
            socket.join(roomId);

            // USE THE SERVICE TO IDENTIFY THE ROOM CREATED FOR THIS CONNECTION
            let clientId = socket.id;
            let snick = this.quizRoomService.addClientToQuizRoom(roomId, clientId, nickname);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.sio.to(roomId).emit('userJoined', snick);
            this.tio.to(roomId).emit('userJoined', snick);

        } catch (err) {
            this.sio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    quizRoomLeave(socket, roomId) {
        console.log(`${socket.id} leaves ${roomId}`);
        try {
            this.socket.leave(roomId);

            // USE THE SERVICE TO IDENTIFY THE 
            this.sio.to(roomId).emit('userLeaves', nickname);
            this.tio.to(roomId).emit('userLeaves', nickname);
        } catch (err) {
            this.sio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    postQuizAnswer(socket, roomId, answer) {
        console.log(`${socket.id}, answer: ${JSON.stringify(answer)}`);
        try {
            // USE THE SERVICE TO CHECK THAT THE INCOMING RESPONSE TO A QUESTION IS CORRECT.
            answer.clientId = socket.id;
            this.quizRoomService.addQuestionResponse(roomId, answer);

            console.log(JSON.stringify(this.quizRoomService.getQuizRoom(roomId)));

            this.tio.to(roomId).emit('responsePosted', answer);
            this.sio.to(roomId).emit('responsePosted', answer);

        } catch (err) {
            this.sio.to(socket.id).emit('rtqlMessage', new RtqlMessage(err.message, 'error'));
        }
    }

    registerHandlers(socket) {
        socket.on('incoming', (incoming) => {
            this.b_incoming(socket, incoming)
        });
        socket.on('quizRoomJoin', (roomId, nickname) => {
            this.b_quizRoomJoin(socket, roomId, nickname)
        });
        socket.on('quizRoomLeave', (roomId) => {
            this.b_quizRoomLeave(socket, roomId);
        });
        socket.on('quizRoomPostQuestionAnswer', (roomId, answer) => {
            this.b_quizRoomPostQuestionAnswer(socket, roomId, answer);
        });
    }
}