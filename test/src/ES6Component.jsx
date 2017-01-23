import React, {Component} from 'react';

/**
 * A component to test stuff out on.
 */

class ES6Component extends Component {
    render() {
        return <div>Nothing</div>;
    }
}

ES6Component.propTypes = {
  /** An array */
  optionalArray: React.PropTypes.array,
  /** A boolean */
  optionalBool: React.PropTypes.bool,
  /** A function */
  optionalFunc: React.PropTypes.func,
  /** A number */
  optionalNumber: React.PropTypes.number,
  /** A number (and a `markdown` *comment!*)*/
  optionalNumberWithMarkdown: React.PropTypes.number,
  /** An object with a jsdoc type */
  optionalObject: React.PropTypes.object,
  /** A string */
  optionalString: React.PropTypes.string,
  /** A Symbol */
  optionalSymbol: React.PropTypes.symbol,

  /** Anything that can be rendered. */
  optionalNode: React.PropTypes.node,

  /** A React element. */
  optionalElement: React.PropTypes.element,

  /** You can also declare that a prop is an instance of a class. This uses JS's instanceof operator. */
  optionalMessage: React.PropTypes.instanceOf(Message),

  /** You can ensure that your prop is limited to specific values by treating it as an enum. */
  optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),

  /** An object that could be one of many types */
  optionalUnion: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.instanceOf(Message)
  ]),

  /** An array of a certain type */
  optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

  /** An object with property values of a certain type */
  optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),

  /** An object taking on a particular shape */
  optionalObjectWithShape: React.PropTypes.shape({
    /** Shapes can also have documented properties */
    color: React.PropTypes.string,
    /** Like these */
    fontSize: React.PropTypes.number.isRequired
  }),

  /**
   * You can chain any of the above with `isRequired` to make sure a warning is shown if the prop isn't provided.
   */
  requiredString: React.PropTypes.string.isRequired,

  /** A value of any data type */
  requiredAny: React.PropTypes.any.isRequired,

  /**
   * You can also specify a custom validator.
   */
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  /** You can also supply a custom validator to `arrayOf`.
   */
  customArrayProp: React.PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  }),

  /** You can also supply a custom validator to `objectOf`.
   */
  customObjectProp: React.PropTypes.objectOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};

ES6Component.defaultProps = {
    optionalString: "default string"
};

export default ES6Component;
