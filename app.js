import express from 'express'
import {APP_URL, PORT, DATABASE_URL} from './config/index.js';
// import connectDB from "./db/connectDB.js";
import connectDB from "./config/connectDB.js";
import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import cors from 'cors'
const app = express()  
app.use(cors()) 
// const port = process.env.PORT || '8000'
// const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://rohitnamdeo:rohitnamdeo123@cluster0.vkr7r.mongodb.net/consoft";
const port = PORT;

// Database Connection
connectDB(DATABASE_URL);

// JSON  
app.use(express.json()) 

// Load Routes
app.use('/api', routes);


app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at ${APP_URL}`)
})  