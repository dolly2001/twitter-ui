import { Tweet } from "../models/tweetSchema.js";

const createTweet = async (req, res) => {
    try {
        
        const {description, id} = req.body;

        if (!description || !id) {
            return res.status(401).json({
                message : "Write something..",
                success : false
            })
        }

        await Tweet.create({
            description,
            userId : id
        })
        return res.status(200).json({
            message : "Tweet Created Successfully !!!",
            success : true
        })

    } catch (error) {
        console.log(error);
    }
}


const deleteTweet = async (req, res) => {
    try {
        const {id} = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message : "Tweet Deleted Successfully",
            success : true
        })
    } catch (error) {
        console.log(error);
    }
}

const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId)

        if (tweet.like.includes(loggedInUserId)) {
            await Tweet.findByIdAndUpdate(tweetId, {$pull:{like:loggedInUserId}})
            return res.status(200).json({
                message : "reader dislike your tweet"
            })
        }else{
            await Tweet.findByIdAndUpdate(tweetId, {$push : {like:loggedInUserId}})
            return res.status(200).json({
                message : "reader Liked your tweet"
            })
        }

    } catch (error) {
        console.log(error)
    }
}

const getAllTweet = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById({id});
        const loggedInUserTweets = await Tweet.find({userId : id})

        const followingUserTweets = await Promise.all(loggedInUser.following.map((otherUsersId) => {
            return Tweet.find({userId : otherUsersId})
        }))
        return res.status(200).json({
            tweet:loggedInUserTweets.concat(...followingUserTweets)
        })
    } catch (error) {
        console.log(error);
    }
}

const followingTweets = async (req, res) => {
        try {
            const id = req.params.id;
            const loggedInUser = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
                return Tweet.find({userId : otherUsersId})
            }))
            return res.status(200).json({
                tweet:[].concat(...followingUserTweets)
            })
        } catch (error) {
            console.log(error);
        }
}


export {createTweet, deleteTweet, likeOrDislike, getAllTweet, followingTweets }