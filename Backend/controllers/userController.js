import { User } from "../models/userSchema.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register Controller / API----------------------------------------------------------

export const Register = async(req, res) => {
    try {
        const {name, username, email, password} = req.body;
        // Basic Validation or getting data from body(frontend)
        if(!name || !username || !email || !password ){
            return res.status(400).json({
                message:"All fields are required",
                success:false          
            })
        }

        // checking if user is already exist or not
        const user = await User.findOne({email})
            if(user){
                return res.status(400).json({
                    message : "User already exist...",
                    success:false
                })
            }

        // Hashing password
        const hashPassword = await bcryptjs.hash(password, 12)

        // Creat account
        await User.create({
            name,
            username,
            email,
            password : hashPassword
        })

        return res.status(201).json({
            message : "Account Created Successfully",
            success : true
        })
        
    } catch (error) {
        console.log(error);
    }
}

// Login Controller / API------------------------------------------------------------------------

export const Login = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(404).json({
                message : "Fill out all required fields",
                success : false
            })
        }

        const user = await User.findOne({email})

        if(!user){
           return res.status(404).json({
                message : "User not exists",
                success : false
            })
        }

        const isPassMatch = await bcryptjs.compare(password, user.password)

        if (!isPassMatch) {
            return res.status(401).json({
                message : "Incorrect Email or Password",
                success : false
            })
        }

        const tokenData = {
            userID : user._id
        }

        const token = jwt.sign({tokenData}, process.env.SECRETE_TOKEN, {expiresIn : "1d"})

        return res.status(201).cookie("token", token, {expiresIn : "1d", httpOnly : true}).json({
            message : `Welcome Back ${user.name}`,
            user,
            success : true
        })

    } catch (error) {
        console.log("Error --> ", error);
    }
}

// Logout Controller / API----------------------------------------------------------------------

export const Logout = async (req, res) => {
    try {
        return res.cookie("token", "", {expiresIn : new Date(Date.now())}).json({
            message : "Logout Successfully",
            success : true
        })
    } catch (error) {
        console.log("Beta Error Aaaya h dhek Error dhek", error)
    }
}


// Bookmark Controller / API ----------------------------------------------------------------

export const bookmarks = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId)

        if (user.bookmarks.includes(tweetId)) {
            
            await User.findByIdAndUpdate(loggedInUserId, {$pull: {bookmarks : tweetId}})
            return res.status(200).json({
                message : "Bookmark Deleted",
                success : true
            })
        }else{
            await User.findByIdAndUpdate(loggedInUserId, {$push : {bookmarks : tweetId}})
            return res.status(200).json({
                message : "Bookmark Added",
                success : true
            })
        }

    } catch (error) {
        console.log("Error", error);
    }
}

// Profile Controller / API ------------------------------------------------------------------

export const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select('-password -_id')
        return res.status(200).json({
            message : `Welcome to your profile ${user.name}`,
            user,
            success : true
        })
       
    } catch (error) {
        console.log("Error --->", error);
    }
}

// other users Profile

export const otherProfile = async (req, res) => {
    try {
        const {id} = req.params.id;
        const otherUsers = User.find({_id : {$ne : id}}).select('-password')
        if(!otherUsers){
            return res.status(401).json({
                message : "don't have many users"
            })
        }else{
            return res.status(401).json({
                otherUsers
            })
        }
    } catch (error) {
        console.log("Error-->",error)
    }
}


// Follow Controller / API ----------------------------------------------------------------

export const follow = async (req, res)=> {
    try {
        const loggedInUserId = req.body.id;
        const followUser = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(followUser)

        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({$push : {followers : loggedInUserId}})
            await loggedInUser.updateOne({$push : {following : followUser}})
        }else{
            return res.status(400).json({
                message : "User already follows you"
            })
        }

        return res.status(200).json({
            message : `${loggedInUser.name} just started following to ${user.name}`,
            success : true
        })
        
    } catch (error) {
        console.log("Error ---> ",error)
    }
}


// Unfollow Controller / API --------------------------------------------------------------

export const unfollow = async (req, res)=> {
    try {
        const loggedInUserId = req.body.id;
        const followUser = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(followUser)

        if (user.following.includes(followUser)) {
            await user.updateOne({$pull : {followers : loggedInUserId}})
            await loggedInUser.updateOne({$pull : {following : followUser}})
        }else{
            return res.status(400).json({
                message : "you are not following"
            })
        }

        return res.status(200).json({
            message : `${loggedInUser.name} just unfollow to ${user.name}`,
            success : true
        })
        
    } catch (error) {
        console.log("Error ---> ",error)
    }
}

