import { isAuthentication } from "../config/auth.js";
import { createTweet, deleteTweet, followingTweets, getAllTweet, likeOrDislike } from "../controllers/tweetController.js";
import express from 'express'

const router = express.Router()

router.route("/tweet").post(isAuthentication, createTweet)

router.route("/deleteTweet/:id").delete(isAuthentication, deleteTweet)

router.route("/likeOrDislike/:id").put(isAuthentication, likeOrDislike)

router.route("/getAllTweets/:id").get(isAuthentication, getAllTweet)

router.route("/followingtweets/:id").get(isAuthentication, followingTweets)

export default router