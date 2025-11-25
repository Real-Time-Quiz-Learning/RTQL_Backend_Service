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

            for (const answer of question.answers) {
                if (question.correct === answer.response) {
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

    // Add a question to a room
    addQuestion(roomConnectionId, question) {
        this._validateRoomConnectionId(roomConnectionId);

        if (question.qid === undefined)         // database question id, not to be confused with the published question id (incremented)
            throw new Error(errorNoQuestionIdMsg);
        if (question.question === undefined)
            throw new Error(errorNoQuestionMsg);
        if (question.options === undefined)
            throw new Error(errorNoOptionsMsg);
        if (question.correct === undefined)
            throw new Error(errorNoCorrectMsg);

        console.log(`question: ${JSON.stringify(question)}`);

        question.answers = [];
        question.active = true;
        question.id = this.questions++;         // assign a unique ID to the issued question

        this.rooms[roomConnectionId].questions.push(question);

        return question;
    }

    // Make a question in the room inactive
    makeAQuestionInactive(roomConnectionId, questionId) {
        this._validateRoomConnectionId(roomConnectionId);

        console.log(`${roomConnectionId}, ${questionId}`);
        console.log(JSON.stringify(this.rooms[roomConnectionId].questions));

        let question = this.rooms[roomConnectionId].questions
            .filter(c => c.id === Number.parseInt(questionId))[0];

        if (!question)
            throw new Error(errorInactiveQuestionDNEMsg);

        question.active = false;

        return question;
    }

    // Add a new response to a question
    addQuestionResponse(roomConnectionId, answer) {
        this._validateRoomConnectionId(roomConnectionId);

        if (answer.id === undefined)
            throw new Error(errorNoQforResponseMsg);
        if (answer.response === undefined)
            throw new Error(errorNoGuessforQMsg);
        if (answer.clientId === undefined)
            console.log(errorUndefinedClientMsg);

        console.log(`repsonse: ${JSON.stringify(answer)}`);

        // let respondingTo = this.rooms[roomConnectionId].questions[answer.question];
        let respondingTo = this.rooms[roomConnectionId].questions
            .filter(c => c.id === answer.id)[0];

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
