/**
 * The ModelService class has methods used to communicate with the AI model.
 */

const POST = "POST";

class ModelService {

    static modelEndpoint = process.env.MODEL_END;

    static async sendQuestion(promptJSON){

        const errorMsg = {
            error: true,
            message: "Error sending question"
        }

        try{
            const response = await fetch(ModelService.modelEndpoint, {
                method: POST,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(promptJSON)
            });

            if (!response.ok){
                return errorMsg;
            }

            const result = await response.json();

            return result;
        } catch (error){

        }
    }

}

export default ModelService;