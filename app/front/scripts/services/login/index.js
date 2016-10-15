'use strict';

var angular = require('angular');

angular.module('Application')
  .factory('LoginService', [
    'authenticate', 'authorize', '$window', '$q',
    function(authenticate, authorize, $window, $q) {
      var that = this;

      this.reset = function() {
        that.isLoggedIn = false;
        that.name = null;
        that.email = null;
        that.avatar = null;
        that.permissions = null;
        that.permissionToken = null;
      };
      this.reset();

      var token = null;
      var isInitialCheckDone = false;
      var attempting = false;
      var href = null;

      this.getToken = function() {
        return token;
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
            attempting = false;
            isInitialCheckDone = true;
            token = response.token;
            that.isLoggedIn = true;
            that.name = response.profile.name;
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
        attempting = true;
        authenticate.login(href, '_self');
      };

      this.logout = function() {
        if (that.isLoggedIn) {
          that.reset();
          authenticate.logout();
          if (href===null) {
             that.check();
          }
        }
      };

      return this;
    }
  ]);
