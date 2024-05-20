import express from 'express'
import cookieParser from 'cookie-parser'
import userRoute from '../Backend/routes/userRoute.js'
import tweetRoute from '../Backend/routes/tweetRoute.js'
import dotenv from 'dotenv'
import dbConnection from './config/dbconnection.js'
dotenv.config({
    path:".env"
})
import cors from 'cors'

dbConnection()

const app = express()


// middlewares
app.use(express.urlencoded({
    extended:true
}));

app.use(express.json());

app.use(cookieParser());

const corsOptions = {
    origin : "http://localhost:3000",
    credentials : true 
}

app.use(cors(corsOptions))

// APIs
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);



app.listen(process.env.PORT, () => {
    console.log(`server is live now on port....${process.env.PORT}`);
})