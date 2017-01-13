'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An ES5 component to test stuff out on.
 *
 * @prop thing Poo `hello`
 */
var ES5Component = _react2.default.createClass({
  displayName: 'ES5Component',

  propTypes: {
    /** Name string */
    name: _react2.default.PropTypes.string
  },

  /*getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },*/

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      'Nothing here'
    );
  }
});