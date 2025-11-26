export class Response {
    /**
     * Create a new response model.
     * 
     * @param {int} id the unique if of the response
     * @param {int} qid the id of the question for which this response belongs
     * @param {int} rtext text of the response
     * @param {boolean} correct whether this is a correct response
     */
    constructor(id, questionId, response, correct) {
        this.id = id;
        this.qid = questionId;
        this.rtext = response;
        this.correct = correct;
    }
}