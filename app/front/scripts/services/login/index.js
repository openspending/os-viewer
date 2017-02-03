'use strict';

var ngModule = require('../../module');

ngModule.factory('LoginService', [
  'authenticate', 'authorize', '$window', '$q',
  function(authenticate, authorize, $window, $q) {
    var that = this;

    this.reset = function() {
      that.isLoggedIn = false;
      that.name = null;
      that.email = null;
      that.avatar = null;
      that.userid = null;
      that.permissions = null;
      that.permissionToken = null;
    };
    this.reset();

    var token = null;
    var isInitialCheckDone = false;
    var href = null;

    this.getToken = function() {
      return token;
    };

    this.getUserId = function() {
      return this.userid;
    };

    this.tryGetToken = function() {
      return $q(function(resolve) {
        var check = function() {
          if (isInitialCheckDone) {
            var token = that.getToken();
            token ? resolve(token) : resolve(null);
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });
    };

    this.check = function() {
      var next = $window.location.href;
      authenticate.check(next)
        .then(function(response) {
          isInitialCheckDone = true;
          token = response.token;
          that.isLoggedIn = true;
          that.name = response.profile.name;
          that.userid = response.profile.idhash;
          that.email = response.profile.email;
          // jscs:disable
          that.avatar = response.profile.avatar_url;
          // jscs:enable

          authorize.check(token, 'os.datastore')
            .then(function(permissionData) {
              that.permissionToken = permissionData.token;
              that.permissions = permissionData.permissions;
            });
        })
        .catch(function(providers) {
          isInitialCheckDone = true;
          href = providers.google.url;
        });
    };
    this.check();

    this.login = function() {
      if (that.isLoggedIn || (href === null)) {
        return true;
      }
      authenticate.login(href, '_self');
    };

    this.logout = function() {
      if (that.isLoggedIn) {
        that.reset();
        authenticate.logout();
        if (href === null) {
          that.check();
        }
      }
    };

    return this;
  }
]);
