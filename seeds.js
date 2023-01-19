const mongoose = require('mongoose');


// Models
const User = require('../models/Users');
const Post = require('../models/Posts');


mongoose.connect('mongodb://122.173.31.147:27017/reunion', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Local Mongoose connection open!');
    })
    .catch((err) => {
        console.log('Oh no! Mongoose Connection Error!');
        console.log(err);
    });


const seedDB = async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    let user1 = new User({ username: 'user1', email: 'user1@gmail.com', password: 'user1password' });
    let user2 = new User({ username: 'user2', email: 'user2@gmail.com', password: 'user2password' });
    let user3 = new User({ username: 'user3', email: 'user3@gmail.com', password: 'user3password' });

    user1.following.push(user2);
    user2.followers.push(user1);

    user3.following.push(user1);
    user1.followers.push(user3);

    await user1.save();
    await user2.save();
    await user3.save();

    let post1 = new Post({ user: user1, title: 'hello world', description: 'first post by user1' });
    let post2 = new Post({ user: user3, title: 'lala', description: 'a post by user3' });

    post1.likes.push(user1);
    post1.likes.push(user2);

    post2.likes.push(user3);
    post2.comments.push({ user: user2, text: 'I donot like this post :D' });

    await post1.save();
    await post2.save();
};


seedDB()
    .then(() => {
        mongoose.connection.close();
    });