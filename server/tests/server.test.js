const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Project} = require('./../models/project.js');
const {User} = require('./../models/user.js');
const {ObjectID} = require('mongodb');


describe('POST /projects', () => {
  it('should create a new todo and delete it on time', (done) => {
    var body = {
      title: 'Circuit Project',
      description: 'A project dedicated to making extreme complex circuits.',
      postDuration: 10000
    }

    request(app)
      .post('/projects')
      .send(body)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Project.find({body}).then((doc) => {
          expect(doc).toBeTruthy();
          setTimeout(function () {
            Project.find({body}).then((doc) => {
              expect(doc).toBeFalsy();
              done()
            }).catch((e) => done(e))
          }, 2000)
        }).catch((e) => done(e))
      })
  })
})
