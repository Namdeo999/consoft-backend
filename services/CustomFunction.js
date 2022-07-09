import date from 'date-and-time';


const CustomFunction  = {

    currentDate(){
        const now = new Date('07/07/2022');
        const current_date = date.format(now, 'YYYY/MM/DD') // => '2015/01/02 23:14:05'
        return now;
    },

    currentTime(){
        const now = new Date();
        const current_time = date.format(now, 'hh:mm A'); // => '11:14 PM
        return current_time;
    },

    dateFormat(value){
        const pattern = date.compile('YYYY/MM/DD');
        const formated_date = date.format(new Date(value), pattern);

        return formated_date;
    },

    timeFormat(value){
        const pattern = date.compile('HH:MM');
        const formated_time = date.format(new Date(value), pattern);

        return formated_time;
    },

    stringPassword(len){
        var gen_pass = "";
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for( var i=0; i < len; i++ ){
            gen_pass +=charset.charAt(Math.floor(Math.random()*charset.length));
        }
        return gen_pass;
    },

    randomNumber() {
        var minm = 100000;
        var maxm = 999999;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }

}

export default CustomFunction;

