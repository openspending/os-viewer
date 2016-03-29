var nock = require('nock');
var assert = require('chai').assert;
var _ = require('lodash');

describe('Downloader', function() {
  var downloader = require('../app/front/scripts/components/downloader/');

  before(function(done) {
    nock('http://site.com/')
      .persist()
      .get('/some.page')
      .reply(200, 'test string', {'access-control-allow-origin': '*'});

    nock('http://site.com/')
      .persist()
      .get('/some.page2')
      .reply(200, 'test string2', {'access-control-allow-origin': '*'});

    done();
  });

  it('Should exists', function(done) {
    assert.isObject(downloader);
    assert.isFunction(downloader.get);
    done();
  });

  it('Should download a page', function(done) {
    downloader.get('http://site.com/some.page').then(function(text) {
      assert.equal(text, 'test string');
      done();
    });
  });

  it('Should cache a page', function(done) {
    downloader.get('http://site.com/some.page').then(function(text) {
      assert.equal(text, 'test string');

      nock('http://site.com/')
        .persist()
        .get('/some.page')
        .reply(200, 'other test string', {'access-control-allow-origin': '*'});

      downloader.get('http://site.com/some.page').then(function(text) {
        assert.equal(text, 'test string');
        done();
      });
    });
  });

  it('Should download different pages', function(done) {
    downloader.get('http://site.com/some.page').then(function(text) {
      assert.equal(text, 'test string');

      downloader.get('http://site.com/some.page2').then(function(text) {
        assert.equal(text, 'test string2');
        done();
      });
    });
  });

});
