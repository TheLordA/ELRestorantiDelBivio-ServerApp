const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../app');

chai.use(chaiHttp);


//Test Script for our Endpoints , Still on working to add all the routes

describe('/', () => {
    describe('/GET', () => {
        it('should return welcome message', (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Welcome To The ELRestorantDelBivio API');
                    res.body.should.have.property('success').eql(true);

                    done();

                });
        });
    });
});