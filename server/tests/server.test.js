const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create a todo with invalid body data', (done) => {

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=> {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non ObjectID', (done) => {
    request(app)
    .get(`/todos/123`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

});

describe('Delete /todos/:id', () => {
  it('Should delete todo doc', (done)=> {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[1].text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      }).catch(e => done(e));
    });
  });

  it('Should not delete todo doc if other user', (done)=> {
    var hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeTruthy();
        done();
      }).catch(e => done(e));
    });
  });


  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non ObjectID', (done) => {
    request(app)
    .delete(`/todos/123`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

});


describe('Patch /todos/:id', () => {
  it('Should update the todo', (done)=> {
    var hexId = todos[0]._id.toHexString();

    var todo = {
      text: 'updated text1',
      completed: true,
    };

    request(app)
    .patch(`/todos/${hexId}`)
    .send(todo)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todo.text);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done);
  });

  it('Try to update first todo as second user', (done)=> {
    var hexId = todos[0]._id.toHexString();

    var todo = {
      text: 'updated text1',
      completed: true,
    };

    request(app)
    .patch(`/todos/${hexId}`)
    .send(todo)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should clear completedAt when todo  is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();

    var todo = {
      text: todos[1].text,
      completed: false,
    };

    request(app)
    .patch(`/todos/${hexId}`)
    .send(todo)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todo.text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done);
  });

});

describe('GET /users/me', (done) => {

  it('should return user if authenticated', (done) => {
    request(app)
    .get(`/users/me`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 id not authenticated', (done) => {
    request(app)
    .get(`/users/me`)
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', (done) => {
  it('should create user', (done) => {
    var email = 'example@example.com';
    var password = '123abc';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err) {
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      }).catch(done);
    });
  });

  it('should return validation errors if request failed', (done) => {
    var email = 'examplesdasd@';
    var password = 'abc123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = 'abc123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', (done) => {

  it('should login user and return auth token', (done) => {
    var email = users[1].email;
    var password = users[1].password;

    request(app)
    .post('/users/login')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(users[1].email);
      expect(res.body._id).toBeTruthy();
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id)
      .then((user) => {
        expect(user.tokens[1]).toMatchObject({
          access:'auth',
          token: res.headers['x-auth']
        });
        done();
      })
      .catch(done);
    });
  });

  it('should reject invalid login', (done) => {

    var email = users[1].email;
    var password = '1234';

    request(app)
    .post('/users/login')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.body).toEqual({message: "Invalid password"});
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((err) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user)=> {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch(done);
    });
  });

});


describe('DELETE /users/me/token', (done) => {
  it('should remove auth token from logout', (done) => {

    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err) => {
      if (err) {
        return done(err);
      }

      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      })
      .catch(done);
    });
  })
});
