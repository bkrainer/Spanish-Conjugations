/* Class for representing the current verb being displayed.
 * Stores the verb tenses, and handles conjugation validation
 */
function Verb(verbData) {
	this.forms = verbData;
	this.validateConjugation = function(form, input) {
		var correct = this.forms[form];

		/* Allow some flexibility with the user's responses */

		/* ignore leading/trailing whitespace from input */
		var check = input.trim();

		/* ignore casing */
		check = check.toLowerCase();

		/* ignore accents */
		check = this._replaceAccent(check);
		correct = this._replaceAccent(correct);

		return correct == check;
	};

	/* Hash mapping accented chars to their unaccented counterparts.
	 * Used to make input validation more lenient
	 */
	this._accentMap = {
		"á":"a",
		"é": "e",
		"í": "i",
		"ó": "o",
		"ú": "u",
		"ü": "u",
		"ñ": "n"
	},

	/* Given a string s, replaces any accented chars with it's ascii
	 * couterpart (using this._accentMap, defined above)
	 */
	this._replaceAccent = function(s) {
		var map = this._accentMap;
		var replaced = s.replace(/[^A-Za-z\s]/g, function(c) {
			return map[c] || c;
		});

		return replaced;
	}
};


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
		/* Remove vosotros for now, but will add option in the future that
		 * let's the user specify settings */
		//form_2p: "vosotros",
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
			url: "/verbs",
			dataType: "json",
			success: function(data) {
				App.verbs = data;

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
		var verbData = _.sample(App.verbs);

		App.currentVerb = new Verb(verbData);

		return App.currentVerb;
	},

	/* Takes in a verb object, and handles the logic for displaying this verb.
	 * This includes displaying the infinitive form of the verb, along with its
	 * english definition. This is followed by a table of the verb's pronouns
	 * paired with the appropriate conjugations.
	 */
	displayVerb: function(verb) {
		var forms = verb.forms;
		$("#infinitive-form").text(forms.infinitive);
		$("#definition").text(forms.infinitive_english);

		/* We want to display the mood and the tense that we are currently showing */
		$('#table-header').text(forms.mood_english + ' ' + forms.tense_english);

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
			
			var $input = $('<input type="text" class="form-control verb-input">');
			$input.data('form', key);

			var $td = $('<td></td>').append($input);
			$row.append($td);

			var $checkbox = $('<td><input type="checkbox" class="form-check-input"></td');
			$row.append($checkbox);

			$("#verb-table-body").append($row);

			/* Attach listeners to the input field so the user's input
			 * can be validated
			 */
			$input.change(App.inputListener);

			/* Attach listener to checkboxes to reveal correct answer when clicked */
			$checkbox.change(App.checkboxListener);
		});
	},

	/* Attaches listeners to the input fields in the verb table.
	 * When a change event is fired, the input will compare the user's input
	 * with the correct answer and update the view accordingly
	 */
	inputListener: function() {
		var response = $(this).val();
		var answer = App.currentVerb.forms[$(this).data('form')];
		var inputForm = $(this).data('form');

		/* If the response is empty (e.g. the 'show' checkbox is unchecked, and the
		 * correct answer is hidden), then don't show the valid or invalid styling.
		 * Simply show the input box as if nothing happened.
		 */
		if (response == '') {
			$(this).removeClass('is-valid is-invalid');
			return;
		}

		var isCorrect = App.currentVerb.validateConjugation(inputForm, response);
		if (isCorrect) {
			$(this).addClass('is-valid').removeClass('is-invalid');
			/* Since we're not being strict about accents, once the
			 * response is validated, fill the input box with the text
			 * of the true answer (including the accents)
			 */
			$(this).val(answer);
		}
		else {
			$(this).addClass('is-invalid').removeClass('is-valid');
		}
	},

	/* Attaches listeners to the checkbox field in the table row.
	 * When checked, the listener will display the correct answer
	 * for that row.
	 */
	checkboxListener: function() {
		var $row = $(this).closest('tr');
		var $input = $row.find('.verb-input');

		var form = $input.data('form');
		var answer = App.currentVerb.forms[form];

		/* bootstrap 4 doesn't appear to toggle the 'checked' property,
		 * so do it manually
		 */
		$(this).prop('checked', !$(this).prop('checked'));
		var checked = $(this).prop('checked');

		if (checked) {
			$input.val(answer);
		}
		else {
			$input.val('');
		}

		$input.trigger('change');
	},

	/* Handles the clicking of the 'Next' button. Calls getNextVerb and displayVerb. */
	next: function() {
		var nextVerb = App.getNextVerb();
		App.displayVerb(nextVerb);
	}
}

$(document).ready(App.initialize);
