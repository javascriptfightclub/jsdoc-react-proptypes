import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import pointInPoly from 'robust-point-in-polygon';
import Cell from './Cell';

/**
 * @module Componentssss
 */

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
 *
 * @prop {Component} component A React Component to use within each cell in the grid. Note that it must be a React `Component`, not a React `Element`.
 * @prop {Array<Array>} [data] A 2D array containing data to pass to each cell via their `data` prop
 * @prop {Number|Object} [size = 50] Sets the pixel size of cells. Pass a number to set `width` and `height` at once, or pass an object with `x` and `y` values to set `width` and `height` separately.
 * @prop {OnCellClick} [onCellClick]
 * @prop {Array<Array<number>>} [cellHitArea] An array of points used to define the shape of the hit area on each cell. Defaults to `[[0,0],[1,0],[1,1],[0,1]]` which makes the entire surface of each cell is clickable.
 * @prop {Array<Array<Array<number>>>} [cellHitAreas] An array of arrays of points used to define several hit area shapes on each cell. This prop takes precedence over `cellHitArea`.
 * @prop {String} [className] Class names to apply to the `Grid`s DOM element
 * @prop {String} [cellClassName] Class names to apply to every cell
 */

class Grid extends Component {

    constructor(props) {
        super(props);

        // dermines the order in which cells and neighbour cells are checked when finding a suitable hit
        this.cellLookabout = [[0,0],[-1,0],[-1,-1],[0,-1],[1,0],[1,0],[-1,1],[0,1],[1,1]];

        this.handleClick = this.handleClick.bind(this);
        this.gridDimensions = this.gridDimensions.bind(this);
        this.cellDimensions = this.cellDimensions.bind(this);
        this.cellHitAreas = this.cellHitAreas.bind(this);
    }

    handleClick(event) {
        const {onCellClick} = this.props;
        if(!onCellClick) {
            return;
        }

        const {cellWidth, cellHeight} = this.cellDimensions();
        const hitboxes = this.cellHitAreas();

        const node = findDOMNode(this);
        const clickX = event.nativeEvent.pageX - node.offsetLeft;
        const clickY = event.nativeEvent.pageY - node.offsetTop;
        const cellX = Math.floor(clickX / cellWidth);
        const cellY = Math.floor(clickY / cellHeight);

        for(var i = 0; i < this.cellLookabout.length; i++) {
            const [offsetX, offsetY] = this.cellLookabout[i];
            if(!this.isCellInBounds(cellX + offsetX, cellY + offsetY)) {
                continue;
            }
            const point = [
                ((clickX / cellWidth) % 1) - offsetX,
                ((clickY / cellHeight) % 1) - offsetY
            ];

            for(var h = 0; h < hitboxes.length; h++) {
                if(pointInPoly(hitboxes[h], point) < 1) {
                    onCellClick(cellX + offsetX, cellY + offsetY, h);
                    return;
                }
            }
        }
    }

    isCellInBounds(x, y) {
        const {cols, rows} = this.gridDimensions();
        return x >= 0 && y >= 0 && x < cols && y < rows;
    }

    gridDimensions() {
        const {data} = this.props;
        const {
            cols = data ? Math.max(...data.map(row => row.length)) : 0,
            rows = data ? data.length : 0
        } = this.props;
        return {cols, rows};
    }

    cellDimensions() {
        const {size} = this.props;
        return {
            cellWidth: isNaN(size) ? size.x : size,
            cellHeight: isNaN(size) ? size.y : size
        };
    }

    cellHitAreas() {
        const {cellHitArea, cellHitAreas} = this.props;
        return cellHitAreas || [cellHitArea];
    }

    render() {
        const {
            component,
            data,
            size, // destructured here so it isn't included in additionalProps
            className,
            cellClassName,
            ...additionalProps
        } = this.props;

        const {cols, rows} = this.gridDimensions();
        const {cellWidth, cellHeight} = this.cellDimensions();

        var components = [];
        for(var y = 0; y < rows; y++) {
            for(var x = 0; x < cols; x++) {
                components.push(<Cell
                    component={component}
                    data={data}
                    x={x}
                    y={y}
                    cols={cols}
                    rows={rows}
                    width={cellWidth}
                    height={cellHeight}
                    className={cellClassName}
                    additionalProps={additionalProps}
                    key={`${x},${y}`}
                />);
            }
        }

        const style = {
            position: 'relative',
            width: cellWidth * cols,
            height: cellHeight * rows
        };

        return <div
            style={style}
            className={className}
            children={components}
            onClick={this.handleClick}
        />;
    }
}

Grid.propTypes = {
    component: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]).isRequired, /** thing here */
    data: PropTypes.arrayOf(
        PropTypes.array
    ),
    cols: PropTypes.number,
    rows: PropTypes.number,
    size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        })
    ]).isRequired,
    onCellClick: PropTypes.func,
    cellHitArea: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.number
        )
    ),
    cellHitAreas: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.arrayOf(
                PropTypes.number
            )
        )
    ),
    className: PropTypes.string,
    cellClassName: PropTypes.string
};

Grid.defaultProps = {
    data: null,
    size: 50,
    cellHitArea: [[0,0],[1,0],[1,1],[0,1]],
    className: "",
    cellClassName: ""
};

export default Grid;


/**
 * A callback that is called when a cell is clicked.
 *
 * @typedef OnCellClick
 * @param {number} x The x coordinate of the clicked cell.
 * @param {number} y The y coordinate of the clicked cell.
 * @param {number} hitArea The number of the hit area shape that was hit. This will be 0 unless multiple hit areas are defined.
 */


