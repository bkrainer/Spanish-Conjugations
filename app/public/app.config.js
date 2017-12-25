'use strict';

angular.
	module('spanishConjugationApp').
	config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider) {
			$routeProvider.
				when('/verbs', {
					template: '<verbs></verbs>'
				}).
				otherwise('/verbs');
		}
	]);
