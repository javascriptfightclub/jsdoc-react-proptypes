"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * NothingFunctional here.
 */
function NothingFunctional(props) {
    return React.createElement(
        "div",
        null,
        "NothingFunctional"
    );
}

NothingFunctional.propTypes = {
    /** A random required boolean prop */
    shout: React.PropTypes.bool.isRequired,

    /** An array of names of people to yell at */
    yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

NothingFunctional.defaultProps = {
    yellees: []
};
exports.default = NothingFunctional;