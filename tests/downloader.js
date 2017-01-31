'use strict';

var nock = require('nock');
var assert = require('chai').assert;
var downloader = require('../app/front/scripts/services/downloader');

var
  testStrings = [
    'default page 1',
    'default page 2',
    'changed page 1'
  ];

describe('Downloader', function() {
  before(function(done) {
    nock('http://example.com/')
      .persist()
      .get('/page1')
      .reply(200, testStrings[0], {'access-control-allow-origin': '*'});

    nock('http://example.com/')
      .persist()
      .get('/page2')
      .reply(200, testStrings[1], {'access-control-allow-origin': '*'});

    done();
  });

  it('Should retrieve data', function(done) {
    downloader.get('http://example.com/page1')
      .then(function(text) {
        assert.equal(text, testStrings[0]);
        done();
      })
      .catch(done);
  });

  it('Should return data from cache', function(done) {
    downloader.get('http://example.com/page1')
      .then(function(text) {
        assert.equal(text, testStrings[0]);

        nock('http://example.com/')
          .persist()
          .get('/page1')
          .reply(200, testStrings[2], {'access-control-allow-origin': '*'});

        downloader.get('http://example.com/page1')
          .then(function(text) {
            assert.equal(text, testStrings[0]);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });

  it('Should retrieve another url', function(done) {
    downloader.get('http://example.com/page1')
      .then(function(text) {
        assert.equal(text, testStrings[0]);
        return downloader.get('http://example.com/page2');
      })
      .then(function(text) {
        assert.equal(text, testStrings[1]);
        done();
      })
      .catch(done);
  });
});
