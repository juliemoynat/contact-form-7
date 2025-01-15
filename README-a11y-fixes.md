# Contact Form 7 with accessibility fixes

A fork of a fork of the Contact Form 7 WordPress plugin to fix accessibility problems.

- [Official Contact Form 7 GitHub by Takayuki Miyoshi](https://github.com/rocklobster-in/contact-form-7/) 
- Initial source of this fork: [Tanaguru’s fork of Contact Form 7](https://github.com/Tanaguru/contact-form-7/tree/a11y-fixes)
- [This fork and its releases](https://github.com/juliemoynat/contact-form-7/releases).

This fork does not claim to fix all the accessibility problems of the plugin. Be sure to read the documentation below to know what to expect (it should work for most classic forms).

## Multiple authors

As this fork is a fork of another fork, modifications will be tagged to be identified from who they come:

- if you see `{Tanaguru}` in a comment, it’s a fix by Tanaguru;
- if you see `{JM}` in a comment, it’s a fix by me, Julie Moynat.

## List of the accessibility fixes

### 1. Main error message or success message handling {Tanaguru}

In the original Contact Form 7, when there are errors on submitting the form, there are two main message:

- one is visually displayed and inaccessible to screen readers (it’s a sentence to tell there are errors): that’s a problem because people using screen readers are not all blind people;
- the other is visually hidden and only accessible to screen reader users. This message contains links to anchors in the form. That’s a problem because links are accessible through keyboard but not visible at all!

Both main error message or success message have a `role="alert"` attribute but this one is not ready in DOM before dynamically adding the message inside it. So, some screen readers may not read the message.

The main message should be at the top of the form to be logical.

#### What have been done

The focus has been moved on the main message (that must be at the top of the form) in order to be sure that the message will be read by screen readers and so, users are at the right place to go again inside the form to fix their errors.

1. Move the `[response]` short code in our form administration at the top of the form (before writing fields) (**don’t forget to do it as a developer**);
1. Remove the `role="alert"` and `aria-hidden="true"` attribute from the main message container that is visible;
1. Add a `tabindex="-1"`attribute on the main message container;
1. Remove the visually hidden message (the one with links inside);
1. On submit, move focus on the main message (error or success);
1. Put the main message into a HTML paragraph (`<p>`).

### 2. Attach individual error message to its field {Tanaguru}

In the original Contact Form 7, when there are errors on submitting the form, each field in error has a dedicated individual error message below it. These error messages have a `role="alert"` attribute and are not attached to their field so it remains difficult for blind users to access to these messages.

Moreover, these individual messages are visually displayed and inaccessible to screen readers: that’s a problem because people using screen readers are not all blind people.

#### What have been done

1. Remove the `role="alert"` and `aria-hidden="true"` attributes from these messages;
1. Add a unique ID on each individual message;
1. Attach the `aria-describedby` attribute with the ID of the error message.

### 3. Remove `size` attribute on form fields {Tanaguru}

A `size` attribute is used on form fields but it’s not compliant with accessibility rules. CSS must be used instead in order to fix field size.

#### What have been done

Remove the `size` attribute from fields.

### 4. Add a `for` attribute on the `<label>` of the acceptance checkbox {Tanaguru}

The acceptance checkbox (for GDPR) is a dedicated field in the contact form administration. In the code, you can’t access to the `<label>` element so you can’t attached the label to its field properly.

#### What have been done

Add a `for` attribute on the acceptance `<label>` only if the ID is filled in the contact form administration. Its value is the ID of the field, of course.

### 5. Error message on `input[type="file"]` field and the Firefox + NVDA bug {Tanaguru}

On Firefox, the `aria-describedby` attribute doesn’t work with the NVDA screen reader: it is not read.

So, the fix we’ve done to link error messages to their field was not working for this kind of field with Firefox + NVDA.

#### What have been done

Use `aria-labelledby` instead of `aria-describedby` attribute to link the error message for `input[type="file"]` field.

This was a little bit complicated because we needed to link the `<label>` of the field in the `aria-labelledby` attribute too. Actually, the `aria-labelledby` attribute is stronger than `<label>` and overrides it. So, to have the field label and its error message read by the screen reader, both must be linked into the `aria-labelledby` attribute.

1. If the file field has **one** associated label (`for` / `id`) and has no `aria-labelledby` attribute:
    1. If the `<label>` has no `id`, add a unique ID on the `<label>` associated to the field;
    2. Add an `aria-labelledby` attribute on the field where its value is the ID of its label.
2. If this is a file field, don’t add an `aria-describedby` attribute on the field to link the error message but add the ID of the error message in the `aria-labelledby` attribute.
3. If this is a file field, remove only the ID of the error message from the `aria-labelledby` attribute when there is no error anymore.

#### What you need to know in order to benefit from the fix

1. Use only one `<label>` associated to the field (a field must not have several `<label>`);
2. The `aria-labelledby` attribute is generated only if it is not present. Be careful if you’re already using it: it must contain the ID of its associated `<label>`.

### 6. Add an `aria-required="true"` attribute on the `<input>` of the acceptance checkbox {JM}

The acceptance checkbox (for GDPR) is a dedicated field in the contact form administration. In the code, you can’t manually add the `aria-required="true"` attribute on the field when it’s not optional.

#### What have been done

Add an `aria-required="true"` attribute on the acceptance `<input>` only if the “optional” option is not checked in the contact form administration.

### 7. Handle the `aria-describedby` attribute for group of fields (`span` or `fieldset`) in error {JM}

For group of fields (`span` (?) or `fieldset`), the error CSS class is added on the group and not on each field. So, the `aria-describedby` attribute was added on the group too where screen reader are not vocalizing it.

#### What have been done

Detect if the error is set on the container and get the fields inside to add them the `aria-describedby` attribute.

### 8. Add unique ID for checkboxes attached to their `label` {JM}

Checkbox fields do not have IDs and their `label` have no `for` attribute.

#### What have been done

- Add a unique ID for each `checkbox`;
- Add a `for` attribute for each `label` attached to its field.

### 9. Removing the default `max-length` forced on text and textarea fields since v9.5.6 {JM}

CF7 9.5.6 introduced a default `max-length` for text and textarea fields for antispam reasons (?) but it causes problems because it can't be unset and users are not aware about this attribute being set by default. People filling a form should be warned about the caracters limit on fields in the `label`.

The developer doesn't want to add an option about this. See these tickets:

- [Short default max-length for text and textarea fields in a minor version, #1441](https://github.com/rocklobster-in/contact-form-7/issues/1441)
- [Add a filter to override maxlength limits added in v5.9.6, #1443](https://github.com/rocklobster-in/contact-form-7/issues/1443)

This fix remove the default `max-length`. It can be added for fields manually as usual but it is not set by default.

### 10. Removing the `aria-label` attribute on the `<form>` {JM}

The `<form>` tag has an `aria-label` attribute with “Contact form” as a value. But the form is not always a contact form: it can be a newsletter subscription form or something else. It's better not to have an `aria-label` than having a wrong one.

Moreover, the `aria-label` attribute is not useful here.

#### What have been done

The `aria-label` attribute on the `<form>` tag has been removed.

## Accessibility tips for Contact Form 7

### Acceptance checkbox: a disabled button is not a good thing

By default, adding an acceptance checkbox (a checkbox to let people give their consent about the website privacy policy) to a form is disabling the submit button until the user checks the checkbox.

Disabled buttons are causing a lot of trouble. You can read [“Disabled buttons suck” on the Axess Lab blog](https://axesslab.com/disabled-buttons-suck/) to know why.

In order to let the acceptance checkbox behave like the other fields, with an error message by clicking on the submit button if it's not checked, you will need to [add a piece of code in the additional settings of your form](https://contactform7.com/additional-settings/):

```
acceptance_as_validation: on
```

## How to contribute?

This fork must stay close to the evolving changes of the original plugin and so it must stay up to date.

This repository is a fork from a fork from the original plugin. The work is in progress on the `a11y-fixes` branch in order to be able to send small pull requests via other branches afterwards.

### Using specific comment tags

To make it easier to merge changes with new updates, changes in the code is documented. Make sure to wrap the section of code you’ve changed with the following comment tags:

```php
/**
 * #cf7-a11y-start
 * Describe quickly in English the changes made
 */

// code

/** #cf7-a11y-end */
```

### Commenting original code

If you ever want to remove a whole chunk of code (ie. if statement, a whole function, etc.), comment the original code and in the `#cf7-a11y-start` comment tag, quickly explain *why* this has been removed, especially if it has to do with web accessibility.

For example, this could look like this (this example is not taken from the original plugin by the way):

```javascript
/**
 * #cf7-a11y-start
 * Remove role="button" : if button is needed
 * use <button> tags instead of <a> tags.
 */

// if (link) {
//    link.setAttribute('role', 'button')
// }

/** #cf7-a11y-end */
```

## How to update this fork from the original Contact Form 7 GitHub repository

This fork is a fork from Tanaguru’s one in order to keep historical changes but it must be up to date from the original Contact Form 7 repository and not from the Tanaguru’s fork.

Follow these instructions to update this fork from the official Contact Form 7:

1. Check that the `master` branch is up to date on your computer;
1. Check that the `master` branch is up to date from the original forked repository. Github is telling you this information in the interface. If it’s not up to date, [rebase it](https://stackoverflow.com/a/7244456):
	```
	# Make sure that you’re on your master branch:

	git checkout master

	# Add the remote, call it "upstream" (only the first time you do it):

	git remote add upstream https://github.com/rocklobster-in/contact-form-7.git

	# Fetch all the branches of that remote into remote-tracking branches:

	git fetch upstream

	# Rewrite your master branch so that any commits of yours that
	# aren’t already in upstream/master are replayed on top of that
	# other branch:

	git rebase upstream/master

	# Push it

	git push
	```
1. Two cases:
	1. Either the last commit in upstream/master **is** the last release commit so:
		1. Checkout `a11y-fixes` branch;
		1. Rebase this branch from `master` (or merge `master` into it) and push.
	1. Or the last commit in upstream/master **is not** the last release commit so:
		1. [Find the tag from the last plugin version](https://github.com/takayukister/contact-form-7/tags);
		1. Fetch it: `git fetch upstream refs/tags/v5.8.0` (“v.5.8.0” is the tag name for this example);
		1. Checkout `a11y-fixes` branch;
		1. Merge this tag into `a11y-fixes` branch. Just like: `git merge v5.8.0` and push.
1. If there are some package.json updates:
	1. If it’s your first time:
		1. Make sure you have NodeJS installed on your computer;
		1. Open a command line interface at the root folder;
		1. Run `npm install`.
	1. If you already have installed the project:
		1. Open a command line interface at the root folder;
		1. Run `npm update`.
1. If there are some JS updates, compile the includes/js/index.js file, run `npm run build:front`.
1. Test it into a local WordPress project.
1. Fix the version number of the plugin into the `wp-contact-form-7.php` file:
	1. In the comment block at the top of the file, modify the “Version:” line;
	1. Keep the official version number of Contact Form 7;
	1. Add a suffix number : “-a11y.x” (where “x” is an incremental number).
1. Make a Github Release from the `a11y-fixes` branch.

:warning: **Do not merge `a11y-fixes` branch into `master`.**

## How to use this plugin fork into your WordPress website

### How to install this plugin fork the first time

1. Download [the last release of this fork](https://github.com/juliemoynat/contact-form-7/releases);
1. Into your `wp-content/plugins/` folder, create a new folder named `contact-form-7-a11y`;
1. Extract the ZIP file of the release into this new folder (without the parent `contact-form-7` folder);
1. Get your language for this plugin fork:
	1. Go on [the official “Translating WordPress” page for Contact Form 7](https://translate.wordpress.org/projects/wp-plugins/contact-form-7/language-packs/) and download the translation files that you want;
	1. Extract the files into your `wp-content/languages/plugins` folder.

### How to update this plugin fork on a website: ⚠️ No automatic updates

1. This forked plugin is only available on GitHub so it will not benefit from automatic updates on your WordPress website.
1. The translations will not benefit from automatic updates on your WordPress website either.

**You will need to update the forked plugin and translations manually:**

1. Download [the last release of this fork](https://github.com/juliemoynat/contact-form-7/releases);
1. Put your website under maintenance;
1. Into your `wp-content/plugins/contact-form-7-a11y` folder, remove all files.
	
	⚠️ **Do not remove the plugin from the WordPress administration or it will remove your forms!**;
1. Extract the ZIP file of the release into this folder (without the parent `contact-form-7` folder);
1. Get your language updates for this plugin fork:
	1. Go on [the official “Translating WordPress” page for Contact Form 7](https://translate.wordpress.org/projects/wp-plugins/contact-form-7/language-packs/) and download the translation files that you want;
	1. Extract the files into your `wp-content/languages/plugins` folder.
1. Test your forms and if everything is OK, lift your website maintenance.

#### Being notified about new releases

If you have a GitHub account, you can **watch the GitHub repository** to be notified when a new release is available:

1. Click on the “Watch” button on the top of [the repository page](https://github.com/juliemoynat/contact-form-7/);
1. Then click on “Custom”;
1. Check the “Releases” checkbox;
1. Click on the “Apply” button;
1. You will receive an email when a release is available.

### Migration from the official Contact Form 7 plugin

If you already have the original Contact Form 7 plugin installed, **don’t uninstall it** or you will loose your forms. **Just remove the plugin folder** in `wp-content/plugins/`. This plugin fork will use the forms that are already in your database.

Then, follow the chapter “How to install this plugin fork the first time”.
