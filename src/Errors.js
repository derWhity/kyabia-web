
let i18nInstance = null;
const defaultErrorCode = 'err.UNKNOWN_ERROR';

/**
 * Returns a translated error message for the given error code or the translation for "UNKNOWN_ERROR", if the error
 * code is not known
 *
 * @param  {String} errCode     The error code to retrieve the translated message for
 * @return {String}             The translated error message for the given error code
 */
function getMessageForErrorCode(errCode) {
    let translationCode = `err.${errCode}`;
    let translation = i18nInstance.t(translationCode);
    return translation == translationCode ? i18nInstance.t(defaultErrorCode) : translation;
}

/**
 * Initializes the error helper with the i18n instance used.
 *
 * @param {Object} i18n The i18n instance used in the application
 */
function init(i18n) {
    i18nInstance = i18n;
}

export {init};
export {getMessageForErrorCode};
