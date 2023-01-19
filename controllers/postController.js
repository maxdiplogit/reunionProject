// Packages
const moment = require('moment');

// Models
const User = require('../models/Users');
const Post = require('../models/Posts');


// Controllers
// ---------------------------------------------------------------------------------------------------------------------------------------

const createPost = async (req, res, next) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(401).json({ message: 'Title or Description are necessary for posting a post ...' });
    }

    const authenticatedUser = await User.findById(req.authenticatedUser._id);
    const newPost = new Post({ user: authenticatedUser, title, description });

    await newPost.save();

    const result = {
        postID: newPost._id,
        title: newPost.title,
        description: newPost.description,
        created_at: moment.utc(newPost.createdAt).format()
    };

    res.status(201).json({ post: result });
};

const deletePost = async (req, res, next) => {
    const { id } = req.params;

    const postToDelete = await Post.findById(id).exec();

    if (!postToDelete) {
        return res.status(401).json({ message: `Post with post_ID: ${ id } does not exist...` });
    }

    await Post.findByIdAndDelete(postToDelete._id);

    res.status(201).json({ message: `Deleted post with post_ID: ${ id }` });
};

const likePost = async (req, res, next) => {
    const { id } = req.params;

    const authenticatedUser = await User.findById(req.authenticatedUser._id).exec();
    const postToLike = await Post.findById(id).populate('likes').populate('comments').exec();

    if (!postToLike) {
        return res.status(404).json({ message: `Post with id: ${ id } does not exist...` });
    }

    // Check whether the authenticated user has already liked the post or not
    let alreadyLikes = false;
    for (let like of postToLike.likes) {
        if (like.username === authenticatedUser.username) {
            alreadyLikes = true;
            break;
        }
    }

    if (alreadyLikes) {
        return res.status(409).json({ message: `${ authenticatedUser.username } already liked the post with post_ID: ${ postToLike._id }` });
    }

    postToLike.likes.push(authenticatedUser);

    await postToLike.save();

    res.status(201).json({ messsage: `Post with id: ${ id } liked successfully by user: ${ authenticatedUser.username }` });
};

const unlikePost = async (req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = await User.findById(req.authenticatedUser._id).exec();
    const postToUnlike = await Post.findById(id).populate('likes').populate('comments').exec();

    if (!postToUnlike) {
        return res.status(404).json({ message: `Post with id: ${ id } does not exist...` });
    }

    // Check whether the authenticated user hasn't liked the post in the first place
    let alreadyLikes = false;
    for (let like of postToUnlike.likes) {
        if (like.username === authenticatedUser.username) {
            alreadyLikes = true;
            break;
        }
    }

    if (!alreadyLikes) {
        return res.status(409).json({ message: `${ authenticatedUser.username } hasn't liked the post with the post_ID: ${ postToUnlike._id } in the first place...` });
    }

    const newLikes = postToUnlike.likes.filter(userID => userID === authenticatedUser._id);

    postToUnlike.likes = newLikes;

    await postToUnlike.save();

    res.status(201).json({ message: `Post with id: ${ id } unliked successfully by user: ${ authenticatedUser.username }` });
};

const postComment = async (req, res, next) => {
    const { id } = req.params;
    const { text } = req.body;
    const authenticatedUser = await User.findById(req.authenticatedUser._id).exec();
    const postToCommentOn = await Post.findById(id).exec();

    if (!postToCommentOn) {
        return res.status(404).json({ message: `Post with id: ${ id } does not exist...` });
    }

    postToCommentOn.comments.push({ user: authenticatedUser, text });

    await postToCommentOn.save();

    res.status(201).json({ message: `${ authenticatedUser.username } commented successfully on the post with post_ID: ${ postToCommentOn._id }` });
};

const returnSinglePost = async (req, res, next) => {
    const { id } = req.params;

    const foundPost = await Post.findById(id).populate('likes').populate('comments').exec();

    if (!foundPost) {
        return res.status(404).json({ message: `Post with id: ${ id } does not exist...` });
    }

    console.log(foundPost);

    res.status(200).json({ post_ID: foundPost._id, numberOfLikes: foundPost.likes.length, numberOfComments: foundPost.comments.length });
};

const returnAllPosts = async (req, res, next) => {
    const authenticatedUserID = req.authenticatedUser._id;

    const posts = await Post.find({ user: authenticatedUserID }).populate('likes').populate('comments').exec();

    const result = [];

    for (let post of posts) {
        const temp = {
            postID: post._id,
            title: post.title,
            description: post.description,
            created_at: moment.utc(post.createdAt).format(),
            likes: post.likes.length,
            comments: post.comments
        };

        result.push(temp);
    }

    res.status(200).json({ posts: result });
};

// ---------------------------------------------------------------------------------------------------------------------------------------


module.exports = { createPost, deletePost, likePost, unlikePost, postComment, returnSinglePost, returnAllPosts };