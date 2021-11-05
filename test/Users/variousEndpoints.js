const common = require('../common')
const server = common.server
const chai = common.chai

const User = require('../../src/models/user')

describe('/Get/api/users/id/rating', function () {
  it('it should get a users rating by the given id when user is authenticated', function (done) {
    User.findOne({}, (err, user) => {
      chai
        .request(server)
        .get(`/api/users/${user.user_id}/rating`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('user_id').eql(user.user_id)
          res.body.should.have.property('rating')
          done()
        })
    })
  })
})
describe('/Get/api/users/id/rating', function () {
  it('it should not get a users rating by the given id when user is not authenticated', function (done) {
    User.findOne({}, (err, user) => {
      chai
        .request(server)
        .get(`/api/users/${user.user_id}/rating`)
        .set('Authorization', 'invalidtoken')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Patch/api/users/id/rating', function () {
  it('it should update a users rating by the given id when user is authenticated', function (done) {
    User.findOne({}, (err, user) => {
      const data = {
        rating: 5
      }
      chai
        .request(server)
        .patch(`/api/users/${user.user_id}/rating`)
        .send(data)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
describe('/Patch/api/users/id/rating', function () {
  it('it should update a users rating by the given id when user is not authenticated', function (done) {
    User.findOne({}, (err, user) => {
      const data = {
        rating: 5
      }
      chai
        .request(server)
        .patch(`/api/users/${user.user_id}/rating`)
        .send(data)
        .set('Authorization', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
describe('/Patch/api/users/id/rating', function () {
  it('it should not update a users rating by the given id when rating is not provided', function (done) {
    User.findOne({}, (err, user) => {
      const data = {
      }
      chai
        .request(server)
        .patch(`/api/users/${user.user_id}/rating`)
        .send(data)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  })
})
if (!process.env.CIRCLECI) {
  describe('/Post/api/users/id/walkthrough', function () {
    it('it should send a walkthrough of the platform to a user by a given id when he is authenticated', function (done) {
      User.findOne({}, (err, user) => {
        chai
          .request(server)
          .post(`/api/users/${user.user_id}/walkthrough`)
          .set('Authorization', user.token)
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
  describe('/Post/api/users/id/walkthrough', function () {
    it('it should not send a walkthrough of the platform to a user by a given id when he is not authenticated', function (done) {
      User.findOne({}, (err, user) => {
        chai
          .request(server)
          .post(`/api/users/${user.user_id}/walkthrough`)
          .set('Authorization', 'invalid token')
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
    })
  })
}
describe('/Get/api/users/userId/events', () => {
  it('it should not fetch a users events when he is attending none', (done) => {
    User.findOne({ email: 'test@email.com' }, (err, user) => {
      chai.request(server)
        .get(`/api/users/${user.user_id}/events`)
        .set('Authorization', user.token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array').with.lengthOf(1)
          done()
        })
    })
  })
})
