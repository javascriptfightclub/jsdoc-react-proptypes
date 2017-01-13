import React, {Component, PropTypes} from 'react';

/**
 * @module Module
 */

/**
 * A component to test even more stuff out on.
 */

class ModuleComponent extends Component {
    render() {
        return <div>Nothing again</div>;
    }
}

ModuleComponent.propTypes = {
  /** An array */
  optionalArray: React.PropTypes.array,
  /** A boolean */
  optionalBool: React.PropTypes.bool
};

/*
ModuleComponent.defaultProps = {
};
*/

export default ModuleComponent;