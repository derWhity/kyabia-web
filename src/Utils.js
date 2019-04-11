import _ from 'lodash';

/**
 * RegEx for checking for a ISO date string (yyyy-mm-ddThh:mm:ssZ)
 * @type {RegExp}
 */
const dateRegEx =
  /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}(\.[0-9]+)?(Z|([+\-][0-9]{2}:[0-9]{2}))$/;

export const pagesWithoutLogin = ['Search', 'MainPlaylist'];

let i18nInstance = null;

const availableLanguages = [
  'ar', 'bg', 'bs', 'cs', 'da', 'de', 'el', 'en', 'et', 'es', 'fi', 'fr', 'ga', 'hu', 'it', 'is', 'ja',
  'ko', 'lt', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'th', 'tr', 'vi', 'zh',
];

/**
 * Initializes the utils with the current i18n instance used.
 *
 * @param {Object} i18n The VueI18n instance used in the application
 */
function init(i18n) {
  i18nInstance = i18n;
}

/**
 * Iterates through all properties of the given object and replaces all properties that have a string that resembles
 * an ISO format date to "real" Date objects
 *
 * Attention: This function only runs on the first object hierarchy level - nested objects will not be treated!
 *
 * @param  {Object} obj   Object to unmarshal the dates in
 * @return {Object}       The passed object for assignments
 */
function unmarshalDates(obj) {
  _.forOwn(obj, (value, key) => {
    if (dateRegEx.test(value)) {
      obj[key] = new Date(Date.parse(value));
    }
  });
  return obj;
}

/**
 * Iterates through all elements in the given list and executes `unmarshalDates()` on each of them
 *
 * @param   {Object[]} arr  The list of objects to load the dates for
 * @return  {Object[]}      The array - usable for assignments
 */
function unmarshalDatesInArray(arr) {
  _.forEach(arr, (row) => {
    unmarshalDates(row);
  });
  return arr;
}

/**
 * Returns the name for the given locale
 *
 * @param  {String} locale The locale to get the display name for
 * @return {String}        The name for the given locale
 */
function getLocaleName(locale) {
  let tnKey = `lang.${locale}`;
  let translation = i18nInstance.t(tnKey);
  return translation == tnKey ? i18nInstance.t('lang.Unknown') : translation;
}

/**
 * Returns a list of languages that can be selected sorted by their name
 *
 * @return {Object[]}  An array that contains each language as object with the properties `locale` and `name`
 */
function getLanguageList() {
  let ret = [];
  _.forEach(availableLanguages, (value) => {
    ret.push({locale: value, name: getLocaleName(value)});
  });
  return ret.sort((a, b) => {
    if (a.name == b.name) {
      return 0;
    }
    return a.name > b.name ? 1 : -1;
  });
}

/**
 * Returns a time string in the format hh:mm:ss (depending on length) for a given
 * duration in seconds
 * @param {Number} data The duration in seconds
 * @return {String} The time string
 */
function getTimeString(data) {
  data = data / 1000000000;
  let str = '';
  let hours = Math.floor(data / 3600);
  if (hours > 0) {
      str += _.padStart(hours, 2, '0') + ':';
  }
  data = data - (hours * 3600);
  let minutes = Math.floor((data / 60));
  if (str || minutes) {
      str += _.padStart(minutes, 2, '0') + ':';
  }
  data = data - (minutes * 60);
  // Seconds
  str += _.padStart(Math.round(data), 2, '0');
  return str;
}

/**
 * Calculates the wait time until a row will probably be played.
 * Depends on a local `currentDuration` property on the model that
 * is reset to `0` when the playlist is reloaded.
 * @param {Object} thisObj The current model of the vue component
 * @param {Number} titleDur Duration of the current title
 * @return {String} The wait time as string representation
 */
function getWaitTimeString(thisObj, titleDur) {
  let out = thisObj.currentDuration == 0 ?
    i18nInstance.t('misc.WaitTimeNone') :
    i18nInstance.t('misc.WaitTime', {time: getTimeString(thisObj.currentDuration)});
  thisObj.currentDuration += titleDur;
  return out;
}

export {init};
export {getWaitTimeString};
export {getTimeString};
export {unmarshalDates};
export {unmarshalDatesInArray};
export {getLocaleName};
export {getLanguageList};
