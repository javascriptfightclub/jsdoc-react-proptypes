"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlers = exports.astNodeVisitor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("./dictionaries/react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dictionaries = [].concat(_react2.default);

var astNodeMap = {};
var docletMap = {};
var lastPropDoclet;
var lastES5Doclet;

function docletVarname(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(-1);
}

function docletParentLongname(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(0, -1);
}

function parsePropArgs(args) {
    var type = args.type;

    if (type == 'Identifier') {
        return args.name;
    }
    if (type == 'ArrayExpression') {
        return args.elements.map(function (node) {
            if (node.type == 'Literal') {
                return node.value;
            }
            return getPropForNode({ value: node }).type.names[0];
        });
    }
    if (type == 'MemberExpression') {
        return getPropForNode({ value: args }).type.names[0];
    }
    if (type == 'ObjectExpression') {
        return getPropForNode({ value: args }).type.names[0];
    }
}

function parsePropChain(node, lookFor) {
    var perNode = function perNode(value, chain) {
        if (!value) {
            return;
        }

        var callee = value.callee;

        if (callee) {
            var args = [];
            if (value.arguments && value.arguments[0]) {
                args = parsePropArgs(value.arguments[0]);
                console.log("ARGS", args);
            }
            chain.unshift({
                name: callee && callee.property && callee.property.name,
                args: args
            });

            perNode(callee.object, chain);
            return;
        }

        var property = value.property,
            object = value.object,
            name = value.name;


        chain.unshift({
            name: property && property.name
        });

        perNode(object, chain);
    };

    var chain = [];
    perNode(node.value, chain);
    return chain;
}

function findDictionaryMatchingChain(propChain, dictionaries) {
    for (var i = 0; i < dictionaries.length; i++) {
        var dict = dictionaries[i];
        for (var j = 0; j < propChain.length; j++) {
            if (propChain[j].name == dict.name) {
                return {
                    dict: dict.dict,
                    propChain: propChain.slice(j + 1)
                };
            }
        }
    }
    return null;
}

function processProp(prop, propChain, dict) {
    for (var i = 0; i < propChain.length; i++) {
        var _propChain$i = propChain[i],
            name = _propChain$i.name,
            args = _propChain$i.args;

        dict[name] && dict[name](prop, args);
    }
}

function getPropForNode(node) {
    var propMerge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var prop = Object.assign({
        optional: true,
        type: {
            names: []
        }
    }, propMerge);

    var propChain = parsePropChain(node, 'PropTypes');
    // check if the prop chain matches a dictionary we have
    var res = findDictionaryMatchingChain(propChain, dictionaries);
    if (res) {
        processProp(prop, res.propChain, res.dict);
    }
    return prop;
}

function addPropToComponent(longname, prop) {
    var component = docletMap[longname];
    if (!component || !component.doclet) {
        return;
    }
    if (!component.doclet.properties) {
        component.doclet.properties = [];
    }
    component.doclet.properties.push(prop);
}

function rangeWithin(parent, child) {
    var _child$meta$range = _slicedToArray(child.meta.range, 2),
        thisStart = _child$meta$range[0],
        thisEnd = _child$meta$range[1];

    var _parent$meta$range = _slicedToArray(parent.meta.range, 2),
        propStart = _parent$meta$range[0],
        propEnd = _parent$meta$range[1];

    return thisStart > propStart && thisEnd < propEnd;
}

var astNodeVisitor = {
    visitNode: function visitNode(node, e, parser, currentSourceName) {
        if (!e || e.comment == '@undocumented' || e.event != 'symbolFound') {
            return;
        }
        astNodeMap[e.id] = node;
    }
};

var handlers = {
    newDoclet: function newDoclet(e) {
        if (!e || !e.doclet || e.doclet.undocumented) {
            return;
        }

        var doclet = e.doclet;

        docletMap[doclet.longname] = e;
        var node = astNodeMap[e.doclet.meta.code.id];

        // if doclet is a child of propTypes, this is a prop doclet...
        if (docletVarname(doclet) == 'propTypes') {
            lastPropDoclet = doclet;

            // found prop types, start collecting information for the jsdoc prop...
            var name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
            console.log(">>>>>>>>>>", name);
            var description = doclet.description;
            var prop = getPropForNode(node, { name: name, description: description });

            if (prop) {
                if (lastES5Doclet && rangeWithin(lastES5Doclet, doclet)) {
                    addPropToComponent(lastES5Doclet.longname, prop);
                } else {
                    addPropToComponent(docletParentLongname(doclet), prop);
                }
            }
            return;
        }

        // is doclet's source code range is within that of last propType, this is a sub-prop doclet...
        if (lastPropDoclet && rangeWithin(lastPropDoclet, doclet)) {
            var _name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
            var lastPropName = lastPropDoclet.meta && lastPropDoclet.meta.code && lastPropDoclet.meta.code.name;

            var _prop = getPropForNode(node, {
                name: lastPropName + "." + _name,
                description: doclet.description
            });

            if (_prop) {
                addPropToComponent(docletParentLongname(lastPropDoclet), _prop);
            }
            return;
        }

        if (node && node.init && node.init.callee && node.init.callee.property && node.init.callee.property.name == 'createClass') {
            lastES5Doclet = doclet;
        }
    }
};

exports.astNodeVisitor = astNodeVisitor;
exports.handlers = handlers;