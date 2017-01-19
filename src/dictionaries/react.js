// React.PropTypes

const PropTypes = {
    array: (prop) => {
        prop.type.names.push('Array');
    },
    bool: (prop) => {
        prop.type.names.push('boolean');
    },
    func: (prop) => {
        prop.type.names.push('Function'); // ?
    },
    number: (prop) => {
        prop.type.names.push('number');
    },
    object: (prop) => {
        prop.type.names.push('Object');
    },
    string: (prop) => {
        prop.type.names.push('string');
    },
    symbol: (prop) => {
        prop.type.names.push('symbol'); // ?
    },

    /*

  optionalNode: PropTypes.node,

  optionalElement: React.PropTypes.element,

  optionalMessage: React.PropTypes.instanceOf(Message),

  optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),

  optionalUnion: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.instanceOf(Message)
  ]),

  optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

  optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),

  optionalObjectWithShape: React.PropTypes.shape({
    color: React.PropTypes.string,
    fontSize: React.PropTypes.number
  }),

  requiredFunc: React.PropTypes.func.isRequired,

  requiredAny: React.PropTypes.any.isRequired,

  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  customArrayProp: React.PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  }) */
};

const ReactDictionary = [
    {
        name: "PropTypes",
        dict: PropTypes
    }
];

export default ReactDictionary;
