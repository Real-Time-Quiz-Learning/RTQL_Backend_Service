export class Question {
    /**
     * Creates a question.
     * 
     * @param {int} id the id of the question
     * @param {int} pid the id of the user who created the question
     * @param {string} qtext question text
     * @param {Response[]} responses response array
     */
    constructor(id, pid, question, responses) {
        this.id = id;
        this.pid = pid;
        this.qtext = question;
        this.responses = responses || [];
    }

    /**
     * Adds a response to the list of responses.
     * 
     * @param {Response} response 
     */
    addResponse(response) {
        this.responses.push(response);
    }
}
