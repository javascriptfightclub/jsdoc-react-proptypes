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
    func: function func(prop) {
        //prop.type.names.push('Function'); // ?
    },
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
        //prop.type.names.push('symbol'); // ?
    },
    nodel: function nodel(prop) {},
    element: function element(prop) {},
    instanceOf: function instanceOf(prop, args) {},
    oneOf: function oneOf(prop, args) {},
    oneOfType: function oneOfType(prop, args) {},
    arrayOf: function arrayOf(prop, args) {},
    objectOf: function objectOf(prop, args) {},
    shape: function shape(prop, args) {},
    isRequired: function isRequired(prop, args) {
        prop.optional = false;
    }
};

var ReactDictionary = [{
    name: "PropTypes",
    dict: PropTypes
}];

exports.default = ReactDictionary;