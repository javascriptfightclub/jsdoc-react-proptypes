"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlers = exports.astNodeVisitor = undefined;

var _react = require("./dictionaries/react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dictionaries = [].concat(_react2.default);

var astNodeMap = {};
var docletMap = {};

function docletVarname(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(-1);
}

function docletParentLongname(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(0, -1);
}

function parsePropArgs(args) {
    var type = args.type;

    if (type == 'ArrayExpression') {
        /*return args.elements.map(arg => {
         });*/
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
            }
            chain.unshift({
                name: callee && callee.property && callee.property.name,
                arguments: args
            });

            perNode(callee, chain);
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

        dict[name] && dict[name](prop);
    }
}

function addPropToComponent(component, prop) {
    if (!component || !component.doclet) {
        return;
    }
    if (!component.doclet.props) {
        component.doclet.props = [];
    }
    component.doclet.props.push(prop);
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
        if (docletVarname(doclet) != 'propTypes') {
            return;
        }

        // found prop types, start collecting information for the jsdoc prop...

        var name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
        var description = doclet.description;

        var prop = {
            name: name,
            description: description,
            optional: true,
            type: {
                names: []
            }
        };

        var node = astNodeMap[e.doclet.meta.code.id];
        var propChain = parsePropChain(node, 'PropTypes');

        // check if the prop chain matches a dictionary we have
        var res = findDictionaryMatchingChain(propChain, dictionaries);
        if (!res) {
            return;
        }

        processProp(prop, res.propChain, res.dict);
        addPropToComponent(docletMap[docletParentLongname(doclet)], prop);
    }
};

exports.astNodeVisitor = astNodeVisitor;
exports.handlers = handlers;