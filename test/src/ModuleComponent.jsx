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

// default props before proptypes
ModuleComponent.defaultProps = {
    optionalBool: false
};

ModuleComponent.propTypes = {
  /** A boolean */
  optionalBool: React.PropTypes.bool
};

export default ModuleComponent;
