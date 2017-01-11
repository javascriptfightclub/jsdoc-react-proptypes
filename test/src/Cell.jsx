import React, {PropTypes} from 'react';

function cellData(data, x, y) {
    if(!data) {
        return null;
    }
    if(y >= data.length) {
        return null;
    }
    if(x >= data[y].length) {
        return null;
    }
    return data[y][x];
}

function Cell(props) {
    const {
        component: Component,
        data,
        x,
        y,
        cols,
        rows,
        width,
        height,
        className,
        additionalProps
    } = props;

    const style = {
        left: x * width,
        top: y * height,
        display: 'block',
        position: 'absolute'
    };

    return <div
        style={style}
        className={className}
    >
        <Component
            {...additionalProps}
            data={cellData(data, x, y)}
            width={width}
            height={height}
            x={x}
            y={y}
            top={y==0}
            bottom={y==rows-1}
            left={x==0}
            right={x==cols-1}
        />
    </div>;
}

Cell.propTypes = {
    component: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.any,
    additionalProps: PropTypes.object
};

export default Cell;
