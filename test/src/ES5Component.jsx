import React, {Component, PropTypes} from 'react';

/**
 * An ES5 component to test stuff out on.
 *
 * @prop thing Poo `hello`
 */
var ES5Component = React.createClass({
  propTypes: {
    /** Name string */
    name: React.PropTypes.string
  },

  /*getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },*/

  render() {
    return <div>Nothing here</div>;
  }
});
