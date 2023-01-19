// Models
const User = require('./Users');


const mongoose = require('mongoose');


const { Schema } = mongoose;


const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


const Post = mongoose.model('Post', PostSchema);


module.exports = Post;