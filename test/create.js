var log = require('logger')('service-pages:test:create');
var errors = require('errors');
var _ = require('lodash');
var should = require('should');
var request = require('request');
var pot = require('pot');

describe('POST /pages', function () {
    var client;
    before(function (done) {
        pot.client(function (err, c) {
            if (err) {
                return done(err);
            }
            client = c;
            done();
        });
    });

    var data = {
        title: 'Title',
        body: 'This is a sample post'
    };

    it('with no media type', function (done) {
        request({
            uri: pot.resolve('accounts', '/apis/v/pages'),
            method: 'POST',
            auth: {
                bearer: client.users[0].token
            }
        }, function (e, r, b) {
            if (e) {
                return done(e);
            }
            r.statusCode.should.equal(errors.unsupportedMedia().status);
            should.exist(b);
            b = JSON.parse(b);
            should.exist(b.code);
            should.exist(b.message);
            b.code.should.equal(errors.unsupportedMedia().data.code);
            done();
        });
    });

    it('with unsupported media type', function (done) {
        request({
            uri: pot.resolve('accounts', '/apis/v/pages'),
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml'
            },
            auth: {
                bearer: client.users[0].token
            }
        }, function (e, r, b) {
            if (e) {
                return done(e);
            }
            r.statusCode.should.equal(errors.unsupportedMedia().status);
            should.exist(b);
            b = JSON.parse(b);
            should.exist(b.code);
            should.exist(b.message);
            b.code.should.equal(errors.unsupportedMedia().data.code);
            done();
        });
    });

    it('without title', function (done) {
      request({
        uri: pot.resolve('accounts', '/apis/v/pages'),
        method: 'POST',
        json: {
          body: 'This is a sample page'
        },
        auth: {
          bearer: client.users[0].token
        }
      }, function (e, r, b) {
        if (e) {
          return done(e);
        }
        r.statusCode.should.equal(errors.unprocessableEntity().status);
        should.exist(b);
        should.exist(b.code);
        should.exist(b.message);
        b.code.should.equal(errors.unprocessableEntity().data.code);
        done();
      });
    });

    it('without body', function (done) {
      request({
        uri: pot.resolve('accounts', '/apis/v/pages'),
        method: 'POST',
        json: {
          title: 'Title'
        },
        auth: {
          bearer: client.users[0].token
        }
      }, function (e, r, b) {
        if (e) {
          return done(e);
        }
        r.statusCode.should.equal(errors.unprocessableEntity().status);
        should.exist(b);
        should.exist(b.code);
        should.exist(b.message);
        b.code.should.equal(errors.unprocessableEntity().data.code);
        done();
      });
    });

    var bigger = '';
    var i;
    for (i = 0; i < 10001; i++) {
        bigger += 'x';
    }

    it('with bigger body', function (done) {
      request({
        uri: pot.resolve('accounts', '/apis/v/pages'),
        method: 'POST',
        json: {
          title: 'Title',
          body: bigger
        },
        auth: {
          bearer: client.users[0].token
        }
      }, function (e, r, b) {
        if (e) {
          return done(e);
        }
        r.statusCode.should.equal(errors.unprocessableEntity().status);
        should.exist(b);
        should.exist(b.code);
        should.exist(b.message);
        b.code.should.equal(errors.unprocessableEntity().data.code);
        done();
      });
    });

    it('valid', function (done) {
        request({
            uri: pot.resolve('accounts', '/apis/v/pages'),
            method: 'POST',
            json: data,
            auth: {
                bearer: client.users[0].token
            }
        }, function (e, r, b) {
            if (e) {
                return done(e);
            }
            r.statusCode.should.equal(201);
            should.exist(b);
            should.exist(b.title);
            b.title.should.equal(data.title);
            should.exist(b.body);
            b.body.should.equal(data.body);
            should.exist(r.headers['location']);
            r.headers['location'].should.equal(pot.resolve('accounts', '/apis/v/pages/' + b.id));
            done();
        });
    });
});
