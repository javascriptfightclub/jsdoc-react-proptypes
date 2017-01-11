'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cellData(data, x, y) {
    if (!data) {
        return null;
    }
    if (y >= data.length) {
        return null;
    }
    if (x >= data[y].length) {
        return null;
    }
    return data[y][x];
}

function Cell(props) {
    var Component = props.component,
        data = props.data,
        x = props.x,
        y = props.y,
        cols = props.cols,
        rows = props.rows,
        width = props.width,
        height = props.height,
        className = props.className,
        additionalProps = props.additionalProps;


    var style = {
        left: x * width,
        top: y * height,
        display: 'block',
        position: 'absolute'
    };

    return _react2.default.createElement(
        'div',
        {
            style: style,
            className: className
        },
        _react2.default.createElement(Component, _extends({}, additionalProps, {
            data: cellData(data, x, y),
            width: width,
            height: height,
            x: x,
            y: y,
            top: y == 0,
            bottom: y == rows - 1,
            left: x == 0,
            right: x == cols - 1
        }))
    );
}

Cell.propTypes = {
    component: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]).isRequired,
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired,
    cols: _react.PropTypes.number.isRequired,
    rows: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired,
    data: _react.PropTypes.any,
    additionalProps: _react.PropTypes.object
};

exports.default = Cell;