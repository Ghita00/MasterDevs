const common = require('../common')
const server = common.server;
const chai = common.chai;

const User = require('../../src/models/user');
const Group = require('../../src/models/group');

describe('/Post/api/users/id/groups', () => {
	it('it shoud add an authenticated user as member of a group given the correct parameters', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (error, group) => {
				const member = {
					group_id: group.group_id,
				};
				chai.request(server)
					.post(`/api/users/${user.user_id}/groups`)
					.set('Authorization', user.token)
					.send(member)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			})
		});
	});
});
describe('/Post/api/users/id/groups', () => {
	it('it shoud not add a user as member of a group given incorrect parameters', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (error, group) => {
				const member = {
					admin: true
				}
				chai.request(server)
					.post(`/api/users/${user.user_id}/groups`)
					.set('Authorization', user.token)
					.send(member)
					.end((err, res) => {
						res.should.have.status(400);
						done();
					});
			})
		});
	});
});
describe('/Post/api/users/id/groups', () => {
	it('it shoud not add a user as member of a group when user is not authenticated ', (done) => {
		User.findOne({ email: "test4@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (error, group) => {
				const member = {			
					group_id: group.group_id,
				}
				chai.request(server)
					.post(`/api/users/${user.user_id}/groups`)
					.send(member)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			})
		});
	});
});
describe('/Get/api/users/id/groups', () => {
	it('it should fetch a users joined groups when token user_id matches request user_id', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			chai.request(server)
				.get(`/api/users/${user.user_id}/groups`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(2)
					done();
				});
		})
	});
});
describe('/Get/api/users/id/groups', () =>  {
	it('it should not fetch a users joined groups when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			chai.request(server)
				.get(`/api/users/${users[0].user_id}/groups`)
				.set('Authorization', users[1].token)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		})
	});
});
describe('/Get/api/users/id/groups', () =>  {
	it('it should not fetch a users joined groups when user is authorized but hasnt joined any groups', (done) => {
		User.findOne({ email: "test4@email.com"}, (err, user) => {
			chai.request(server)
				.get(`/api/users/${user.user_id}/groups`)
				.set('Authorization', user.token)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		})
	});
});
describe('/Patch/api/users/id/groups', () => {
	it('it should patch a users membership when token user_id matches request user_id', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {			
				chai.request(server)
					.patch(`/api/users/${user.user_id}/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
		});
	});
});
describe('/Patch/api/users/id/groups', () => {
	it('it should not patch a users membership when token user_id doesnt match request user_id', (done) => {
		Group.findOne({ name: "Test Group Edit" }, (err, group) => {
			User.find({}, (err, users) => {
				chai.request(server)
					.patch(`/api/users/${users[0].user_id}/groups/${group.group_id}`)
					.set('Authorization', users[1].token)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
describe('/Delete/api/users/id/groups/groupId', () => {
	it('it should remove a user from a group when token user_id matches request user_id', (done) => {
		User.findOne({ email: "test3@email.com" }, (err, user) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.delete(`/api/users/${user.user_id}/groups/${group.group_id}`)
					.set('Authorization', user.token)
					.end((err, res) => {
						res.should.have.status(200)
						done()
					});
			});
		});
	});
});
describe('/Delete/api/users/id/groups/groupId', () => {
	it('it should not remove a user from a group when token user_id doesnt match request user_id', (done) => {
		User.find({}, (err, users) => {
			Group.findOne({ name: "Test Group Edit" }, (err, group) => {
				chai.request(server)
					.delete(`/api/users/${users[0].user_id}/groups/${group.group_id}`)
					.set('Authorization', users[1].token)
					.end((err, res) => {
						res.should.have.status(401)
						done()
					});
			});
		});
	});
});

