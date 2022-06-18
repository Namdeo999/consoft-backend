
class GenerateRandomString {

    constructor(status, msg){
        // super();
        this.status = status;
        this.message = msg;
    }

    static stringPassword(len){
        var password = " ";
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for( var i=0; i < len; i++ ){
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return new GenerateRandomString(200, password);
    }

}

export default GenerateRandomString;

