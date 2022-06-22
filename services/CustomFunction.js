
const CustomFunction  = {

    stringPassword(len){
        var gen_pass = "";
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for( var i=0; i < len; i++ ){
            gen_pass +=charset.charAt(Math.floor(Math.random()*charset.length));
        }
        return gen_pass;
    }

}

export default CustomFunction;

