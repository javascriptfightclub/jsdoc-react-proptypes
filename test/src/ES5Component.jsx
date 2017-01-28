import React, {Component, PropTypes} from 'react';

/**
 * An ES5 component to test stuff out on.
 */
var ES5Component = React.createClass({
  propTypes: {
    /** Name string */
    firstName: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      firstName: 'Mary'
    };
  },

  render() {
    return <div>Nothing here</div>;
  }
});
