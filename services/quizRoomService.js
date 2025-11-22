export class QuizRoomService {
    constructor() {
        this.rooms = {};
    }

    // Should likely have more validation here
    _validateRoomConnectionId(roomConnectionId) {
        if (!this.rooms[roomConnectionId])
            throw new Error('no room with the given connection id');
    }

    // Create a new room, will be associated with connection
    createAQuizRoom(roomConnectionId) {
        this.rooms[roomConnectionId] = {};

        this.rooms[roomConnectionId].clients = {};
        this.rooms[roomConnectionId].questions = [];
    }

    // Retrieves a specific quiz room
    getQuizRoom(roomConnectionId) {
        return this.rooms[roomConnectionId];
    }

    // Associate a client connection with the quiz room
    addClientToQuizRoom(roomConnectionId, clientConnectionId, nickname) {
        if (!this.rooms[roomConnectionId]) {
            throw new Error('cannot connect to such a room as it does not actually exist');
        } else {
            let snick = (nickname.length !== 0)
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
        if (question.question === undefined)
            throw new Error('there is no question in this question');
        if (question.options === undefined)
            throw new Error('there are no options for this question');
        if (question.correct === undefined)
            throw new Error('there is not correct answer for this question');

        console.log(`question: ${JSON.stringify(question)}`);

        question.answers = [];

        this.rooms[roomConnectionId].questions.push(question);

        return question;
    }

    // Add a new response to a question
    addQuestionResponse(roomConnectionId, answer) {
        if (answer.question === undefined)
            throw new Error('there is no question for this response');
        if (answer.response === undefined)
            throw new Error('there is no guess for this question');

        console.log(`repsonse: ${JSON.stringify(answer)}`);

        let respondingTo = this.rooms[roomConnectionId].questions[answer.question];

        console.log(respondingTo);

        if (!respondingTo)
            throw new Error('the question which you are attempting to respond to does in fact not exist');

        respondingTo.answers.push(answer);
    }
    
    // Remove a question from a room
    removeQuestion(question) {

    }
}
