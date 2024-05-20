import express from 'express'
import { Register, Login, Logout, bookmarks, getProfile, otherProfile, follow, unfollow } from '../controllers/userController.js';
import { isAuthentication } from '../config/auth.js';

const router = express.Router();

router.route("/register").post(Register);

router.route("/login").post(Login);

router.route("/logout").get(Logout);

router.route("/bookmarks/:id").put(isAuthentication, bookmarks);

router.route("/profile/:id").get(isAuthentication, getProfile);

router.route("/otherprofile/:id").get(isAuthentication, otherProfile);

router.route("/follow/:id").post(isAuthentication, follow)

router.route("/unfollow/:id").post(isAuthentication, unfollow)

export default router;