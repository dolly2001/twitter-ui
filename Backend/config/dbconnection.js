import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config({
    path : "../config/env"
})


const dbConnection = () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => {
            console.log("DB Connected successfully");
        }
    )
    .catch((e) => {
        console.log(`ERROR --> ${e}`)
    })
}

export default dbConnection