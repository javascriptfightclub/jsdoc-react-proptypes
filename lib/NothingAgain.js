"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Nothing here.
 * @prop {boolean} shout A random required boolean prop
 * @prop {Array<string>} [yellees = []] An array of names of people to yell at
 */
function NothingAgain(props) {
    return React.createElement(
        "div",
        null,
        "Nothing"
    );
}

NothingAgain.propTypes = {
    shout: React.PropTypes.bool.isRequired,
    yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

NothingAgain.defaultProps = {
    yellees: []
};
exports.default = NothingAgain;