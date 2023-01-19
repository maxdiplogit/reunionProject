// Packages
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/Users');


// Controllers
// ---------------------------------------------------------------------------------------------------------------------------------------

const authenticate = async (req, res, next) => {
    const { email, password } = req.body;
    
    console.log(email, password);

    // Check whether the entered credentials are true
    const foundUser = await User.findOne({ email: email, password: password }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: 'Incorrect Credentials' });
    }

    const username = foundUser.username;

    const jwt_AccessToken = jwt.sign({
        userInfo: {
            username
        }
    }, process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '600s' });

    res.status(201).json({ JWT_TOKEN: jwt_AccessToken });
};

const getUserDetails = async (req, res, next) => {
    const result = {
        username: req.authenticatedUser.username,
        followers: req.authenticatedUser.followers.length,
        following: req.authenticatedUser.following.length
    };

    res.status(200).json({ user: result });
};

const followUser = async (req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = await User.findById(req.authenticatedUser._id).populate('following').populate('followers').exec();
    const userToFollow = await User.findById(id).populate('following').populate('followers').exec();

    if (!userToFollow) {
        return res.status(404).json({ message: `User with id: ${ id } does not exist!` });
    }

    // Check if the authenticatedUser is already following the userToFollow
    let alreadyFollows = false;
    for (let following of authenticatedUser.following) {
        if (following.username === userToFollow.username) {
            alreadyFollows = true;
            break;
        }
    }

    if (alreadyFollows) {
        return res.status(409).json({ message: `${ authenticatedUser.username } already follows ${ userToFollow.username } ...` });
    }

    authenticatedUser.following.push(userToFollow);
    userToFollow.followers.push(authenticatedUser);

    await authenticatedUser.save();
    await userToFollow.save();

    res.status(201).json({ message: `${ authenticatedUser.username } follows ${ userToFollow.username }` });
};

const unfollowUser = async (req, res, next) => {
    const { id } = req.params;
    const authenticatedUser = await User.findById(req.authenticatedUser._id).populate('following').populate('followers').exec();
    const userToUnfollow = await User.findById(id).populate('following').populate('followers').exec();

    if (!userToUnfollow) {
        return res.status(404).json({ message: `User with id: ${ id } does not exist!` });
    }

    // Check if the authenticatedUser has already followed the userToUnfollow
    let alreadyFollows = false;
    for (let following of authenticatedUser.following) {
        if (following.username === userToUnfollow.username) {
            alreadyFollows = true;
            break;
        }
    }

    if (!alreadyFollows) {
        return res.status(409).json({ message: `${ authenticatedUser.username } does not follow ${ userToUnfollow.username } in the first place ...` });
    }

    const newFollowing = authenticatedUser.following.filter(f => f._id === userToUnfollow._id);
    const newFollowers = userToUnfollow.followers.filter(f => f._id === authenticatedUser._id);

    authenticatedUser.following = newFollowing;
    userToUnfollow.followers = newFollowers;

    await authenticatedUser.save();
    await userToUnfollow.save();

    res.status(201).json({ message: `${ authenticatedUser.username } unfollowed ${ userToUnfollow.username }` });
};

// ---------------------------------------------------------------------------------------------------------------------------------------


module.exports = { authenticate, getUserDetails, followUser, unfollowUser };