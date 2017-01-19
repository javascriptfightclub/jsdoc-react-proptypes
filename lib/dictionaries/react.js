'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// React.PropTypes

var PropTypes = {
    array: function array(prop) {
        prop.type.names.push('Array');
    },
    bool: function bool(prop) {
        prop.type.names.push('boolean');
    },
    func: function func(prop) {
        prop.type.names.push('Function'); // ?
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
        prop.type.names.push('symbol'); // ?
    }

};

var ReactDictionary = [{
    name: "PropTypes",
    dict: PropTypes
}];

exports.default = ReactDictionary;