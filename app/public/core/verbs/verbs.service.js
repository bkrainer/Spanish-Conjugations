'use strict';

angular.
	module('core.verbs').
	factory('Verbs', ['$resource',
		function($resource) {
			return $resource('/verbs', {}, {
				query: {
					method: 'GET',
					params: {},
					isArray: true
				}
			});
		}
	]);
