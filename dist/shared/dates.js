"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getMonthIndex = getMonthIndex;
exports.getDay = getDay;
exports.getDayOfWeek = getDayOfWeek;
exports.getBeginOfCenturyYear = getBeginOfCenturyYear;
exports.getBeginOfCentury = getBeginOfCentury;
exports.getBeginOfDecadeYear = getBeginOfDecadeYear;
exports.getBeginOfDecade = getBeginOfDecade;
exports.getEndOfDecade = getEndOfDecade;
exports.getBeginOfYear = getBeginOfYear;
exports.getBeginOfMonth = getBeginOfMonth;
exports.getBeginOfWeek = getBeginOfWeek;
exports.getWeekNumber = getWeekNumber;
exports.getBeginOfDay = getBeginOfDay;
exports.getEndOfDay = getEndOfDay;
exports.getBegin = getBegin;
exports.getBeginPrevious = getBeginPrevious;
exports.getBeginNext = getBeginNext;
exports.getEnd = getEnd;
exports.getEndPrevious = getEndPrevious;
exports.getRange = getRange;
exports.getValueRange = getValueRange;
exports.getDaysInMonth = getDaysInMonth;
exports.getCenturyLabel = getCenturyLabel;
exports.getDecadeLabel = getDecadeLabel;
exports.isWeekend = isWeekend;
exports.getISOLocalMonth = getISOLocalMonth;
exports.getISOLocalDate = getISOLocalDate;
exports.getEndPrevious2 = exports.getBeginNext2 = exports.getBeginPrevious2 = exports.getDayRange = exports.getMonthRange = exports.getEndOfNextMonth = exports.getEndOfPreviousMonth = exports.getEndOfMonth = exports.getBeginOfNextMonth = exports.getBeginOfPreviousMonth = exports.getYearRange = exports.getEndOfNextYear = exports.getEndOfPreviousYear = exports.getEndOfYear = exports.getBeginOfNextYear = exports.getBeginOfPreviousYear = exports.getDecadeRange = exports.getEndOfNextDecade = exports.getEndOfPreviousDecade = exports.getBeginOfNextDecade = exports.getBeginOfPreviousDecade = exports.getCenturyRange = exports.getEndOfNextCentury = exports.getEndOfPreviousCentury = exports.getEndOfCentury = exports.getBeginOfNextCentury = exports.getBeginOfPreviousCentury = void 0;

var _const = require("./const");

var _dateFormatter = require("./dateFormatter");

var SUNDAY = _const.WEEKDAYS[0];
var FRIDAY = _const.WEEKDAYS[5];
var SATURDAY = _const.WEEKDAYS[6];

function isValidDate(date) {
  return !isNaN(date.getTime());
}

function makeGetRange(functions) {
  return function makeGetRangeInternal(date) {
    return functions.map(function (fn) {
      return fn(date);
    });
  };
}

function makeGetEnd(getBeginOfNextPeriod) {
  return function makeGetEndInternal(date) {
    return new Date(getBeginOfNextPeriod(date).getTime() - 1);
  };
}

function makeGetEdgeOfNeighbor(getPeriod, getEdgeOfPeriod, defaultOffset) {
  return function makeGetEdgeOfNeighborInternal(date) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOffset;
    var previousPeriod = getPeriod(date) + offset;
    return getEdgeOfPeriod(previousPeriod);
  };
}
/* Simple getters - getting a property of a given point in time */


function getYear(date) {
  if (date instanceof Date) {
    return date.getFullYear();
  }

  if (typeof date === 'number') {
    return date;
  }

  var year = parseInt(date, 10);

  if (typeof date === 'string' && !isNaN(year)) {
    return year;
  }

  throw new Error("Failed to get year from date: ".concat(date, "."));
}

function getMonth(date) {
  return date.getMonth() + 1;
}

function getMonthIndex(date) {
  return date.getMonth();
}

function getDay(date) {
  return date.getDate();
}

function getDayOfWeek(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _const.CALENDAR_TYPES.ISO_8601;
  var weekday = date.getDay();

  switch (calendarType) {
    case _const.CALENDAR_TYPES.ISO_8601:
      // Shifts days of the week so that Monday is 0, Sunday is 6
      return (weekday + 6) % 7;

    case _const.CALENDAR_TYPES.ARABIC:
      return (weekday + 1) % 7;

    case _const.CALENDAR_TYPES.HEBREW:
    case _const.CALENDAR_TYPES.US:
      return weekday;

    default:
      throw new Error('Unsupported calendar type.');
  }
}
/**
 * Century
 */


function getBeginOfCenturyYear(date) {
  var year = getYear(date) - 1;
  return year + -year % 100 + 1;
}

function getBeginOfCentury(date) {
  var beginOfCenturyYear = getBeginOfCenturyYear(date);
  return new Date(beginOfCenturyYear, 0, 1);
}

var getBeginOfPreviousCentury = makeGetEdgeOfNeighbor(getYear, getBeginOfCentury, -100);
exports.getBeginOfPreviousCentury = getBeginOfPreviousCentury;
var getBeginOfNextCentury = makeGetEdgeOfNeighbor(getYear, getBeginOfCentury, 100);
exports.getBeginOfNextCentury = getBeginOfNextCentury;
var getEndOfCentury = makeGetEnd(getBeginOfNextCentury);
exports.getEndOfCentury = getEndOfCentury;
var getEndOfPreviousCentury = makeGetEdgeOfNeighbor(getYear, getEndOfCentury, -100);
exports.getEndOfPreviousCentury = getEndOfPreviousCentury;
var getEndOfNextCentury = makeGetEdgeOfNeighbor(getYear, getEndOfCentury, 100);
exports.getEndOfNextCentury = getEndOfNextCentury;
var getCenturyRange = makeGetRange([getBeginOfCentury, getEndOfCentury]);
/**
 * Decade
 */

exports.getCenturyRange = getCenturyRange;

function getBeginOfDecadeYear(date) {
  var year = getYear(date) - 1;
  return year + -year % 10 + 1;
}

function getBeginOfDecade(date) {
  var beginOfDecadeYear = getBeginOfDecadeYear(date);
  return new Date(beginOfDecadeYear, 0, 1);
}

var getBeginOfPreviousDecade = makeGetEdgeOfNeighbor(getBeginOfDecadeYear, getBeginOfDecade, -10);
exports.getBeginOfPreviousDecade = getBeginOfPreviousDecade;
var getBeginOfNextDecade = makeGetEdgeOfNeighbor(getBeginOfDecadeYear, getBeginOfDecade, 10);
exports.getBeginOfNextDecade = getBeginOfNextDecade;

function getEndOfDecade(date) {
  var beginOfDecadeYear = getBeginOfDecadeYear(date);
  return new Date(beginOfDecadeYear + 10, 0, 1, 0, 0, 0, -1);
}

var getEndOfPreviousDecade = makeGetEdgeOfNeighbor(getBeginOfDecadeYear, getEndOfDecade, -10);
exports.getEndOfPreviousDecade = getEndOfPreviousDecade;
var getEndOfNextDecade = makeGetEdgeOfNeighbor(getBeginOfDecadeYear, getEndOfDecade, 10);
exports.getEndOfNextDecade = getEndOfNextDecade;
var getDecadeRange = makeGetRange([getBeginOfDecade, getEndOfDecade]);
/**
 * Year
 */

exports.getDecadeRange = getDecadeRange;

function getBeginOfYear(date) {
  var year = getYear(date);
  return new Date(year, 0, 1);
}

var getBeginOfPreviousYear = makeGetEdgeOfNeighbor(getYear, getBeginOfYear, -1);
exports.getBeginOfPreviousYear = getBeginOfPreviousYear;
var getBeginOfNextYear = makeGetEdgeOfNeighbor(getYear, getBeginOfYear, 1);
exports.getBeginOfNextYear = getBeginOfNextYear;
var getEndOfYear = makeGetEnd(getBeginOfNextYear);
exports.getEndOfYear = getEndOfYear;
var getEndOfPreviousYear = makeGetEdgeOfNeighbor(getYear, getEndOfYear, -1);
exports.getEndOfPreviousYear = getEndOfPreviousYear;
var getEndOfNextYear = makeGetEdgeOfNeighbor(getYear, getEndOfYear, 1);
exports.getEndOfNextYear = getEndOfNextYear;
var getYearRange = makeGetRange([getBeginOfYear, getEndOfYear]);
/**
 * Month
 */

exports.getYearRange = getYearRange;

function makeGetEdgeOfNeighborMonth(getEdgeOfPeriod, defaultOffset) {
  return function getBeginOfPreviousMonth(date) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOffset;
    var year = getYear(date);
    var previousMonthIndex = getMonthIndex(date) + offset;
    var previousMonth = new Date(year, previousMonthIndex, 1);
    return getEdgeOfPeriod(previousMonth);
  };
}

function getBeginOfMonth(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  return new Date(year, monthIndex, 1);
}

var getBeginOfPreviousMonth = makeGetEdgeOfNeighborMonth(getBeginOfMonth, -1);
exports.getBeginOfPreviousMonth = getBeginOfPreviousMonth;
var getBeginOfNextMonth = makeGetEdgeOfNeighborMonth(getBeginOfMonth, 1);
exports.getBeginOfNextMonth = getBeginOfNextMonth;
var getEndOfMonth = makeGetEnd(getBeginOfNextMonth);
exports.getEndOfMonth = getEndOfMonth;
var getEndOfPreviousMonth = makeGetEdgeOfNeighborMonth(getEndOfMonth, -1);
exports.getEndOfPreviousMonth = getEndOfPreviousMonth;
var getEndOfNextMonth = makeGetEdgeOfNeighborMonth(getEndOfMonth, 1);
exports.getEndOfNextMonth = getEndOfNextMonth;
var getMonthRange = makeGetRange([getBeginOfMonth, getEndOfMonth]);
/**
 * Week
 */

/**
 * Returns the beginning of a given week.
 *
 * @param {Date} date Date.
 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
 */

exports.getMonthRange = getMonthRange;

function getBeginOfWeek(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _const.CALENDAR_TYPES.ISO_8601;
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  var day = date.getDate() - getDayOfWeek(date, calendarType);
  return new Date(year, monthIndex, day);
}
/**
 * Gets week number according to ISO 8601 or US standard.
 * In ISO 8601, Arabic and Hebrew week 1 is the one with January 4.
 * In US calendar week 1 is the one with January 1.
 *
 * @param {Date} date Date.
 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
 */


function getWeekNumber(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _const.CALENDAR_TYPES.ISO_8601;
  var calendarTypeForWeekNumber = calendarType === _const.CALENDAR_TYPES.US ? _const.CALENDAR_TYPES.US : _const.CALENDAR_TYPES.ISO_8601;
  var beginOfWeek = getBeginOfWeek(date, calendarTypeForWeekNumber);
  var year = getYear(date) + 1;
  var dayInWeekOne;
  var beginOfFirstWeek; // Look for the first week one that does not come after a given date

  do {
    dayInWeekOne = new Date(year, 0, calendarTypeForWeekNumber === _const.CALENDAR_TYPES.ISO_8601 ? 4 : 1);
    beginOfFirstWeek = getBeginOfWeek(dayInWeekOne, calendarTypeForWeekNumber);
    year -= 1;
  } while (date - beginOfFirstWeek < 0);

  return Math.round((beginOfWeek - beginOfFirstWeek) / (8.64e7 * 7)) + 1;
}
/**
 * Day
 */


function getBeginOfDay(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  var day = getDay(date);
  return new Date(year, monthIndex, day);
}

function getEndOfDay(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  var day = getDay(date);
  return new Date(year, monthIndex, day + 1, 0, 0, 0, -1);
}

var getDayRange = makeGetRange([getBeginOfDay, getEndOfDay]);
/**
 * Others
 */

/**
 * Returns the beginning of a given range.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */

exports.getDayRange = getDayRange;

function getBegin(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getBeginOfCentury(date);

    case 'decade':
      return getBeginOfDecade(date);

    case 'year':
      return getBeginOfYear(date);

    case 'month':
      return getBeginOfMonth(date);

    case 'day':
      return getBeginOfDay(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

function getBeginPrevious(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getBeginOfPreviousCentury(date);

    case 'decade':
      return getBeginOfPreviousDecade(date);

    case 'year':
      return getBeginOfPreviousYear(date);

    case 'month':
      return getBeginOfPreviousMonth(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

function getBeginNext(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getBeginOfNextCentury(date);

    case 'decade':
      return getBeginOfNextDecade(date);

    case 'year':
      return getBeginOfNextYear(date);

    case 'month':
      return getBeginOfNextMonth(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

var getBeginPrevious2 = function getBeginPrevious2(rangeType, date) {
  switch (rangeType) {
    case 'decade':
      return getBeginOfPreviousDecade(date, -100);

    case 'year':
      return getBeginOfPreviousYear(date, -10);

    case 'month':
      return getBeginOfPreviousMonth(date, -12);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
};

exports.getBeginPrevious2 = getBeginPrevious2;

var getBeginNext2 = function getBeginNext2(rangeType, date) {
  switch (rangeType) {
    case 'decade':
      return getBeginOfNextDecade(date, 100);

    case 'year':
      return getBeginOfNextYear(date, 10);

    case 'month':
      return getBeginOfNextMonth(date, 12);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
};
/**
 * Returns the end of a given range.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */


exports.getBeginNext2 = getBeginNext2;

function getEnd(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getEndOfCentury(date);

    case 'decade':
      return getEndOfDecade(date);

    case 'year':
      return getEndOfYear(date);

    case 'month':
      return getEndOfMonth(date);

    case 'day':
      return getEndOfDay(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

function getEndPrevious(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getEndOfPreviousCentury(date);

    case 'decade':
      return getEndOfPreviousDecade(date);

    case 'year':
      return getEndOfPreviousYear(date);

    case 'month':
      return getEndOfPreviousMonth(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

var getEndPrevious2 = function getEndPrevious2(rangeType, date) {
  switch (rangeType) {
    case 'decade':
      return getEndOfPreviousDecade(date, -100);

    case 'year':
      return getEndOfPreviousYear(date, -10);

    case 'month':
      return getEndOfPreviousMonth(date, -12);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
};
/**
 * Returns an array with the beginning and the end of a given range.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */


exports.getEndPrevious2 = getEndPrevious2;

function getRange(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getCenturyRange(date);

    case 'decade':
      return getDecadeRange(date);

    case 'year':
      return getYearRange(date);

    case 'month':
      return getMonthRange(date);

    case 'day':
      return getDayRange(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}
/**
 * Creates a range out of two values, ensuring they are in order and covering entire period ranges.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date1 First date.
 * @param {Date} date2 Second date.
 */


function getValueRange(rangeType, date1, date2) {
  var rawNextValue = [date1, date2].sort(function (a, b) {
    return a - b;
  });
  return [getBegin(rangeType, rawNextValue[0]), getEnd(rangeType, rawNextValue[1])];
}
/**
 * Returns a number of days in a month of a given date.
 *
 * @param {Date} date Date.
 */


function getDaysInMonth(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  return new Date(year, monthIndex + 1, 0).getDate();
}

function toYearLabel(locale) {
  var formatYear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _dateFormatter.formatYear;
  var dates = arguments.length > 2 ? arguments[2] : undefined;
  return dates.map(function (date) {
    return formatYear(locale, date);
  }).join(' – ');
}
/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2001-2100.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */


function getCenturyLabel(locale, formatYear, date) {
  return toYearLabel(locale, formatYear, getCenturyRange(date));
}
/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2011-2020.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */


function getDecadeLabel(locale, formatYear, date) {
  return toYearLabel(locale, formatYear, getDecadeRange(date));
}
/**
 * Returns a boolean determining whether a given date is on Saturday or Sunday.
 *
 * @param {Date} date Date.
 */


function isWeekend(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _const.CALENDAR_TYPES.ISO_8601;
  var weekday = date.getDay();

  switch (calendarType) {
    case _const.CALENDAR_TYPES.ARABIC:
    case _const.CALENDAR_TYPES.HEBREW:
      return weekday === FRIDAY || weekday === SATURDAY;

    case _const.CALENDAR_TYPES.ISO_8601:
    case _const.CALENDAR_TYPES.US:
      return weekday === SATURDAY || weekday === SUNDAY;

    default:
      throw new Error('Unsupported calendar type.');
  }
}
/**
 * Returns local month in ISO-like format (YYYY-MM).
 */


function getISOLocalMonth(value) {
  if (!value) {
    return value;
  }

  var date = new Date(value);

  if (!isValidDate(date)) {
    throw new Error("Invalid date: ".concat(value));
  }

  var year = getYear(date);
  var month = "0".concat(getMonth(date)).slice(-2);
  return "".concat(year, "-").concat(month);
}
/**
 * Returns local date in ISO-like format (YYYY-MM-DD).
 */


function getISOLocalDate(value) {
  if (!value) {
    return value;
  }

  var date = new Date(value);

  if (!isValidDate(date)) {
    throw new Error("Invalid date: ".concat(value));
  }

  var year = getYear(date);
  var month = "0".concat(getMonth(date)).slice(-2);
  var day = "0".concat(getDay(date)).slice(-2);
  return "".concat(year, "-").concat(month, "-").concat(day);
}