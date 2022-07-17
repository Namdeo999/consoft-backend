class CustomSuccessHandler {
    constructor(status, msg){
        // super();
        this.status = status;
        this.message = msg;
    }

    static success(message){
        return new CustomSuccessHandler(200, message)
    }

    static dataNotFound(message){
        return new CustomSuccessHandler(200, message)
    }

}

export default CustomSuccessHandler;