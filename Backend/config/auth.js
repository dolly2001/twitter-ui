import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config({
    path : '../env'
})

export const isAuthentication = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        const {name} = req.params

        console.log(token);

        if (!token) {
            return res.status(401).json({
                message : `${name}, you are not authenticated...`,
                success : false
            })
        }

        const deCode = jwt.verify(token, process.env.SECRETE_TOKEN)
        console.log(deCode);
        req.user = deCode._id
        next();

    } catch (error) {
        console.log("Error --> ", error);
    }
}
