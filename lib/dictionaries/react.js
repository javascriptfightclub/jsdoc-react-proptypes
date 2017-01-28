'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// React PropTypes

var PropTypes = {
    any: function any(prop) {
        prop.type.names.push('*');
    },
    array: function array(prop) {
        prop.type.names.push('Array');
    },
    bool: function bool(prop) {
        prop.type.names.push('boolean');
    },
    func: function func(prop) {},
    number: function number(prop) {
        prop.type.names.push('number');
    },
    object: function object(prop) {
        prop.type.names.push('Object');
    },
    string: function string(prop) {
        prop.type.names.push('string');
    },
    symbol: function symbol(prop) {
        prop.type.names.push('Symbol');
    },
    node: function node(prop) {
        prop.type.names.push('ReactNode');
    },
    element: function element(prop) {
        prop.type.names.push('ReactElement');
    },
    instanceOf: function instanceOf(prop, instanceName) {
        prop.type.names.push(instanceName);
    },
    oneOf: function oneOf(prop, options) {
        options.forEach(function (option) {
            return prop.type.names.push('\'' + option + '\'');
        });
    },
    oneOfType: function oneOfType(prop, types) {
        types.forEach(function (type) {
            return prop.type.names.push(type);
        });
    },
    arrayOf: function arrayOf(prop, type) {
        if (typeof type == "undefined") {
            prop.type.names.push('Array');
        } else {
            prop.type.names.push('Array.<' + type + '>');
        }
    },
    objectOf: function objectOf(prop, type) {
        if (typeof type == "undefined") {
            prop.type.names.push('Object');
        } else {
            prop.type.names.push('Object.<string, ' + type + '>');
        }
    },
    shape: function shape(prop) {
        prop.type.names.push("Object");
    },
    isRequired: function isRequired(prop) {
        delete prop.optional;
    }
};

var ReactDictionary = [{
    name: "PropTypes",
    dict: PropTypes
}];

exports.default = ReactDictionary;