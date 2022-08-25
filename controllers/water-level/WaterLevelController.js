import { WaterLevel } from '../../models/index.js';
import CustomSuccessHandler from '../../services/CustomSuccessHandler.js';
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
import CustomFunction from '../../services/CustomFunction.js';
import multer from 'multer';
import path from 'path';
import Joi from 'joi';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'assets/images/water_level/uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        // console.log(req)
        cb(null, uniqueName);
    }
    
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 1 },
}).single('image'); // 1mb

const WaterLevelController = {

    async waterLevel(req, res, next){
        // console.log("Testing " + CustomFunction.currentTime() );
        console.log("request************** ")
        console.log(req);
        console.log("request body ######################################")
        console.log(req.body);
        // res.send(CustomSuccessHandler.success('Led status updated successfully'));


        

        // save image
        // handleMultipartData(req, res, async (err) => {
        //     // if (err) {
        //     //     return next(CustomErrorHandler.serverError(err.message));
        //     // }
        //     console.log(req)
        //     // console.log(req.file)
        //     const filePath = req.file.path;
        //     // console.log(filePath)
        //     //validation
        //     const waterLevelSchema = Joi.object({
        //         led_status:Joi.string().required()
        //     })
        //     const {error} = waterLevelSchema.validate(req.body);
        //     if (error) {
        //         //delete image

        //         fs.unlink(`${appRoot}/${filePath}`, (err) => {
        //             if (err) {
        //                 return next(
        //                     CustomErrorHandler.serverError(err.message)
        //                 );
        //             }
        //         });
        //         return next(error);
        //         // rootfolder/uploads/filename.png
        //     }

        //     const {led_status} = req.body;
    
        //     const water_level = new WaterLevel({
        //         led_status:led_status,
        //         image:filePath,
        //     });
        //     try {
        //         // const result = await water_level.save();
        //         // res.send(CustomSuccessHandler.success('Led status updated successfully' + req.body));
        //     } catch (err) {
        //         return next(err);
        //     }
            
        // });
        res.send(CustomSuccessHandler.success('Led status updated successfully'));
        
        // return res.json({status:200,message:"Led status updated successfully",  re_body:req.body, req_file:req.file});

    },

    async index(req, res, next){
        let documents;
        try {
            documents = await WaterLevel.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },
      
}

export default WaterLevelController;


// #include <WiFi.h>
// #include <HTTPClient.h>

// const char* ssid = "SDD1";
// const char* password = "wemakeitbetter@sdpl";

// //Your Domain name with URL path or IP address with path
// String serverName = "http://192.168.1.99:8000/api/water-level";

// // the following variables are unsigned longs because the time, measured in
// // milliseconds, will quickly become a bigger number than can be stored in an int.
// unsigned long lastTime = 0;
// // Timer set to 10 minutes (600000)
// //unsigned long timerDelay = 600000;
// // Set timer to 5 seconds (5000)
// unsigned long timerDelay = 5000;

// void setup() {
//   Serial.begin(115200); 

//   WiFi.begin(ssid, password);
//   Serial.println("Connecting");
//   while(WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     Serial.print(".");
//   }
//   Serial.println("");
//   Serial.print("Connected to WiFi network with IP Address: ");
//   Serial.println(WiFi.localIP());
 
//   Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
// }

// void loop() {
//   //Send an HTTP POST request every 10 minutes
//   if ((millis() - lastTime) > timerDelay) {
//     //Check WiFi connection status
//     if(WiFi.status()== WL_CONNECTED){
//       HTTPClient http;

//         led_status = 0;
//         String serverPath = serverName + "/" + led_status;
      
//       // Your Domain name with URL path or IP address with path
//       http.begin(serverPath.c_str());
      
//       // Send HTTP GET request
//       int httpResponseCode = http.GET();
      
//       if (httpResponseCode>0) {
//         Serial.print("HTTP Response code: ");
//         Serial.println(httpResponseCode);
//         String payload = http.getString();
//         Serial.println(payload);
//       }
//       else {
//         Serial.print("Error code: ");
//         Serial.println(httpResponseCode);
//       }
//       // Free resources
//       http.end();
//     }
//     else {
//       Serial.println("WiFi Disconnected");
//     }
//     lastTime = millis();
//   }
// }