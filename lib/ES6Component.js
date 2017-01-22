'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A component to test stuff out on.
 */

var ES6Component = function (_Component) {
  _inherits(ES6Component, _Component);

  function ES6Component() {
    _classCallCheck(this, ES6Component);

    return _possibleConstructorReturn(this, (ES6Component.__proto__ || Object.getPrototypeOf(ES6Component)).apply(this, arguments));
  }

  _createClass(ES6Component, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        'Nothing'
      );
    }
  }]);

  return ES6Component;
}(_react.Component);

ES6Component.propTypes = {
  /** An array */
  optionalArray: _react2.default.PropTypes.array,
  /** A boolean */
  optionalBool: _react2.default.PropTypes.bool,
  /** A function */
  optionalFunc: _react2.default.PropTypes.func,
  /** A number */
  optionalNumber: _react2.default.PropTypes.number,
  /** A number (and a `markdown` *comment!*)*/
  optionalNumberWithMarkdown: _react2.default.PropTypes.number,
  /** An object with a jsdoc type */
  optionalObject: _react2.default.PropTypes.object,
  /** A string */
  optionalString: _react2.default.PropTypes.string,
  /** A Symbol */
  optionalSymbol: _react2.default.PropTypes.symbol,

  /**
   * Anything that can be rendered: numbers, strings, elements or an array (or fragment) containing these types.
   * Also has a value of `PropTypes.node`, not `React.PropTypes.node`
   */
  optionalNode: _react2.default.PropTypes.node,

  /** A React element. */
  optionalElement: _react2.default.PropTypes.element,

  /** You can also declare that a prop is an instance of a class. This uses JS's instanceof operator. */
  optionalMessage: _react2.default.PropTypes.instanceOf(Message),

  /** You can ensure that your prop is limited to specific values by treating it as an enum. */
  optionalEnum: _react2.default.PropTypes.oneOf(['News', 'Photos']),

  /** An object that could be one of many types */
  optionalUnion: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.instanceOf(Message)]),

  /** An array of a certain type */
  optionalArrayOf: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),

  /** An object with property values of a certain type */
  optionalObjectOf: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.number),

  /** An object taking on a particular shape */
  optionalObjectWithShape: _react2.default.PropTypes.shape({
    /** Shapes can also have documented properties */
    color: _react2.default.PropTypes.string,
    /** Like these */
    fontSize: _react2.default.PropTypes.number.isRequired
  }),

  /**
   * You can chain any of the above with `isRequired` to make sure a warning is shown if the prop isn't provided.
   */
  requiredString: _react2.default.PropTypes.string.isRequired,

  /** A value of any data type */
  requiredAny: _react2.default.PropTypes.any.isRequired,

  /**
   * You can also specify a custom validator.
   */
  customProp: function customProp(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.');
    }
  },

  /** You can also supply a custom validator to `arrayOf`.
   */
  customArrayProp: _react2.default.PropTypes.arrayOf(function (propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error('Invalid prop `' + propFullName + '` supplied to' + ' `' + componentName + '`. Validation failed.');
    }
  }),

  /** You can also supply a custom validator to `objectOf`.
   */
  customObjectProp: _react2.default.PropTypes.objectOf(function (propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error('Invalid prop `' + propFullName + '` supplied to' + ' `' + componentName + '`. Validation failed.');
    }
  })
};

/*
ES6Component.defaultProps = {
};
*/

exports.default = ES6Component;