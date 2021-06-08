import { setStatus } from './status';
import { triggerEvent } from './event';
import { apiFetch } from './api-fetch';

export default function submit( form, options = {} ) {
	const formData = new FormData( form );

	if ( options.submitter && options.submitter.name ) {
		formData.append( options.submitter.name, options.submitter.value );
	}

	const detail = {
		contactFormId: form.wpcf7.id,
		pluginVersion: form.wpcf7.pluginVersion,
		contactFormLocale: form.wpcf7.locale,
		unitTag: form.wpcf7.unitTag,
		containerPostId: form.wpcf7.containerPost,
		status: form.wpcf7.status,
		inputs: Array.from(
			formData,
			val => {
				const name = val[0], value = val[1];
				return name.match( /^_/ ) ? false : { name, value };
			}
		).filter( val => false !== val ),
		formData,
	};

	const setScreenReaderValidationError = error => {
		const li = document.createElement( 'li' );

		li.setAttribute( 'id', error.error_id );

		if ( error.idref ) {
			li.insertAdjacentHTML(
				'beforeend',
				`<a href="#${ error.idref }">${ error.message }</a>`
			);
		} else {
			li.insertAdjacentText(
				'beforeend',
				error.message
			);
		}

		/**
		 * #cf7-tng-start
		 *
		 * .screen-reader-response does not exist anymore.
		 * See contact-form.php, function screen_reader_response.
		 */

		// form.wpcf7.parent.querySelector(
		// 	'.screen-reader-response ul'
		// ).appendChild( li );

		/** #cf7-tng-end */
	};

	const setVisualValidationError = error => {
		const wrap = form.querySelector( error.into );

		const control = wrap.querySelector( '.wpcf7-form-control' );
		control.classList.add( 'wpcf7-not-valid' );
		control.setAttribute( 'aria-invalid', 'true' );
		control.setAttribute( 'aria-describedby', error.error_id );

		const tip = document.createElement( 'span' );
		tip.setAttribute( 'class', 'wpcf7-not-valid-tip' );

		/**
		 * #cf7-tng-start
		 *
		 * - Comment `role="alert" aria-hidden="true"` from the span element.
		 * - Create errorID for random unique ID, and attach errorID to the error message.
		 */

		let errorID = 'cf7-tng-error-' + Math.random().toString(36).substr(2, 9);

		// tip.setAttribute( 'aria-hidden', 'true' );
		tip.setAttribute( 'id', errorID );

		/** #cf7-tng-end */

		/**
		 * #cf7-tng-start
		 *
		 * - Retrieve unique ID from error message and add `aria-describedby` to its field
		 * - For `input[type="file"]`, handle it with `aria-labelledby` instead of `aria-describedby` because of a Firefox + NVDA bug
		 * - Delete attribute aria-describedby for `input[type="file"]`
		 */

		if ( control.type == 'file' ) {
			control.setAttribute( 'aria-labelledby', control.getAttribute( 'aria-labelledby' ) + ' ' + errorID );
			control.removeAttribute( 'aria-describedby' );
		} else {
			control.setAttribute( 'aria-describedby', errorID );
		}

		/** #cf7-tng-end */

		tip.insertAdjacentText( 'beforeend', error.message );
		wrap.appendChild( tip );

		if ( control.closest( '.use-floating-validation-tip' ) ) {
			control.addEventListener( 'focus', event => {
				tip.setAttribute( 'style', 'display: none' );
			} );

			tip.addEventListener( 'mouseover', event => {
				tip.setAttribute( 'style', 'display: none' );
			} );
		}
	};

	apiFetch( {
		endpoint: `contact-forms/${ form.wpcf7.id }/feedback`,
		method: 'POST',
		body: formData,
		wpcf7: {
			endpoint: 'feedback',
			form,
			detail,
		},
	} ).then( response => {

		const status = setStatus( form, response.status );

		detail.status = response.status;
		detail.apiResponse = response;

		if ( [ 'invalid', 'unaccepted', 'spam', 'aborted' ].includes( status ) ) {
			triggerEvent( form, status, detail );
		} else if ( [ 'sent', 'failed' ].includes( status ) ) {
			triggerEvent( form, `mail${ status }`, detail );
		}

		triggerEvent( form, 'submit', detail );

		return response;

	} ).then( response => {

		if ( response.posted_data_hash ) {
			form.querySelector(
				'input[name="_wpcf7_posted_data_hash"]'
			).value = response.posted_data_hash;
		}

		if ( 'mail_sent' === response.status ) {
			form.reset();
			form.wpcf7.resetOnMailSent = true;
		}

		if ( response.invalid_fields ) {
			response.invalid_fields.forEach( setScreenReaderValidationError );
			response.invalid_fields.forEach( setVisualValidationError );
		}

		/**
		 * #cf7-tng-start
		 *
		 * .screen-reader-response does not exist anymore.
		 * See contact-form.php, function screen_reader_response.
		 */

		// form.wpcf7.parent.querySelector(
		// 	'.screen-reader-response [role="status"]'
		// ).insertAdjacentText( 'beforeend', response.message );

		/** #cf7-tng-end */


		/**
		 * #cf7-tng-start
		 *
		 * 3rd : Put the message into a HTML paragraph
		 *
		 * 5th/6th : move focus on every type of message after submit (confirmation, error, warning)
		 */

		form.querySelectorAll( '.wpcf7-response-output' ).forEach( div => {
			var paragraph = document.createElement( 'p' );
			paragraph.textContent = response.message;
			div.appendChild( paragraph );
			div.focus();
		} );

		/** #cf7-tng-end */

	} ).catch( error => console.error( error ) );
}

apiFetch.use( ( options, next ) => {
	if ( options.wpcf7 && 'feedback' === options.wpcf7.endpoint ) {
		const { form, detail } = options.wpcf7;

		clearResponse( form );
		triggerEvent( form, 'beforesubmit', detail );
		setStatus( form, 'submitting' );
	}

	return next( options );
} );

export const clearResponse = form => {

	/**
	 * #cf7-tng-start
	 *
	 * .screen-reader-response does not exist anymore.
	 * See contact-form.php, function screen_reader_response.
	 */

	// form.wpcf7.parent.querySelector(
	// 	'.screen-reader-response [role="status"]'
	// ).innerText = '';

	// form.wpcf7.parent.querySelector(
	// 	'.screen-reader-response ul'
	// ).innerText = '';

	/** #cf7-tng-end */

	form.querySelectorAll( '.wpcf7-not-valid-tip' ).forEach( span => {
		span.remove();
	} );


	form.querySelectorAll( '.wpcf7-form-control' ).forEach( control => {

		/**
		 * #cf7-tng-start
		 *
		 * - Remove the error message ID from the `aria-labelledby` attribute for `input[type="file"]`
		 */

		if( control.getAttribute( 'type' ) == 'file' ) {
			let IDs = control.getAttribute( 'aria-labelledby' );
			IDs = IDs.split( ' ' );
			IDs = IDs.filter( function ( ID ) {
				return !/^cf7-tng-error-*/.test( ID );
			});

			control.setAttribute( 'aria-labelledby', IDs.join( ' ' ) );
		}

		/** #cf7-tng-end */

		control.setAttribute( 'aria-invalid', 'false' );
		control.removeAttribute( 'aria-describedby' );
		control.classList.remove( 'wpcf7-not-valid' );
	} );

	form.querySelectorAll( '.wpcf7-response-output' ).forEach( div => {
		div.innerText = '';
	} );
};
