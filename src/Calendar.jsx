import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import Navigation from './Calendar/Navigation';
import CenturyView from './CenturyView';
import DecadeView from './DecadeView';
import YearView from './YearView';
import MonthView from './MonthView';

import {
  getBegin, getBeginNext, getEnd, getValueRange,
} from './shared/dates';
import {
  isCalendarType, isClassName, isMaxDate, isMinDate, isValue, isView,
} from './shared/propTypes';
import { between, callIfDefined, mergeFunctions } from './shared/utils';

const baseClassName = 'react-calendar';
const allViews = ['century', 'decade', 'year', 'month'];
const allValueTypes = [...allViews.slice(1), 'day'];

/**
 * Returns views array with disallowed values cut off.
 */
const getLimitedViews = (minDetail, maxDetail) => allViews
  .slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);

/**
 * Determines whether a given view is allowed with currently applied settings.
 */
const isViewAllowed = (view, minDetail, maxDetail) => {
  const views = getLimitedViews(minDetail, maxDetail);

  return views.indexOf(view) !== -1;
};

/**
 * Gets either provided view if allowed by minDetail and maxDetail, or gets
 * the default view if not allowed.
 */
const getView = (view, minDetail, maxDetail) => {
  if (isViewAllowed(view, minDetail, maxDetail)) {
    return view;
  }

  return getLimitedViews(minDetail, maxDetail).pop();
};

/**
 * Returns value type that can be returned with currently applied settings.
 */
const getValueType = maxDetail => allValueTypes[allViews.indexOf(maxDetail)];

const getValueFrom = (value) => {
  if (!value) {
    return null;
  }

  const rawValueFrom = value instanceof Array && value.length === 2 ? value[0] : value;

  if (!rawValueFrom) {
    return null;
  }

  const valueFromDate = new Date(rawValueFrom);

  if (isNaN(valueFromDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueFromDate;
};

const getDetailValueFrom = (value, minDate, maxDate, maxDetail) => {
  const valueFrom = getValueFrom(value);

  if (!valueFrom) {
    return null;
  }

  const detailValueFrom = getBegin(getValueType(maxDetail), valueFrom);

  return between(detailValueFrom, minDate, maxDate);
};

const getValueTo = (value) => {
  if (!value) {
    return null;
  }

  const rawValueTo = value instanceof Array && value.length === 2 ? value[1] : value;

  if (!rawValueTo) {
    return null;
  }

  const valueToDate = new Date(rawValueTo);

  if (isNaN(valueToDate.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return valueToDate;
};

const getDetailValueTo = (value, minDate, maxDate, maxDetail) => {
  const valueTo = getValueTo(value);

  if (!valueTo) {
    return null;
  }

  const detailValueTo = getEnd(getValueType(maxDetail), valueTo);

  return between(detailValueTo, minDate, maxDate);
};

const getDetailValueArray = (value, minDate, maxDate, maxDetail) => {
  if (value instanceof Array) {
    return value;
  }

  return [
    getDetailValueFrom(value, minDate, maxDate, maxDetail),
    getDetailValueTo(value, minDate, maxDate, maxDetail),
  ];
};

const getActiveStartDate = (props) => {
  const {
    activeStartDate,
    maxDate,
    maxDetail,
    minDate,
    minDetail,
    value,
    view,
  } = props;

  const rangeType = getView(view, minDetail, maxDetail);
  const valueFrom = (
    activeStartDate,
    getDetailValueFrom(value, minDate, maxDate, maxDetail)
    || new Date()
  );
  return getBegin(rangeType, valueFrom);
};

const isSingleValue = value => value && [].concat(value).length === 1;

export default class Calendar extends Component {
  state = {
    /* eslint-disable react/destructuring-assignment */
    activeStartDate: this.props.defaultActiveStartDate || getActiveStartDate(this.props),
    view: this.props.defaultView,
    value: this.props.defaultValue,
    /* eslint-enable react/destructuring-assignment */
  };

  get activeStartDate() {
    const { activeStartDate: activeStartDateProps } = this.props;
    const { activeStartDate: activeStartDateState } = this.state;

    return activeStartDateProps || activeStartDateState;
  }

  get value() {
    const { selectRange, value: valueProps } = this.props;
    const { value: valueState } = this.state;

    // In the middle of range selection, use value from state
    if (selectRange && isSingleValue(valueState)) {
      return valueState;
    }

    return valueProps || valueState;
  }

  get valueType() {
    const { maxDetail } = this.props;

    return getValueType(maxDetail);
  }

  get view() {
    const { minDetail, maxDetail, view: viewProps } = this.props;
    const { view: viewState } = this.state;

    return getView(viewProps || viewState, minDetail, maxDetail);
  }

  get hover() {
    const { selectRange } = this.props;
    const { hover } = this.state;

    return selectRange ? hover : null;
  }

  get drillDownAvailable() {
    const { view } = this;
    const { maxDetail, minDetail } = this.props;

    const views = getLimitedViews(minDetail, maxDetail);

    return views.indexOf(view) < views.length - 1;
  }

  get drillUpAvailable() {
    const { view } = this;
    const { maxDetail, minDetail } = this.props;

    const views = getLimitedViews(minDetail, maxDetail);

    return views.indexOf(view) > 0;
  }

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value) {
    const {
      minDate, maxDate, maxDetail, returnValue,
    } = this.props;

    const processFunction = (() => {
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
    })();

    return processFunction(value, minDate, maxDate, maxDetail);
  }

  /**
   * Called when the user uses navigation buttons.
   */
  setActiveStartDate = (activeStartDate) => {
    const { onActiveStartDateChange } = this.props;

    this.setState({ activeStartDate }, () => {
      const { view } = this;

      callIfDefined(onActiveStartDateChange, {
        activeStartDate,
        view,
      });
    });
  }

  /**
   * Called when the user uses navigation buttons.
   */
  setActiveStartDateAndView = (activeStartDate, view) => {
    const { onActiveStartDateChange, onViewChange } = this.props;

    this.setState({ activeStartDate, view }, () => {
      callIfDefined(onActiveStartDateChange, {
        activeStartDate,
        view,
      });
      callIfDefined(onViewChange, {
        activeStartDate,
        view,
      });
    });
  }

  drillDown = (nextActiveStartDate) => {
    if (!this.drillDownAvailable) {
      return;
    }

    const { view } = this;
    const { maxDetail, minDetail, onDrillDown } = this.props;

    const views = getLimitedViews(minDetail, maxDetail);

    const nextView = views[views.indexOf(view) + 1];

    this.setActiveStartDateAndView(nextActiveStartDate, nextView);

    callIfDefined(onDrillDown, {
      activeStartDate: nextActiveStartDate,
      view: nextView,
    });
  }

  drillUp = () => {
    if (!this.drillUpAvailable) {
      return;
    }

    const { activeStartDate, view } = this;
    const { maxDetail, minDetail, onDrillUp } = this.props;

    const views = getLimitedViews(minDetail, maxDetail);

    const nextView = views[views.indexOf(view) - 1];
    const nextActiveStartDate = getBegin(nextView, activeStartDate);

    this.setActiveStartDateAndView(nextActiveStartDate, nextView);

    callIfDefined(onDrillUp, {
      activeStartDate: nextActiveStartDate,
      view: nextView,
    });
  }

  onChange = (value) => {
    const { onChange, selectRange } = this.props;

    let nextValue;
    let callback;
    if (selectRange) {
      const { value: previousValue } = this;
      // Range selection turned on
      if (!isSingleValue(previousValue)) {
        // Value has 0 or 2 elements - either way we're starting a new array
        // First value
        nextValue = getBegin(this.valueType, value);
      } else {
        // Second value
        nextValue = getValueRange(this.valueType, previousValue, value);
        callback = () => callIfDefined(onChange, nextValue);
      }
    } else {
      // Range selection turned off
      nextValue = this.getProcessedValue(value);
      callback = () => callIfDefined(onChange, nextValue);
    }

    this.setState({ value: nextValue }, callback);
  }

  onMouseOver = (value) => {
    this.setState((prevState) => {
      if (prevState.hover && (prevState.hover.getTime() === value.getTime())) {
        return null;
      }

      return { hover: value };
    });
  }

  onMouseLeave = () => {
    this.setState({ hover: null });
  }

  renderContent(next) {
    const {
      activeStartDate: currentActiveStartDate,
      onMouseOver,
      valueType,
      value,
      view,
    } = this;
    const {
      calendarType,
      locale,
      maxDate,
      minDate,
      renderChildren,
      selectRange,
      tileClassName,
      tileContent,
      tileDisabled,
    } = this.props;
    const { hover } = this;

    const activeStartDate = (
      next
        ? getBeginNext(view, currentActiveStartDate)
        : currentActiveStartDate
    );

    const commonProps = {
      activeStartDate,
      hover,
      locale,
      maxDate,
      minDate,
      onMouseOver: selectRange ? onMouseOver : null,
      tileClassName,
      tileContent: tileContent || renderChildren, // For backwards compatibility
      tileDisabled,
      value,
      valueType,
    };

    const clickAction = this.drillDownAvailable ? this.drillDown : this.onChange;

    switch (view) {
      case 'century': {
        const { formatYear, onClickDecade } = this.props;

        return (
          <CenturyView
            formatYear={formatYear}
            onClick={mergeFunctions(clickAction, onClickDecade)}
            {...commonProps}
          />
        );
      }
      case 'decade': {
        const { formatYear, onClickYear } = this.props;

        return (
          <DecadeView
            formatYear={formatYear}
            onClick={mergeFunctions(clickAction, onClickYear)}
            {...commonProps}
          />
        );
      }
      case 'year': {
        const { formatMonth, onClickMonth } = this.props;

        return (
          <YearView
            formatMonth={formatMonth}
            onClick={mergeFunctions(clickAction, onClickMonth)}
            {...commonProps}
          />
        );
      }
      case 'month': {
        const {
          formatShortWeekday,
          onClickDay,
          onClickWeekNumber,
          showDoubleView,
          showFixedNumberOfWeeks,
          showNeighboringMonth,
          showWeekNumbers,
        } = this.props;
        const { onMouseLeave } = this;

        return (
          <MonthView
            calendarType={calendarType}
            formatShortWeekday={formatShortWeekday}
            onClick={mergeFunctions(clickAction, onClickDay)}
            onClickWeekNumber={onClickWeekNumber}
            onMouseLeave={onMouseLeave}
            showFixedNumberOfWeeks={showFixedNumberOfWeeks || showDoubleView}
            showNeighboringMonth={showNeighboringMonth}
            showWeekNumbers={showWeekNumbers}
            {...commonProps}
          />
        );
      }
      default:
        throw new Error(`Invalid view: ${view}.`);
    }
  }

  renderNavigation() {
    const { showNavigation } = this.props;

    if (!showNavigation) {
      return null;
    }

    const { activeStartDate, view } = this;
    const {
      formatMonthYear,
      formatYear,
      locale,
      maxDate,
      maxDetail,
      minDate,
      minDetail,
      navigationAriaLabel,
      navigationLabel,
      next2AriaLabel,
      next2Label,
      nextAriaLabel,
      nextLabel,
      prev2AriaLabel,
      prev2Label,
      prevAriaLabel,
      prevLabel,
      showDoubleView,
      noArrowsNavigation,
      noSecondNavigation
    } = this.props;

    return (
      <Navigation
        noArrowsNavigation={noArrowsNavigation}
        noSecondNavigation={noSecondNavigation}
        activeStartDate={activeStartDate}
        drillUp={this.drillUp}
        formatMonthYear={formatMonthYear}
        formatYear={formatYear}
        locale={locale}
        maxDate={maxDate}
        minDate={minDate}
        navigationAriaLabel={navigationAriaLabel}
        navigationLabel={navigationLabel}
        next2AriaLabel={next2AriaLabel}
        next2Label={next2Label}
        nextAriaLabel={nextAriaLabel}
        nextLabel={nextLabel}
        prev2AriaLabel={prev2AriaLabel}
        prev2Label={prev2Label}
        prevAriaLabel={prevAriaLabel}
        prevLabel={prevLabel}
        setActiveStartDate={this.setActiveStartDate}
        showDoubleView={showDoubleView}
        view={view}
        views={getLimitedViews(minDetail, maxDetail)}
      />
    );
  }

  render() {
    const { className, selectRange, showDoubleView } = this.props;
    const { onMouseLeave, value } = this;
    const valueArray = [].concat(value);

    return (
      <div
        className={mergeClassNames(
          baseClassName,
          selectRange && valueArray.length === 1 && `${baseClassName}--selectRange`,
          showDoubleView && `${baseClassName}--doubleView`,
          className,
        )}
      >
        {this.renderNavigation()}
        <div
          className={`${baseClassName}__viewContainer`}
          onBlur={selectRange ? onMouseLeave : null}
          onMouseLeave={selectRange ? onMouseLeave : null}
        >
          {this.renderContent()}
          {showDoubleView && this.renderContent(true)}
        </div>
      </div>
    );
  }
}

Calendar.defaultProps = {
  maxDetail: 'month',
  minDetail: 'century',
  returnValue: 'start',
  showNavigation: true,
  showNeighboringMonth: true,
};

const isActiveStartDate = PropTypes.instanceOf(Date);
const isLooseValue = PropTypes.oneOfType([
  PropTypes.string,
  isValue,
]);

Calendar.propTypes = {
  activeStartDate: isActiveStartDate,
  calendarType: isCalendarType,
  className: isClassName,
  defaultActiveStartDate: isActiveStartDate,
  defaultValue: isLooseValue,
  defaultView: isView,
  formatMonth: PropTypes.func,
  formatMonthYear: PropTypes.func,
  formatShortWeekday: PropTypes.func,
  formatYear: PropTypes.func,
  locale: PropTypes.string,
  maxDate: isMaxDate,
  maxDetail: PropTypes.oneOf(allViews),
  minDate: isMinDate,
  minDetail: PropTypes.oneOf(allViews),
  navigationAriaLabel: PropTypes.string,
  navigationLabel: PropTypes.func,
  next2AriaLabel: PropTypes.string,
  next2Label: PropTypes.node,
  nextAriaLabel: PropTypes.string,
  nextLabel: PropTypes.node,
  onActiveStartDateChange: PropTypes.func,
  onChange: PropTypes.func,
  onClickDay: PropTypes.func,
  onClickDecade: PropTypes.func,
  onClickMonth: PropTypes.func,
  onClickWeekNumber: PropTypes.func,
  onClickYear: PropTypes.func,
  onDrillDown: PropTypes.func,
  onDrillUp: PropTypes.func,
  onViewChange: PropTypes.func,
  prev2AriaLabel: PropTypes.string,
  prev2Label: PropTypes.node,
  prevAriaLabel: PropTypes.string,
  prevLabel: PropTypes.node,
  renderChildren: PropTypes.func, // For backwards compatibility
  returnValue: PropTypes.oneOf(['start', 'end', 'range']),
  selectRange: PropTypes.bool,
  showDoubleView: PropTypes.bool,
  showFixedNumberOfWeeks: PropTypes.bool,
  showNavigation: PropTypes.bool,
  showNeighboringMonth: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  tileClassName: PropTypes.oneOfType([
    PropTypes.func,
    isClassName,
  ]),
  tileContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
  tileDisabled: PropTypes.func,
  value: isLooseValue,
  view: isView,
};
