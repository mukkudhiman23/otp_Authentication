/**
 * Function to display the success message for the Success operations
 */
function show_FlashMessage(message, type, title) {
	// remove all the other messages
	PNotify.removeAll();

	// check the type of the flash message and set by default to success
	if (typeof type == 'undefined') {
		type = 'success';
	}

	// check title is specified or not
	if (typeof title == 'undefined' && type == 'success') {
		title = 'Success';
	}

	// check title is specified or not
	if (typeof title == 'undefined' && type == 'error') {
		title = 'Error';
	}

	// check title is specified or not
	if (typeof title == 'undefined' && type == 'warning') {
		title = 'Warning!';
	}

	// make the new message
	new PNotify({
		type: type,
		title: title,
		text: message,
		delay: 2000
	});
}


/**
 * Start the loader on the particular element
 */
function startLoader(element) {
	// check if the element is not specified
	if (typeof element == 'undefined') {
		element = "body";
	}

	// set the wait me loader
	$(element).waitMe({
		effect: 'bounce',
		text: 'Please Wait..',
		bg: 'rgba(255,255,255,0.7)',
		color: 'rgb(66,35,53)',
		sizeW: '20px',
		sizeH: '20px',
		source: ''
	});
}

/**
 * Start the loader on the particular element
 */
function stopLoader(element) {
	// check if the element is not specified
	if (typeof element == 'undefined') {
		element = 'body';
	}

	// close the loader
	$(element).waitMe("hide");
}