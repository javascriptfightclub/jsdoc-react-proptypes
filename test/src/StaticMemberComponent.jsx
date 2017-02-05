import React, {Component, PropTypes} from 'react';

/**
 * A component to test propTypes and defaultProps as static members
 */

class StaticMemberComponent extends Component {

    static defaultProps = {
        optionalBool: false
    };

    static propTypes = {
      /** A boolean */
      optionalBool: React.PropTypes.bool
    };

    render() {
        return <div>Nothing again</div>;
    }
}


export default StaticMemberComponent;
