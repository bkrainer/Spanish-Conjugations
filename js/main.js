var App = {
	/* data structure used to store and lookup verbs. Currently, just an array
	 * of verb objects. The verb attributes match the column headers in data/verbs.js
	 */
	verbs: null,

	/* The current verb being displayed */
	currentVerb: null,

	/* Function to be run on page load. Parses the verb data from the
	 * CSV and displays the first verb.
	 */
	initialize: function() {
		$.ajax({
			type: "GET",
			url: "data/verbs.csv",
			dataType: "text",
			success: function(data) {
				App.verbs = $.csv.toObjects(data);

				/* Randomly select the first verb to display */
				App.next();			
			},
			error: function(request, status, error) {
				alert("There was an issue loading the verb data");
			}
		});

		$("#button").click(App.next);
	},

	/* Selects the next verb (randomly) to display.
	 * Also sets the currentVerb parameter.
	 */
	getNextVerb: function() {
		var verb = _.sample(App.verbs);

		App.currentVerb = verb;

		return verb;
	},

	/* Takes in a verb object, and handles the logic for displaying this verb. */
	displayVerb: function(verb) {
		$("#infinitive-form").text(verb.infinitive);
		$("#definition").text(verb.infinitive_english);
	},

	/* Handles the clicking of the 'Next' button. Calls getNextVerb and displayVerb. */
	next: function() {
		var nextVerb = App.getNextVerb();
		App.displayVerb(nextVerb);
	}
}

$(document).ready(App.initialize);
