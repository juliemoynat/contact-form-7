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

	/**
	 * #cf7-tng-start
	 *
	 * For `input[type="file"]` fields, because of a bug with Firefox and the NVDA Screen reader:
	 * - add a unique ID on the `<label>`;
	 * - link the `<label>` to the fields thanks to an `aria-labelledby` attribute.
	 *
	 * Explanation: `aria-describedby` is not supported on this type of field with Firefox. And so, `aria-labelledby` will be used for the error message. So, we need to link the `<label>` with this attribute too so that it will not be erased.
	 */

	form.querySelectorAll( '.wpcf7-file' ).forEach( field => {

		if( !field.getAttribute( 'aria-labelledby' ) && field.getAttribute( 'id' ) ) {

			var labelArray = form.querySelectorAll( 'label[for="' + field.getAttribute( 'id' ) + '"]' );

			if( labelArray.length == 1 ) {
				var label = labelArray[0];
				var ID = label.id;

				if ( !ID ) {
					ID = 'cf7-tng-label-' + Math.random().toString(36).substr(2, 9);
					label.setAttribute( 'id', ID );
				}

				field.setAttribute( 'aria-labelledby', label.id );
			}
		}
	});

	/** #cf7-tng-end */

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
