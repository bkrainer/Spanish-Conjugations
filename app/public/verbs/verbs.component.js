'use strict';

angular.
	module('verbs').
	component('verbs', {
		templateUrl: 'verbs/verbs.template.html',
		controller: ['Verbs',
			function VerbsController(Verbs) {
				var self = this;

				/* Verbs.query() fetches the JSON data from the node.js server.
				 * Fetch the verbs, then initialize the verb shown to the user.
				 * Also initialize the hash of user responses to null.
				 */
				Verbs.query().$promise.then(function(data) {
					self.verbs = data;
					self.responses = {};
					self.getNextVerb();
				});

				/* map the format of the dataset to the appropriate pronoun to be displayed */
				self.pronounMap = {
					form_1s: "yo",
					form_2s: "tu",
					form_3s: "el, ella, ud.",
					form_1p: "nosotros",
					/* Remove vosotros for now */
					//form_2p: "vosotros",
					form_3p: "ellos, ellas, uds.",
					gerund: "gerund",
					pastparticiple: "past part."
				};

				/* hash mapping accented letters to their ascii counterparts */
				self.accentMap = {
					"á": "a",
					"é": "e",
					"í": "i",
					"ó": "o",
					"ü": "u",
					"ú": "u",
					"ñ": "n"
				};

				self._replaceAccents = function(s) {
					var replaced = s.replace(/[^A-Za-z\s]/g, function(c) {
						return self.accentMap[c] || c;
					});

					return replaced;
				};

				/* helper function to randomly select the next verb to conjugate */
				self.getNextVerb = function() {
					self.verb = _.sample(self.verbs);

					/* when setting the next verb, clear the responses hash. otherwise,
					 * the input boxes will still be filled because of angular's
					 * two-way data-binding.
					 */
					self.responses = {};
				};

				/* validation of the users response for a given verb form.
				 * validation occurs on blur for the text input.
				 */
				self.validate = function(form) {
					/* if the user's response is blank, then we don't want to show
					 * either the valid or invalid class
					 */
					if (!self.responses || !self.responses[form]) return false;

					var actual = self.responses[form].toLowerCase();
					var expected = self.verb[form];

					expected = self._replaceAccents(expected);
					actual = self._replaceAccents(actual);

					return expected == actual;
				};

				/* either shows or hides the correct answer for a given row,
				 * depending on the current state of the user input.
				 */
				self.toggleAnswer = function(form) {
					if (!self.responses || (self.responses[form] != self.verb[form])) {
						self.responses[form] = self.verb[form];
					}
					else {
						self.responses[form] = null;
					}
				};
			}
		]
	});
