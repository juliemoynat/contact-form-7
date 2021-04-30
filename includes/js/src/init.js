import { absInt } from './utils';
import { resetCaptcha, resetQuiz } from './reset';

import {
	exclusiveCheckboxHelper,
	freeTextHelper,
	urlInputHelper,
	initSubmitButton,
	initCharacterCount,
} from './helpers';

export default function init( form ) {

	// console.log('Je suis dans init de contact form !');

	const formData = new FormData( form );

	form.wpcf7 = {
		id: absInt( formData.get( '_wpcf7' ) ),
		status: form.getAttribute( 'data-status' ),
		pluginVersion: formData.get( '_wpcf7_version' ),
		locale: formData.get( '_wpcf7_locale' ),
		unitTag: formData.get( '_wpcf7_unit_tag' ),
		containerPost: absInt( formData.get( '_wpcf7_container_post' ) ),
		parent: form.closest( '.wpcf7' ),
	};

	form.querySelectorAll( '.wpcf7-submit' ).forEach( element => {
		element.insertAdjacentHTML(
			'afterend',
			'<span class="ajax-loader"></span>'
		);
	} );

	// ! PREMIERE FONCTION

	/**
	 * #cf7-tng-start
	 *
	 * For `input[type="file"]` fields, add a unique ID on the `<label>` and link th `<label>` to the fields thanks to an `aria-labelledby` attribute because of a bug with Firefox and the NVDA Screen reader.
	 */

	// console.log(form);

	form.querySelectorAll( '.wpcf7-file').forEach( field => {

		// console.log( 'field', field );
		// console.log( !field.getAttribute('aria-labelledby') ); // true if aria-labelledby is unset
		// console.log( field.getAttribute( 'id' ) ); // true if id is set

		// if there is no aria-labelledby BUT there is an id (id set up in the form)
		if( !field.getAttribute( 'aria-labelledby' ) && field.getAttribute( 'id' ) ) {

			// we search for the label with the attribute for set with the same value as the id of the field
			var labelArray = form.querySelectorAll('label[for="' + field.getAttribute( 'id' ) + '"]')
			// We get an arrway with entries (normally one)
			// console.log('label ?', label.length);

			// if there is only one <label> associated to the field (and it must have only one !)
			if( labelArray.length == 1 ) {

				// we stock the label information in a variable
				var label = labelArray[0];

				// We re-use label's id to set the ID
				var ID = label.id;

				// if ID is undefined
				if ( !ID ) {

					// We set up the ID with a string + a random and unique number turned to string
					ID = 'cf7-tng-label-' + Math.random().toString(36).substr(2, 9);
					// console.log('ID', ID);

					// we set up the label.id with our generated ID
					label.setAttribute( 'id', ID );
					// console.log('label', label[0]);
				}

				// we set up the aria-labelledby attribute with the content of label.id
				field.setAttribute( 'aria-labelledby', label.id );

				// Now the label and the field are linked
				console.log(label);
				console.log(field);
			}
		}
	})

	/**
	 * #cf7-tng-stop
	 */

	exclusiveCheckboxHelper( form );
	freeTextHelper( form );
	urlInputHelper( form );

	initSubmitButton( form );
	initCharacterCount( form );

	window.addEventListener( 'load', event => {
		if ( wpcf7.cached ) {
			form.reset();
		}
	} );

	form.addEventListener( 'reset', event => {
		wpcf7.reset( form );
	} );

	form.addEventListener( 'submit', event => {
		const submitter = event.submitter;
		wpcf7.submit( form, { submitter } );

		event.preventDefault();
	} );

	form.addEventListener( 'wpcf7submit', event => {
		if ( event.detail.apiResponse.captcha ) {
			resetCaptcha( form, event.detail.apiResponse.captcha );
		}

		if ( event.detail.apiResponse.quiz ) {
			resetQuiz( form, event.detail.apiResponse.quiz );
		}
	} );

	form.addEventListener( 'wpcf7reset', event => {
		if ( event.detail.apiResponse.captcha ) {
			resetCaptcha( form, event.detail.apiResponse.captcha );
		}

		if ( event.detail.apiResponse.quiz ) {
			resetQuiz( form, event.detail.apiResponse.quiz );
		}
	} );
}
