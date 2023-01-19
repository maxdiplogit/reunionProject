const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();


// Models
const User = require('../models/Users');


chai.use(chaiHttp);


let jwt_token = '';

const findUser = async () => {
    return await User.findOne({ username: 'user1' });
}
let foundUser = findUser;


describe('/POST /api/authenticate', () => {
    it('it should return a JWT_TOKEN', function (done) {
        chai.request(server)
            .post('/api/authenticate')
            .send({ email: 'user1@gmail.com', password: 'user1password' })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('JWT_TOKEN');
                jwt_token = res.body.JWT_TOKEN;
                done();
            });
    });
});

describe('/POST /api/posts', () => {
    it('it should return a successful response with a json body', function (done) {
        chai.request(server)
            .post('/api/posts')
            .set('Authorization', `Bearer ${ jwt_token }`)
            .send({ user: foundUser, title: 'some post by user1', description: 'Hello hello hello!' })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('post');
                done();
            });
    });
});

describe('/GET /api/all_posts', () => {
    it('it should return all the posts under the test user', function (done) {
        chai.request(server)
            .get('/api/all_posts')
            .set('Authorization', `Bearer ${ jwt_token }`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('posts');
                done();
            });
    });
});

describe('/POST /api/posts: with title missing', () => {
    it('it should return a response with a status code of 401 and a message in json format', function (done) {
        chai.request(server)
            .post('/api/posts')
            .set('Authorization', `Bearer ${ jwt_token }`)
            .send({ user: foundUser, description: 'lololol' })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message');
                done();
            });
    });
});