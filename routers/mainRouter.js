const express = require('express');

// Router
const router = express.Router();

// Controllers
const { authenticate, getUserDetails, followUser, unfollowUser } = require('../controllers/userController');
const { createPost, deletePost, likePost, unlikePost, postComment, returnSinglePost, returnAllPosts } = require('../controllers/postController');

// Utilities
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Middlewares
const verifyJWT = require('../middlewares/verifyJWT');


// API Routes
// --------------------------------------------------------------------------------------------------------------------------------------------

router.route('/authenticate')
    .post(authenticate);         // User Authentication

router.route('/user')
    .get(verifyJWT, getUserDetails);        // Authenticating and returning the respective user profile

router.route('/follow/:id')
    .post(verifyJWT, followUser);           // Authenticating and following a user

router.route('/unfollow/:id')
    .post(verifyJWT, unfollowUser);         // Authenticating and unfollowing a user

router.route('/posts')
    .post(verifyJWT, createPost);           // Authenticating and creating a post

router.route('/posts/:id')
    .get(verifyJWT, returnSinglePost)       // Authenticating and returning a single post with its number of likes and comments
    .delete(verifyJWT, deletePost);         // Authenticating and deleting a post

router.route('/like/:id')
    .post(verifyJWT, likePost);             // Authenticating and liking a post

router.route('/unlike/:id')
    .post(verifyJWT, unlikePost);           // Authenticating and unliking a post

router.route('/comment/:id')
    .post(verifyJWT, postComment);          // Authenticating and commenting on a post

router.route('/all_posts')
    .get(verifyJWT, returnAllPosts);        // Authenticating and returning all posts made by the authenticated user

// --------------------------------------------------------------------------------------------------------------------------------------------


module.exports = router;