var App = {
	/* data structure used to store and lookup verbs. Currently, just an array
	 * of verb objects. The verb attributes match the column headers in data/verbs.js
	 */
	verbs: null,

	/* The current verb being displayed */
	currentVerb: null,

	/* map the format of the dataset to the appropriate pronoun */
	pronounMap: {
		form_1s: "yo",
		form_2s: "tu",
		form_3s: "el/ella/usted",
		form_1p: "nosotros",
		form_2p: "vosotros",
		form_3p: "ellos/ellas/ustedes",
		gerund: "gerund",
		pastparticiple: "past participle"
	},
	
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

	/* Takes in a verb object, and handles the logic for displaying this verb.
	 * This includes displaying the infinitive form of the verb, along with its
	 * english definition. This is followed by a table of the verb's pronouns
	 * paired with the appropriate conjugations.
	 */
	displayVerb: function(verb) {
		$("#infinitive-form").text(verb.infinitive);
		$("#definition").text(verb.infinitive_english);

		/* We want to display the mood and the tense that we are currently showing */
		$('#table-header').text(verb.mood_english + ' ' + verb.tense_english);

		/* Clear the current verb table so we don't keep appending information each time
		 * a new verb is loaded
		 */
		$('#verb-table-body').empty();

		/* Iterate through the list of pronouns/alternate verb forms,
		 * and create a table row. Then append this row to the verb table
		 */
		_.each(_.keys(App.pronounMap), function(key) {
			var $row = $('<tr></tr>');
			$row.append('<td>' + App.pronounMap[key] + '</td>');
			
			var answer = '"' + verb[key] + '"';
			var input = '<input type="text" class="form-control verb-input" placeholder=' + answer + '>';
			$row.append('<td>' + input + '</td>');
			$("#verb-table-body").append($row);
		});
	},

	/* Handles the clicking of the 'Next' button. Calls getNextVerb and displayVerb. */
	next: function() {
		var nextVerb = App.getNextVerb();
		App.displayVerb(nextVerb);
	}
}

$(document).ready(App.initialize);
