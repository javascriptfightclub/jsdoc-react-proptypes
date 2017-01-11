'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _robustPointInPolygon = require('robust-point-in-polygon');

var _robustPointInPolygon2 = _interopRequireDefault(_robustPointInPolygon);

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @component
 *
 * A grid of cells. This will create a 2D matrix of `Cell`s according to the `Grid`s props.
 * Inside each `Cell` an element of type `props.component` is created.
 *
 * Cell components are positioned in the grid more like sprites than DOM elements,
 * meaning that the size of the contents of cells will have no bearing on the placement of adjacent cells.
 * The cell `component`s themselves can be styled as normal.
 *
 * @example
 * function Square(props) {
 *   return <div className="Square">{props.data}</div>;
 * }
 *
 * function TicTacToe(props) {
 *   const data = [
 *       ["X"," "," "],
 *       ["O","O"," "],
 *       [" ","X"," "]
 *   ];
 *   return <Grid
 *       component={Square}
 *       data={data}
 *       size={40}
 *   />;
 * }
 */

var Grid = function (_Component) {
    _inherits(Grid, _Component);

    function Grid(props) {
        _classCallCheck(this, Grid);

        // dermines the order in which cells and neighbour cells are checked when finding a suitable hit
        var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));

        _this.cellLookabout = [[0, 0], [-1, 0], [-1, -1], [0, -1], [1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

        _this.handleClick = _this.handleClick.bind(_this);
        _this.gridDimensions = _this.gridDimensions.bind(_this);
        _this.cellDimensions = _this.cellDimensions.bind(_this);
        _this.cellHitAreas = _this.cellHitAreas.bind(_this);
        return _this;
    }

    _createClass(Grid, [{
        key: 'handleClick',
        value: function handleClick(event) {
            var onCellClick = this.props.onCellClick;

            if (!onCellClick) {
                return;
            }

            var _cellDimensions = this.cellDimensions(),
                cellWidth = _cellDimensions.cellWidth,
                cellHeight = _cellDimensions.cellHeight;

            var hitboxes = this.cellHitAreas();

            var node = (0, _reactDom.findDOMNode)(this);
            var clickX = event.nativeEvent.pageX - node.offsetLeft;
            var clickY = event.nativeEvent.pageY - node.offsetTop;
            var cellX = Math.floor(clickX / cellWidth);
            var cellY = Math.floor(clickY / cellHeight);

            for (var i = 0; i < this.cellLookabout.length; i++) {
                var _cellLookabout$i = _slicedToArray(this.cellLookabout[i], 2),
                    offsetX = _cellLookabout$i[0],
                    offsetY = _cellLookabout$i[1];

                if (!this.isCellInBounds(cellX + offsetX, cellY + offsetY)) {
                    continue;
                }
                var point = [clickX / cellWidth % 1 - offsetX, clickY / cellHeight % 1 - offsetY];

                for (var h = 0; h < hitboxes.length; h++) {
                    if ((0, _robustPointInPolygon2.default)(hitboxes[h], point) < 1) {
                        onCellClick(cellX + offsetX, cellY + offsetY, h);
                        return;
                    }
                }
            }
        }
    }, {
        key: 'isCellInBounds',
        value: function isCellInBounds(x, y) {
            var _gridDimensions = this.gridDimensions(),
                cols = _gridDimensions.cols,
                rows = _gridDimensions.rows;

            return x >= 0 && y >= 0 && x < cols && y < rows;
        }
    }, {
        key: 'gridDimensions',
        value: function gridDimensions() {
            var data = this.props.data;
            var _props = this.props,
                _props$cols = _props.cols,
                cols = _props$cols === undefined ? data ? Math.max.apply(Math, _toConsumableArray(data.map(function (row) {
                return row.length;
            }))) : 0 : _props$cols,
                _props$rows = _props.rows,
                rows = _props$rows === undefined ? data ? data.length : 0 : _props$rows;

            return { cols: cols, rows: rows };
        }
    }, {
        key: 'cellDimensions',
        value: function cellDimensions() {
            var size = this.props.size;

            return {
                cellWidth: isNaN(size) ? size.x : size,
                cellHeight: isNaN(size) ? size.y : size
            };
        }
    }, {
        key: 'cellHitAreas',
        value: function cellHitAreas() {
            var _props2 = this.props,
                cellHitArea = _props2.cellHitArea,
                cellHitAreas = _props2.cellHitAreas;

            return cellHitAreas || [cellHitArea];
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props,
                component = _props3.component,
                data = _props3.data,
                size = _props3.size,
                className = _props3.className,
                cellClassName = _props3.cellClassName,
                additionalProps = _objectWithoutProperties(_props3, ['component', 'data', 'size', 'className', 'cellClassName']);

            var _gridDimensions2 = this.gridDimensions(),
                cols = _gridDimensions2.cols,
                rows = _gridDimensions2.rows;

            var _cellDimensions2 = this.cellDimensions(),
                cellWidth = _cellDimensions2.cellWidth,
                cellHeight = _cellDimensions2.cellHeight;

            var components = [];
            for (var y = 0; y < rows; y++) {
                for (var x = 0; x < cols; x++) {
                    components.push(_react2.default.createElement(_Cell2.default, {
                        component: component,
                        data: data,
                        x: x,
                        y: y,
                        cols: cols,
                        rows: rows,
                        width: cellWidth,
                        height: cellHeight,
                        className: cellClassName,
                        additionalProps: additionalProps,
                        key: x + ',' + y
                    }));
                }
            }

            var style = {
                position: 'relative',
                width: cellWidth * cols,
                height: cellHeight * rows
            };

            return _react2.default.createElement('div', {
                style: style,
                className: className,
                children: components,
                onClick: this.handleClick
            });
        }
    }]);

    return Grid;
}(_react.Component);

Grid.propTypes = {
    /** A React Component to use within each cell in the grid. Note that it must be a React `Component`, not a React `Element`. */
    component: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]).isRequired,

    /** A 2D array containing data to pass to each cell via their `data` prop */
    data: _react.PropTypes.arrayOf(_react.PropTypes.array),

    cols: _react.PropTypes.number,
    rows: _react.PropTypes.number,

    /** Sets the pixel size of cells. Pass a number to set `width` and `height` at once, or pass an object with `x` and `y` values to set `width` and `height` separately. */
    size: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.shape({
        x: _react.PropTypes.number,
        y: _react.PropTypes.number
    })]).isRequired,

    /** A function of some sorts */
    onCellClick: _react.PropTypes.func,

    /** An array of points used to define the shape of the hit area on each cell. Defaults to `[[0,0],[1,0],[1,1],[0,1]]` which makes the entire surface of each cell is clickable. */
    cellHitArea: _react.PropTypes.arrayOf(_react.PropTypes.arrayOf(_react.PropTypes.number)),

    /**  An array of arrays of points used to define several hit area shapes on each cell. This prop takes precedence over `cellHitArea`. */
    cellHitAreas: _react.PropTypes.arrayOf(_react.PropTypes.arrayOf(_react.PropTypes.arrayOf(_react.PropTypes.number))),

    className: _react.PropTypes.string, /** Class names to apply to the `Grid`s DOM element */
    cellClassName: _react.PropTypes.string /** Class names to apply to every cell */
};

Grid.defaultProps = {
    data: null,
    size: 50,
    cellHitArea: [[0, 0], [1, 0], [1, 1], [0, 1]],
    className: "",
    cellClassName: ""
};

exports.default = Grid;