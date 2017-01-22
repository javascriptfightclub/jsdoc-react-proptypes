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
    node: (prop) => {
    },
    element: (prop) => {
    },
    instanceOf: (prop, instanceName) => {
        prop.type.names.push(instanceName);
    },
    oneOf: (prop, options) => {
        options.forEach(option => prop.type.names.push(`'${option}'`));
    },
    oneOfType: (prop, types) => {
        types.forEach(type => prop.type.names.push(type));
    },
    arrayOf: (prop, type) => {
        if(typeof type == "undefined") {
            prop.type.names.push(`Array`);
        } else {
            prop.type.names.push(`Array.<${type}>`);
        }
    },
    objectOf: (prop, type) => {
        if(typeof type == "undefined") {
            prop.type.names.push(`Object`);
        } else {
            prop.type.names.push(`Object.<string, ${type}>`);
        }
    },
    shape: (prop, args) => {
        prop.type.names.push("Object");
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
