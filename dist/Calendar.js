"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _mergeClassNames = _interopRequireDefault(require("merge-class-names"));

var _Navigation = _interopRequireDefault(require("./Calendar/Navigation"));

var _CenturyView = _interopRequireDefault(require("./CenturyView"));

var _DecadeView = _interopRequireDefault(require("./DecadeView"));

var _YearView = _interopRequireDefault(require("./YearView"));

var _MonthView = _interopRequireDefault(require("./MonthView"));

var _dates = require("./shared/dates");

var _propTypes2 = require("./shared/propTypes");

var _utils = require("./shared/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var baseClassName = 'react-calendar';
var allViews = ['century', 'decade', 'year', 'month'];
var allValueTypes = [].concat(_toConsumableArray(allViews.slice(1)), ['day']);
/**
 * Returns views array with disallowed values cut off.
 */

var getLimitedViews = function getLimitedViews(minDetail, maxDetail) {
  return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
};
/**
 * Determines whether a given view is allowed with currently applied settings.
 */


var isViewAllowed = function isViewAllowed(view, minDetail, maxDetail) {
  var views = getLimitedViews(minDetail, maxDetail);
  return views.indexOf(view) !== -1;
};
/**
 * Gets either provided view if allowed by minDetail and maxDetail, or gets
 * the default view if not allowed.
 */


var getView = function getView(view, minDetail, maxDetail) {
  if (isViewAllowed(view, minDetail, maxDetail)) {
    return view;
  }

  return getLimitedViews(minDetail, maxDetail).pop();
};
/**
 * Returns value type that can be returned with currently applied settings.
 */


var getValueType = function getValueType(maxDetail) {
  return allValueTypes[allViews.indexOf(maxDetail)];
};

var getValueFrom = function getValueFrom(value) {
  if (!value) {
    return null;
  }

  var rawValueFrom = value instanceof Array && value.length === 2 ? value[0] : value;

  if (!rawValueFrom) {
    return null;
  }

  var valueFromDate = new Date(rawValueFrom);

  if (isNaN(valueFromDate.getTime())) {
    throw new Error("Invalid date: ".concat(value));
  }

  return valueFromDate;
};

var getDetailValueFrom = function getDetailValueFrom(value, minDate, maxDate, maxDetail) {
  var valueFrom = getValueFrom(value);

  if (!valueFrom) {
    return null;
  }

  var detailValueFrom = (0, _dates.getBegin)(getValueType(maxDetail), valueFrom);
  return (0, _utils.between)(detailValueFrom, minDate, maxDate);
};

var getValueTo = function getValueTo(value) {
  if (!value) {
    return null;
  }

  var rawValueTo = value instanceof Array && value.length === 2 ? value[1] : value;

  if (!rawValueTo) {
    return null;
  }

  var valueToDate = new Date(rawValueTo);

  if (isNaN(valueToDate.getTime())) {
    throw new Error("Invalid date: ".concat(value));
  }

  return valueToDate;
};

var getDetailValueTo = function getDetailValueTo(value, minDate, maxDate, maxDetail) {
  var valueTo = getValueTo(value);

  if (!valueTo) {
    return null;
  }

  var detailValueTo = (0, _dates.getEnd)(getValueType(maxDetail), valueTo);
  return (0, _utils.between)(detailValueTo, minDate, maxDate);
};

var getDetailValueArray = function getDetailValueArray(value, minDate, maxDate, maxDetail) {
  if (value instanceof Array) {
    return value;
  }

  return [getDetailValueFrom(value, minDate, maxDate, maxDetail), getDetailValueTo(value, minDate, maxDate, maxDetail)];
};

var getActiveStartDate = function getActiveStartDate(props) {
  var activeStartDate = props.activeStartDate,
      maxDate = props.maxDate,
      maxDetail = props.maxDetail,
      minDate = props.minDate,
      minDetail = props.minDetail,
      value = props.value,
      view = props.view;
  var rangeType = getView(view, minDetail, maxDetail);
  var valueFrom = (activeStartDate, getDetailValueFrom(value, minDate, maxDate, maxDetail) || new Date());
  return (0, _dates.getBegin)(rangeType, valueFrom);
};

var isSingleValue = function isSingleValue(value) {
  return value && [].concat(value).length === 1;
};

var Calendar =
/*#__PURE__*/
function (_Component) {
  _inherits(Calendar, _Component);

  function Calendar() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Calendar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Calendar)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      /* eslint-disable react/destructuring-assignment */
      activeStartDate: _this.props.defaultActiveStartDate || getActiveStartDate(_this.props),
      view: _this.props.defaultView,
      value: _this.props.defaultValue
      /* eslint-enable react/destructuring-assignment */

    });

    _defineProperty(_assertThisInitialized(_this), "setActiveStartDate", function (activeStartDate) {
      var onActiveStartDateChange = _this.props.onActiveStartDateChange;

      _this.setState({
        activeStartDate: activeStartDate
      }, function () {
        var _assertThisInitialize = _assertThisInitialized(_this),
            view = _assertThisInitialize.view;

        (0, _utils.callIfDefined)(onActiveStartDateChange, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setActiveStartDateAndView", function (activeStartDate, view) {
      var _this$props = _this.props,
          onActiveStartDateChange = _this$props.onActiveStartDateChange,
          onViewChange = _this$props.onViewChange;

      _this.setState({
        activeStartDate: activeStartDate,
        view: view
      }, function () {
        (0, _utils.callIfDefined)(onActiveStartDateChange, {
          activeStartDate: activeStartDate,
          view: view
        });
        (0, _utils.callIfDefined)(onViewChange, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "drillDown", function (nextActiveStartDate) {
      if (!_this.drillDownAvailable) {
        return;
      }

      var _assertThisInitialize2 = _assertThisInitialized(_this),
          view = _assertThisInitialize2.view;

      var _this$props2 = _this.props,
          maxDetail = _this$props2.maxDetail,
          minDetail = _this$props2.minDetail,
          onDrillDown = _this$props2.onDrillDown;
      var views = getLimitedViews(minDetail, maxDetail);
      var nextView = views[views.indexOf(view) + 1];

      _this.setActiveStartDateAndView(nextActiveStartDate, nextView);

      (0, _utils.callIfDefined)(onDrillDown, {
        activeStartDate: nextActiveStartDate,
        view: nextView
      });
    });

    _defineProperty(_assertThisInitialized(_this), "drillUp", function () {
      if (!_this.drillUpAvailable) {
        return;
      }

      var _assertThisInitialize3 = _assertThisInitialized(_this),
          activeStartDate = _assertThisInitialize3.activeStartDate,
          view = _assertThisInitialize3.view;

      var _this$props3 = _this.props,
          maxDetail = _this$props3.maxDetail,
          minDetail = _this$props3.minDetail,
          onDrillUp = _this$props3.onDrillUp;
      var views = getLimitedViews(minDetail, maxDetail);
      var nextView = views[views.indexOf(view) - 1];
      var nextActiveStartDate = (0, _dates.getBegin)(nextView, activeStartDate);

      _this.setActiveStartDateAndView(nextActiveStartDate, nextView);

      (0, _utils.callIfDefined)(onDrillUp, {
        activeStartDate: nextActiveStartDate,
        view: nextView
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function (value) {
      var _this$props4 = _this.props,
          onChange = _this$props4.onChange,
          selectRange = _this$props4.selectRange;
      var nextValue;
      var callback;

      if (selectRange) {
        var _assertThisInitialize4 = _assertThisInitialized(_this),
            previousValue = _assertThisInitialize4.value; // Range selection turned on


        if (!isSingleValue(previousValue)) {
          // Value has 0 or 2 elements - either way we're starting a new array
          // First value
          nextValue = (0, _dates.getBegin)(_this.valueType, value);
        } else {
          // Second value
          nextValue = (0, _dates.getValueRange)(_this.valueType, previousValue, value);

          callback = function callback() {
            return (0, _utils.callIfDefined)(onChange, nextValue);
          };
        }
      } else {
        // Range selection turned off
        nextValue = _this.getProcessedValue(value);

        callback = function callback() {
          return (0, _utils.callIfDefined)(onChange, nextValue);
        };
      }

      _this.setState({
        value: nextValue
      }, callback);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOver", function (value) {
      _this.setState(function (prevState) {
        if (prevState.hover && prevState.hover.getTime() === value.getTime()) {
          return null;
        }

        return {
          hover: value
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseLeave", function () {
      _this.setState({
        hover: null
      });
    });

    return _this;
  }

  _createClass(Calendar, [{
    key: "getProcessedValue",

    /**
     * Gets current value in a desired format.
     */
    value: function getProcessedValue(value) {
      var _this$props5 = this.props,
          minDate = _this$props5.minDate,
          maxDate = _this$props5.maxDate,
          maxDetail = _this$props5.maxDetail,
          returnValue = _this$props5.returnValue;

      var processFunction = function () {
        switch (returnValue) {
          case 'start':
            return getDetailValueFrom;

          case 'end':
            return getDetailValueTo;

          case 'range':
            return getDetailValueArray;

          default:
            throw new Error('Invalid returnValue.');
        }
      }();

      return processFunction(value, minDate, maxDate, maxDetail);
    }
    /**
     * Called when the user uses navigation buttons.
     */

  }, {
    key: "renderContent",
    value: function renderContent(next) {
      var currentActiveStartDate = this.activeStartDate,
          onMouseOver = this.onMouseOver,
          valueType = this.valueType,
          value = this.value,
          view = this.view;
      var _this$props6 = this.props,
          calendarType = _this$props6.calendarType,
          locale = _this$props6.locale,
          maxDate = _this$props6.maxDate,
          minDate = _this$props6.minDate,
          renderChildren = _this$props6.renderChildren,
          selectRange = _this$props6.selectRange,
          tileClassName = _this$props6.tileClassName,
          tileContent = _this$props6.tileContent,
          tileDisabled = _this$props6.tileDisabled;
      var hover = this.hover;
      var activeStartDate = next ? (0, _dates.getBeginNext)(view, currentActiveStartDate) : currentActiveStartDate;
      var commonProps = {
        activeStartDate: activeStartDate,
        hover: hover,
        locale: locale,
        maxDate: maxDate,
        minDate: minDate,
        onMouseOver: selectRange ? onMouseOver : null,
        tileClassName: tileClassName,
        tileContent: tileContent || renderChildren,
        // For backwards compatibility
        tileDisabled: tileDisabled,
        value: value,
        valueType: valueType
      };
      var clickAction = this.drillDownAvailable ? this.drillDown : this.onChange;

      switch (view) {
        case 'century':
          {
            var _this$props7 = this.props,
                formatYear = _this$props7.formatYear,
                onClickDecade = _this$props7.onClickDecade;
            return _react["default"].createElement(_CenturyView["default"], _extends({
              formatYear: formatYear,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickDecade)
            }, commonProps));
          }

        case 'decade':
          {
            var _this$props8 = this.props,
                _formatYear = _this$props8.formatYear,
                onClickYear = _this$props8.onClickYear;
            return _react["default"].createElement(_DecadeView["default"], _extends({
              formatYear: _formatYear,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickYear)
            }, commonProps));
          }

        case 'year':
          {
            var _this$props9 = this.props,
                formatMonth = _this$props9.formatMonth,
                onClickMonth = _this$props9.onClickMonth;
            return _react["default"].createElement(_YearView["default"], _extends({
              formatMonth: formatMonth,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickMonth)
            }, commonProps));
          }

        case 'month':
          {
            var _this$props10 = this.props,
                formatShortWeekday = _this$props10.formatShortWeekday,
                onClickDay = _this$props10.onClickDay,
                onClickWeekNumber = _this$props10.onClickWeekNumber,
                showDoubleView = _this$props10.showDoubleView,
                showFixedNumberOfWeeks = _this$props10.showFixedNumberOfWeeks,
                showNeighboringMonth = _this$props10.showNeighboringMonth,
                showWeekNumbers = _this$props10.showWeekNumbers;
            var onMouseLeave = this.onMouseLeave;
            return _react["default"].createElement(_MonthView["default"], _extends({
              calendarType: calendarType,
              formatShortWeekday: formatShortWeekday,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickDay),
              onClickWeekNumber: onClickWeekNumber,
              onMouseLeave: onMouseLeave,
              showFixedNumberOfWeeks: showFixedNumberOfWeeks || showDoubleView,
              showNeighboringMonth: showNeighboringMonth,
              showWeekNumbers: showWeekNumbers
            }, commonProps));
          }

        default:
          throw new Error("Invalid view: ".concat(view, "."));
      }
    }
  }, {
    key: "renderNavigation",
    value: function renderNavigation() {
      var showNavigation = this.props.showNavigation;

      if (!showNavigation) {
        return null;
      }

      var activeStartDate = this.activeStartDate,
          view = this.view;
      var _this$props11 = this.props,
          formatMonthYear = _this$props11.formatMonthYear,
          formatYear = _this$props11.formatYear,
          locale = _this$props11.locale,
          maxDate = _this$props11.maxDate,
          maxDetail = _this$props11.maxDetail,
          minDate = _this$props11.minDate,
          minDetail = _this$props11.minDetail,
          navigationAriaLabel = _this$props11.navigationAriaLabel,
          navigationLabel = _this$props11.navigationLabel,
          next2AriaLabel = _this$props11.next2AriaLabel,
          next2Label = _this$props11.next2Label,
          nextAriaLabel = _this$props11.nextAriaLabel,
          nextLabel = _this$props11.nextLabel,
          prev2AriaLabel = _this$props11.prev2AriaLabel,
          prev2Label = _this$props11.prev2Label,
          prevAriaLabel = _this$props11.prevAriaLabel,
          prevLabel = _this$props11.prevLabel,
          showDoubleView = _this$props11.showDoubleView,
          noArrowsNavigation = _this$props11.noArrowsNavigation,
          noSecondNavigation = _this$props11.noSecondNavigation;
      return _react["default"].createElement(_Navigation["default"], {
        noArrowsNavigation: noArrowsNavigation,
        noSecondNavigation: noSecondNavigation,
        activeStartDate: activeStartDate,
        drillUp: this.drillUp,
        formatMonthYear: formatMonthYear,
        formatYear: formatYear,
        locale: locale,
        maxDate: maxDate,
        minDate: minDate,
        navigationAriaLabel: navigationAriaLabel,
        navigationLabel: navigationLabel,
        next2AriaLabel: next2AriaLabel,
        next2Label: next2Label,
        nextAriaLabel: nextAriaLabel,
        nextLabel: nextLabel,
        prev2AriaLabel: prev2AriaLabel,
        prev2Label: prev2Label,
        prevAriaLabel: prevAriaLabel,
        prevLabel: prevLabel,
        setActiveStartDate: this.setActiveStartDate,
        showDoubleView: showDoubleView,
        view: view,
        views: getLimitedViews(minDetail, maxDetail)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props12 = this.props,
          className = _this$props12.className,
          selectRange = _this$props12.selectRange,
          showDoubleView = _this$props12.showDoubleView;
      var onMouseLeave = this.onMouseLeave,
          value = this.value;
      var valueArray = [].concat(value);
      return _react["default"].createElement("div", {
        className: (0, _mergeClassNames["default"])(baseClassName, selectRange && valueArray.length === 1 && "".concat(baseClassName, "--selectRange"), showDoubleView && "".concat(baseClassName, "--doubleView"), className)
      }, this.renderNavigation(), _react["default"].createElement("div", {
        className: "".concat(baseClassName, "__viewContainer"),
        onBlur: selectRange ? onMouseLeave : null,
        onMouseLeave: selectRange ? onMouseLeave : null
      }, this.renderContent(), showDoubleView && this.renderContent(true)));
    }
  }, {
    key: "activeStartDate",
    get: function get() {
      var activeStartDateProps = this.props.activeStartDate;
      var activeStartDateState = this.state.activeStartDate;
      return activeStartDateProps || activeStartDateState;
    }
  }, {
    key: "value",
    get: function get() {
      var _this$props13 = this.props,
          selectRange = _this$props13.selectRange,
          valueProps = _this$props13.value;
      var valueState = this.state.value; // In the middle of range selection, use value from state

      if (selectRange && isSingleValue(valueState)) {
        return valueState;
      }

      return valueProps || valueState;
    }
  }, {
    key: "valueType",
    get: function get() {
      var maxDetail = this.props.maxDetail;
      return getValueType(maxDetail);
    }
  }, {
    key: "view",
    get: function get() {
      var _this$props14 = this.props,
          minDetail = _this$props14.minDetail,
          maxDetail = _this$props14.maxDetail,
          viewProps = _this$props14.view;
      var viewState = this.state.view;
      return getView(viewProps || viewState, minDetail, maxDetail);
    }
  }, {
    key: "hover",
    get: function get() {
      var selectRange = this.props.selectRange;
      var hover = this.state.hover;
      return selectRange ? hover : null;
    }
  }, {
    key: "drillDownAvailable",
    get: function get() {
      var view = this.view;
      var _this$props15 = this.props,
          maxDetail = _this$props15.maxDetail,
          minDetail = _this$props15.minDetail;
      var views = getLimitedViews(minDetail, maxDetail);
      return views.indexOf(view) < views.length - 1;
    }
  }, {
    key: "drillUpAvailable",
    get: function get() {
      var view = this.view;
      var _this$props16 = this.props,
          maxDetail = _this$props16.maxDetail,
          minDetail = _this$props16.minDetail;
      var views = getLimitedViews(minDetail, maxDetail);
      return views.indexOf(view) > 0;
    }
  }]);

  return Calendar;
}(_react.Component);

exports["default"] = Calendar;
Calendar.defaultProps = {
  maxDetail: 'month',
  minDetail: 'century',
  returnValue: 'start',
  showNavigation: true,
  showNeighboringMonth: true
};

var isActiveStartDate = _propTypes["default"].instanceOf(Date);

var isLooseValue = _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes2.isValue]);

Calendar.propTypes = {
  activeStartDate: isActiveStartDate,
  calendarType: _propTypes2.isCalendarType,
  className: _propTypes2.isClassName,
  defaultActiveStartDate: isActiveStartDate,
  defaultValue: isLooseValue,
  defaultView: _propTypes2.isView,
  formatMonth: _propTypes["default"].func,
  formatMonthYear: _propTypes["default"].func,
  formatShortWeekday: _propTypes["default"].func,
  formatYear: _propTypes["default"].func,
  locale: _propTypes["default"].string,
  maxDate: _propTypes2.isMaxDate,
  maxDetail: _propTypes["default"].oneOf(allViews),
  minDate: _propTypes2.isMinDate,
  minDetail: _propTypes["default"].oneOf(allViews),
  navigationAriaLabel: _propTypes["default"].string,
  navigationLabel: _propTypes["default"].func,
  next2AriaLabel: _propTypes["default"].string,
  next2Label: _propTypes["default"].node,
  nextAriaLabel: _propTypes["default"].string,
  nextLabel: _propTypes["default"].node,
  onActiveStartDateChange: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  onClickDay: _propTypes["default"].func,
  onClickDecade: _propTypes["default"].func,
  onClickMonth: _propTypes["default"].func,
  onClickWeekNumber: _propTypes["default"].func,
  onClickYear: _propTypes["default"].func,
  onDrillDown: _propTypes["default"].func,
  onDrillUp: _propTypes["default"].func,
  onViewChange: _propTypes["default"].func,
  prev2AriaLabel: _propTypes["default"].string,
  prev2Label: _propTypes["default"].node,
  prevAriaLabel: _propTypes["default"].string,
  prevLabel: _propTypes["default"].node,
  renderChildren: _propTypes["default"].func,
  // For backwards compatibility
  returnValue: _propTypes["default"].oneOf(['start', 'end', 'range']),
  selectRange: _propTypes["default"].bool,
  showDoubleView: _propTypes["default"].bool,
  showFixedNumberOfWeeks: _propTypes["default"].bool,
  showNavigation: _propTypes["default"].bool,
  showNeighboringMonth: _propTypes["default"].bool,
  showWeekNumbers: _propTypes["default"].bool,
  tileClassName: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes2.isClassName]),
  tileContent: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].node]),
  tileDisabled: _propTypes["default"].func,
  value: isLooseValue,
  view: _propTypes2.isView
};