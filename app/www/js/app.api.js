function make_resource(path, params, isArray) {
  return function($resource, AuthService, API_URL) {
    var headers = {
      'Authorization': function(){return 'JWT ' + AuthService.get();}
    };
    return $resource(API_URL + path, params, {
      query: {
        method: 'GET',
        isArray: isArray || false,
        headers: headers
      },
      get: {
        method: 'GET',
        headers: headers
      },
      save: {
        method: 'POST',
        headers: headers
      },
      remove: {
        method: 'DELETE',
        headers: headers
      },
      delete: {
        method: 'DELETE',
        headers: headers
      },
      update: {
        method: 'PUT',
        headers: headers
      }
    });
  }
}

angular.module('bookmarker.api', ['ngResource'])

.factory('Authentication', [
  '$http', '$state', 'AuthService',
  function($http, $state, AuthService) {
    function login(username, password, successAction, errorAction) {
      return $http.post(AuthService.getTokenAuthUrl(), {
        username: username,
        password: password
      }).then(loginSuccessFn, loginErrorFn);

      function loginSuccessFn(response, status, headers, config) {
        successAction(response, status, headers, config);
      }

      function loginErrorFn(response, status, headers, config) {
        errorAction(response, status, headers, config);
        // console.log(response.data);
      };
    }

    function logout() {
      AuthService.remove();
    }

    return {
      login: login,
      logout: logout,
    };
  }
])

.factory('User',
  make_resource('/users/:id/', {id: '@id'})
)

.factory('Favorite',
  make_resource('/favorites/:id/', {id: '@id'}, true)
)

.factory('Entry',
  make_resource('/entries/:id/', {id: '@id'}, true)
)

.factory('Tag',
  make_resource('/tags/:id/', {id: '@id'})
)

.factory('TagRelations',
  make_resource('/tagrelations/:id/', {id: '@id'})
)

.factory('Setting',
  make_resource('/settings/:id/', {id: '@id'})
)

.factory('UserEntry',
  make_resource('/users/:id/entries/', {id: '@id'}, true)
)

.factory('UserFavorite',
  make_resource('/users/:id/favorites/', {id: '@id'}, true)
)

.factory('EntryTag',
  make_resource('/entries/:id/tags/', {id: '@id'}, true)
)

;
