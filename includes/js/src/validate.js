import { setStatus } from './status';


export default function validate( form, options = {} ) {
	const {
		target,
		scope = form,
		...remainingOptions
	} = options;

	if ( undefined === form.wpcf7?.schema ) {
		return;
	}

	const schema = { ...form.wpcf7.schema };

	if ( undefined !== target ) {
		if ( ! form.contains( target ) ) {
			return;
		}

		// Event target is not a wpcf7 form control.
		if ( ! target.closest( '.wpcf7-form-control-wrap[data-name]' ) ) {
			return;
		}

		if ( target.closest( '.novalidate' ) ) {
			return;
		}
	}

	const formData = new FormData();

	const targetFields = [];

	for ( const wrap of scope.querySelectorAll( '.wpcf7-form-control-wrap' ) ) {
		if ( wrap.closest( '.novalidate' ) ) {
			continue;
		}

		wrap.querySelectorAll(
			':where( input, textarea, select ):enabled'
		).forEach( control => {
			if ( ! control.name ) {
				return;
			}

			switch ( control.type ) {
				case 'button':
				case 'image':
				case 'reset':
				case 'submit':
					break;
				case 'checkbox':
				case 'radio':
					if ( control.checked ) {
						formData.append( control.name, control.value );
					}
					break;
				case 'select-multiple':
					for ( const option of control.selectedOptions ) {
						formData.append( control.name, option.value );
					}
					break;
				case 'file':
					for ( const file of control.files ) {
						formData.append( control.name, file );
					}
					break;
				default:
					formData.append( control.name, control.value );
			}
		} );

		if ( wrap.dataset.name ) {
			targetFields.push( wrap.dataset.name );

			wrap.setAttribute( 'data-under-validation', '1' );

			if ( wrap.contains( target ) ) {
				break;
			}
		}
	}

	schema.rules = ( schema.rules ?? [] ).filter(
		( { field } ) => targetFields.includes( field )
	);

	const prevStatus = form.getAttribute( 'data-status' );

	Promise.resolve( setStatus( form, 'validating' ) )
		.then( status => {
			if ( undefined !== swv ) {
				const result = swv.validate( schema, formData, options );

				for ( const [ field, { error, validInputs } ] of result ) {
					removeValidationError( form, field );

					if ( undefined !== error ) {
						setValidationError( form, field, error, { scope } );
					}

					updateReflection( form, field, validInputs ?? [] );
				}
			}
		} )
		.finally( () => {
			setStatus( form, prevStatus );

			form.querySelectorAll(
				'.wpcf7-form-control-wrap[data-under-validation]'
			).forEach( wrap => {
				wrap.removeAttribute( 'data-under-validation' );
			} );
		} );
}


export const setValidationError = ( form, fieldName, message, options ) => {
	const {
		scope = form,
		...remainingOptions
	} = options ?? {};

	const errorId = `${ form.wpcf7?.unitTag }-ve-${ fieldName }`
		.replaceAll( /[^0-9a-z_-]+/ig, '' );

	const firstFoundControl = form.querySelector(
		`.wpcf7-form-control-wrap[data-name="${ fieldName }"] .wpcf7-form-control`
	);

	const setScreenReaderValidationError = () => {
		/**
		 * #cf7-a11y-start
		 *
		 * .screen-reader-response does not exist anymore.
		 * See contact-form.php, function screen_reader_response.
		 */
		/** {JM} */
		// const li = document.createElement( 'li' );

		// li.setAttribute( 'id', errorId );

		// if ( firstFoundControl && firstFoundControl.id ) {
		// 	li.insertAdjacentHTML(
		// 		'beforeend',
		// 		`<a href="#${ firstFoundControl.id }">${ message }</a>`
		// 	);
		// } else {
		// 	li.insertAdjacentText(
		// 		'beforeend',
		// 		message
		// 	);
		// }

		/** {Tanaguru} */
		// form.wpcf7.parent.querySelector(
		// 	'.screen-reader-response ul'
		// ).appendChild( li );
		/** #cf7-a11y-end */
	};

	const setVisualValidationError = () => {
		scope.querySelectorAll(
			`.wpcf7-form-control-wrap[data-name="${ fieldName }"]`
		).forEach( wrap => {
			if (
				'validating' === form.getAttribute( 'data-status' ) &&
				! wrap.dataset.underValidation
			) {
				return;
			}

			const tip = document.createElement( 'span' );
			tip.classList.add( 'wpcf7-not-valid-tip' );

			/**
			 * #cf7-a11y-start
			 *
			 * {Tanaguru}
			 * - Comment `aria-hidden="true"` from the span element.
			 *
			 * {JM}
			 * - Add existing errorId to the error message.
			 */
			// tip.setAttribute( 'aria-hidden', 'true' );
			tip.setAttribute( 'id', errorId );
			/** #cf7-a11y-end */

			tip.insertAdjacentText( 'beforeend', message );
			wrap.appendChild( tip );

			wrap.querySelectorAll( '[aria-invalid]' ).forEach( elm => {
				elm.setAttribute( 'aria-invalid', 'true' );
			} );

			wrap.querySelectorAll( '.wpcf7-form-control' ).forEach( control => {
				control.classList.add( 'wpcf7-not-valid' );

				/**
				 * #cf7-a11y-start
				 *
				 * {Tanaguru}
				 * - Retrieve unique ID from error message and add `aria-describedby` to its field
				 * - For `input[type="file"]`, handle it with `aria-labelledby` instead of `aria-describedby` because of a Firefox + NVDA bug
				 * - Delete attribute aria-describedby for `input[type="file"]`
				 *
				 * {JM}
				 * - For `fieldset` or `span` container, add `aria-describedby` on the fields inside and not on the container
				 * - Use the existing errorId
				 */
				if ( control.type == 'file' ) {
					control.setAttribute( 'aria-labelledby', control.getAttribute( 'aria-labelledby' ) + ' ' + errorId );
					control.removeAttribute( 'aria-describedby' );
				} else if( control.nodeName.toLowerCase() == 'fieldset' || control.nodeName.toLowerCase() == 'span' ) {
					control.querySelectorAll('input').forEach(input => {
						input.setAttribute( 'aria-describedby', errorId );
					});
				} else {
					control.setAttribute( 'aria-describedby', errorId );
				}
				/** #cf7-a11y-end */

				if ( typeof control.setCustomValidity === 'function' ) {
					control.setCustomValidity( message );
				}

				if ( control.closest( '.use-floating-validation-tip' ) ) {
					control.addEventListener( 'focus', event => {
						tip.setAttribute( 'style', 'display: none' );
					} );

					tip.addEventListener( 'click', event => {
						tip.setAttribute( 'style', 'display: none' );
					} );
				}
			} );
		} );
	};

	setScreenReaderValidationError();
	setVisualValidationError();
};


export const removeValidationError = ( form, fieldName ) => {
	const errorId = `${ form.wpcf7?.unitTag }-ve-${ fieldName }`
		.replaceAll( /[^0-9a-z_-]+/ig, '' );

	/**
	 * #cf7-a11y-start {Tanaguru}
	 *
	 * .screen-reader-response does not exist anymore.
	 * See contact-form.php, function screen_reader_response.
	 */
	// form.wpcf7.parent.querySelector(
	// 	`.screen-reader-response ul li#${ errorId }`
	// )?.remove();
	/** #cf7-a11y-end */

	form.querySelectorAll(
		`.wpcf7-form-control-wrap[data-name="${ fieldName }"]`
	).forEach( wrap => {
		wrap.querySelector( '.wpcf7-not-valid-tip' )?.remove();

		wrap.querySelectorAll( '[aria-invalid]' ).forEach( elm => {
			elm.setAttribute( 'aria-invalid', 'false' );
		} );

		wrap.querySelectorAll( '.wpcf7-form-control' ).forEach( control => {
			/**
			 * #cf7-a11y-start {JM}
			 *
			 * Remove `aria-describedby` attribute for fields inside a group of fields.
			 */
			if( control.nodeName.toLowerCase() == 'fieldset' || control.nodeName.toLowerCase() == 'span' ) {
				control.querySelectorAll('input').forEach(input => {
					input.removeAttribute( 'aria-describedby' );
				});
			}
			/** #cf7-a11y-end */

			/**
			 * #cf7-a11y-start
			 *
			 * {Tanaguru}
			 * - Remove the error message ID from the `aria-labelledby` attribute for `input[type="file"]`
			 *
			 * {JM}
			 * - Use the existing errorId
			 * - Move this code near the place where there is `aria-describedby` attribute removal and rename `elm` to `control`
			 */
			if( control.getAttribute( 'type' ) == 'file' ) {
				let IDs = control.getAttribute( 'aria-labelledby' );
				IDs = IDs.split( ' ' );
				IDs = IDs.filter( function ( ID ) {
					return ID != errorId;
				});

				control.setAttribute( 'aria-labelledby', IDs.join( ' ' ) );
			}
			/** #cf7-a11y-end */

			control.removeAttribute( 'aria-describedby' );
			control.classList.remove( 'wpcf7-not-valid' );

			if ( typeof control.setCustomValidity === 'function' ) {
				control.setCustomValidity( '' );
			}
		} );
	} );
};


export const updateReflection = ( form, field, validInputs ) => {
	form.querySelectorAll(
		`[data-reflection-of="${ field }"]`
	).forEach( reflection => {
		if ( 'output' === reflection.tagName.toLowerCase() ) {
			const output = reflection;

			if ( 0 === validInputs.length ) {
				validInputs.push( output.dataset.default );
			}

			validInputs.slice( 0, 1 ).forEach( input => {
				if ( input instanceof File ) {
					input = input.name;
				}

				output.textContent = input;
			} );

		} else {
			reflection.querySelectorAll(
				'output'
			).forEach( output => {
				if ( output.hasAttribute( 'data-default' ) ) {
					if ( 0 === validInputs.length ) {
						output.removeAttribute( 'hidden' );
					} else {
						output.setAttribute( 'hidden', 'hidden' );
					}
				} else {
					output.remove();
				}
			} );

			validInputs.forEach( input => {

				if ( input instanceof File ) {
					input = input.name;
				}

				const output = document.createElement( 'output' );

				output.setAttribute( 'name', field );
				output.textContent = input;

				reflection.appendChild( output );
			} );
		}
	} );
};
