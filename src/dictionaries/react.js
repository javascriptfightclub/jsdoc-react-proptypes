// React PropTypes

const PropTypes = {
    any: (prop) => {
        prop.type.names.push('*');
    },
    array: (prop) => {
        prop.type.names.push('Array');
    },
    bool: (prop) => {
        prop.type.names.push('boolean');
    },
    func: (prop) => {
        //prop.type.names.push('Function'); // ?
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
        //prop.type.names.push('symbol'); // ?
    },
    nodel: (prop) => {
    },
    element: (prop) => {
    },
    instanceOf: (prop, args) => {
    },
    oneOf: (prop, args) => {
    },
    oneOfType: (prop, args) => {
    },
    arrayOf: (prop, args) => {
    },
    objectOf: (prop, args) => {
    },
    shape: (prop, args) => {
    },
    isRequired: (prop, args) => {
        prop.optional = false;
    }
};

const ReactDictionary = [
    {
        name: "PropTypes",
        dict: PropTypes
    }
];

export default ReactDictionary;
