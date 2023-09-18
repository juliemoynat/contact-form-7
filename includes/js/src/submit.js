import { setStatus } from './status';
import { triggerEvent } from './event';
import { apiFetch } from './api-fetch';
import { setValidationError, removeValidationError } from './validate';

export default function submit( form, options = {} ) {

	if ( wpcf7.blocked ) {
		clearResponse( form );
		setStatus( form, 'submitting' );
		return;
	}

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
			/**
			 * #cf7-a11y-start {Tanaguru}
			 *
			 * Move focus on confirmation message after submit and before reset
			 */
			form.querySelector( '.wpcf7-response-output' ).focus();
			/** #cf7-a11y-end */

			form.reset();
			form.wpcf7.resetOnMailSent = true;
		}

		if ( response.invalid_fields ) {
			response.invalid_fields.forEach( error => {
				setValidationError( form, error.field, error.message );
			} );
		}

		/**
		 * #cf7-a11y-start {Tanaguru}
		 *
		 * .screen-reader-response does not exist anymore.
		 * See contact-form.php, function screen_reader_response.
		 */
		// form.wpcf7.parent.querySelector(
		// 	'.screen-reader-response [role="status"]'
		// ).insertAdjacentText( 'beforeend', response.message );
		/** #cf7-a11y-end */

		form.querySelectorAll( '.wpcf7-response-output' ).forEach( div => {
			/**
			 * #cf7-a11y-start
			 *
			 * {Tanaguru}
			 * - Put the message into a HTML paragraph
			 * - Move focus on every type of message after submit (error, warning)
			 *
			 * {JM}
			 * - Add a 1 second delay before giving focus to the message
			 * because in some cases, it doesn't work otherwise…
			 */
			// div.innerText = response.message;
			var paragraph = document.createElement( 'p' );
			paragraph.textContent = response.message;
			div.appendChild( paragraph );

			setTimeout(() => {
				div.focus();
			}, 1000);
			/** #cf7-a11y-end */
		} );

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
	form.querySelectorAll( '.wpcf7-form-control-wrap' ).forEach( wrap => {
		if ( wrap.dataset.name ) {
			removeValidationError( form, wrap.dataset.name );
		}
	} );

	/**
	 * #cf7-a11y-start {Tanaguru}
	 *
	 * .screen-reader-response does not exist anymore.
	 * See contact-form.php, function screen_reader_response.
	 */
	// form.wpcf7.parent.querySelector(
	// 	'.screen-reader-response [role="status"]'
	// ).innerText = '';
	/** #cf7-a11y-end */

	form.querySelectorAll( '.wpcf7-response-output' ).forEach( div => {
		div.innerText = '';
	} );
};
