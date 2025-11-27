import { Question } from '../models/question.js';
import { Response } from '../models/response.js';

const errorRoomConnectionIDMsg = "No room with the given connection ID";
const errorRoomDNEMsg = "No such room exists";
const errorNoQuestionMsg = "There is no question";
const errorNoQuestionIdMsg = 'There is not question id';
const errorNoOptionsMsg = "There are no options for this question";
const errorNoCorrectMsg = "There are no correct answers for this question";
const errorInactiveQuestionDNEMsg = "Can't make question inactive, no question exists";
const errorNoQforResponseMsg = "There is no question for this response";
const errorNoGuessforQMsg = "There is no guess for this question";
const errorUndefinedClientMsg = "Question submitted for undefined client";
const errorInactiveQMsg = "The question you are trying to respond to is now inactive";

export class QuizRoomService {
    constructor() {
        this.rooms = {};
        this.questions = 0;
    }

    // Should likely have more validation here
    _validateRoomConnectionId(roomConnectionId) {
        if (!this.rooms[roomConnectionId])
            throw new Error(errorRoomConnectionIDMsg);
    }

    // Create a new room, will be associated with connection
    createAQuizRoom(roomConnectionId) {
        this.rooms[roomConnectionId] = {};

        this.rooms[roomConnectionId].clients = {};
        this.rooms[roomConnectionId].questions = [];

        console.log(JSON.stringify(this.rooms));
    }

    // Should be about this simple
    deleteAQuizRoom(roomConnectionId) {
        delete this.rooms[roomConnectionId];

        console.log(JSON.stringify(this.rooms));
    }

    // Retrieves a specific quiz room
    getQuizRoom(roomConnectionId) {
        return this.rooms[roomConnectionId];
    }

    /**
     * 
     */
    getQuizRoomStats(roomConnectionId) {
        this._validateRoomConnectionId(roomConnectionId);

        console.log(this.rooms[roomConnectionId]);
        console.log(this.rooms[roomConnectionId].questions);

        const quizRoom = this.rooms[roomConnectionId];
        let correctAnswers = 0;
        let totalAnswers = 0;
        
        for (const question of quizRoom.questions) {
            let qCorrectAnswers = 0;
            let qTotalAnswers = 0;
            let qCorrectResponse = question.responses.filter(r => r.correct)[0];

            for (const answer of question.answers) {
                if (qCorrectResponse.id === answer.responseId) {
                    correctAnswers++;
                    qCorrectAnswers++;
                }
                totalAnswers++;
                qTotalAnswers++;
            }

            question.correctAnswers = qCorrectAnswers;
            question.totalAnswers = qTotalAnswers;
        }
        
        quizRoom.correctAnswers = correctAnswers;
        quizRoom.totalAnswers = totalAnswers;
        quizRoom.totalClients = Object.entries(quizRoom.clients).length;

        console.log(quizRoom);

        return quizRoom;
    }

    // Associate a client connection with the quiz room
    addClientToQuizRoom(roomConnectionId, clientConnectionId, nickname) {
        if (!this.rooms[roomConnectionId]) {
            throw new Error(errorRoomDNEMsg);
        } else {
            let snick = (nickname !== '')
                ? nickname
                : 'willy wonka';
            this.rooms[roomConnectionId].clients[clientConnectionId] = snick;       // assign the connected client but also their nickname

            return snick;
        }
        // console.log(this.rooms[roomConnectionId]);
    }

    // Disassociate a client connection with the quiz room
    removeClientFromQuizRoom(roomConnectionId, clientConnectionId) {
        throw new Error('I have not implemented this thing yet');
    }

    /**
     * Question that should be added to the room.
     * 
     * @param {string} roomConnectionId unqiue identifier for the quiz room connection
     * @param {Question} question question object to add to the room
     * @returns 
     */
    addQuestion(roomConnectionId, question) {
        this._validateRoomConnectionId(roomConnectionId);

        if (question.id === undefined)         // database question id, not to be confused with the published question id (incremented)
            throw new Error(errorNoQuestionIdMsg);
        if (question.qtext === undefined)
            throw new Error(errorNoQuestionMsg);
        if (question.responses === undefined)
            throw new Error(errorNoOptionsMsg);

        console.log(`question: ${JSON.stringify(question)}`);

        question.answers = [];
        question.active = true;
        question.publishedId = this.questions++;         // assign a unique ID to the issued question

        this.rooms[roomConnectionId].questions.push(question);

        return question;
    }

    /**
     * specific question published in the question room published.
     * 
     * @param {string} roomConnectionId the unique connection id
     * @param {number} publishedId the unique published id 
     * @returns 
     */
    makeAQuestionInactive(roomConnectionId, publishedId) {
        this._validateRoomConnectionId(roomConnectionId);

        console.log(`${roomConnectionId}, ${publishedId}`);
        console.log(JSON.stringify(this.rooms[roomConnectionId].questions));

        let question = this.rooms[roomConnectionId].questions
            .filter(c => c.publishedId === Number.parseInt(publishedId))[0];

        if (!question)
            throw new Error(errorInactiveQuestionDNEMsg);

        question.active = false;

        return question;
    }

    /**
     * specific response id submitted to the question.
     * 
     * @param {string} roomConnectionId the unique connection id
     * @param {*} answer the unique published id
     */
    addQuestionResponse(roomConnectionId, answer) {
        this._validateRoomConnectionId(roomConnectionId);

        if (answer.publishedId === undefined)
            throw new Error(errorNoQforResponseMsg);
        // if (answer.response === undefined)
        //     throw new Error(errorNoGuessforQMsg);
        if (answer.responseId === undefined)
            throw new Error(errorNoGuessforQMsg);
        if (answer.clientId === undefined)
            console.log(errorUndefinedClientMsg);

        console.log(`repsonse: ${JSON.stringify(answer)}`);

        // let respondingTo = this.rooms[roomConnectionId].questions[answer.question];
        let respondingTo = this.rooms[roomConnectionId].questions
            .filter(c => c.publishedId === Number.parseInt(answer.publishedId))[0];

        console.log(JSON.stringify(respondingTo));

        if (!respondingTo)
            throw new Error(errorNoQforResponseMsg);
        if (!respondingTo.active)
            throw new Error(errorInactiveQMsg);

        console.log(respondingTo);

        respondingTo.answers.push(answer);
    }
    
    // Remove a question from a room
    removeQuestion(question) {

    }
}
