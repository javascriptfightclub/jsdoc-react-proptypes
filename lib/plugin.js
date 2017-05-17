'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlers = exports.astNodeVisitor = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _react = require('./dictionaries/react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// all the things we might try to match
// gotta add immutable proptypes
var dictionaries = [].concat(_react2.default);

// remember stuff
// THIS IS AN APOLOGY

var astNodeMap = {};
var docletMap = {};
var lastPropDoclet;

var DEFAULTPROPCOMMENT = "/** hello there this is a default prop */";

// climb inside of the various animals in the safe way
function getInThere(thing, path) {
    var out = thing;
    var apathy = path.split('.');

    for (var i = 0; i < apathy.length; i++) {
        if (!out) {
            return null;
        }
        out = out[apathy[i]];
    }
    return out;
}

function getBottomestMemberof(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(-1)[0];
}

function getToppestMemberof(doclet) {
    return doclet.memberof && doclet.memberof.split(".")[0];
}

function parseArgmuents(aaargh) {
    var type = aaargh.type;
    // dont

    if (type == 'Identifier') {
        return aaargh.name;
    }
    if (type == 'ArrayExpression') {
        return aaargh.elements.map(function (node) {
            if (node.type == 'Literal') {
                return node.value;
            }
            return getPropForNode({ value: node }).type.names[0];
        });
    }
    if (type == 'MemberExpression') {
        return getPropForNode({ value: aaargh }).type.names[0];
    }
    if (type == 'ObjectExpression') {
        return getPropForNode({ value: aaargh }).type.names[0];
    }
}

function parseThatDescription(description) {
    var output = { description: description };

    var matchTypes = output.description.match(/\s*{(.+?)}\s*/);
    if (matchTypes) {
        output.types = matchTypes[1].split('|').map(function (ii) {
            return ii.trim();
        });
        output.description = output.description.replace(matchTypes[0], '').trim();
    }

    var matchDefaultvalue = output.description.match(/\s*\[=(.+?)\]\s*/);
    if (matchDefaultvalue) {
        output.defaultvalue = matchDefaultvalue[1];
        output.description = output.description.replace(matchDefaultvalue[0], '').trim();
    }

    return output;
}

function mildPropChainParsing(node, lookFor) {
    var goDeeper = function goDeeper(value, chain) {
        if (!value) {
            return;
        }

        var callee = value.callee;

        if (callee) {
            var args = [];
            if (value.arguments && value.arguments[0]) {
                args = parseArgmuents(value.arguments[0]);
            }
            // add stuff to the wrong end of the array because the AST is kind of topsy turvy
            chain.unshift({
                name: getInThere(callee, 'property.name'),
                args: args
            });

            goDeeper(callee.object, chain);
            return;
        }

        var property = value.property,
            object = value.object,
            name = value.name;


        chain.unshift({
            name: getInThere(property, 'name')
        });

        goDeeper(object, chain);
    };

    var chain = [];
    goDeeper(node.value, chain);
    return chain;
}

function findDictionaryMatchingChain(propChain, dictionaries) {
    // look in each dictionary
    for (var i = 0; i < dictionaries.length; i++) {
        var dict = dictionaries[i];
        // and look in each prop part thing
        for (var j = 0; j < propChain.length; j++) {
            // and eventually they might match something like "PropTypes"
            // or maybe "ImmutablePropTypes"
            if (propChain[j].name == dict.name) {
                // so now we know which dictionary to use
                return {
                    dict: dict.dict,
                    propChain: propChain.slice(j + 1)
                };
            }
        }
    }
    return null;
}

function useTheDictionary(prop, propChain, dict) {
    for (var i = 0; i < propChain.length; i++) {
        var _propChain$i = propChain[i],
            name = _propChain$i.name,
            args = _propChain$i.args;

        dict[name] && dict[name](prop, args);
    }
}

function getPropForNode(node) {
    var propMerge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var prop = (0, _assign2.default)({
        optional: true,
        type: {
            names: []
        }
    }, propMerge);

    var propChain = mildPropChainParsing(node, 'PropTypes');
    // check if the prop chain matches a dictionary we have
    var gotMyselfADictionary = findDictionaryMatchingChain(propChain, dictionaries);
    if (gotMyselfADictionary) {
        useTheDictionary(prop, gotMyselfADictionary.propChain, gotMyselfADictionary.dict);
    }
    return prop;
}

function addOrModifyThePropOnTheComponent(longname, prop) {
    var theComponent = docletMap[longname];
    if (!theComponent || !theComponent.doclet) {
        return;
    }
    var doclet = theComponent.doclet;

    if (!doclet.properties) {
        doclet.properties = [];
    }

    var name = prop.name;

    var propMap = {};
    doclet.properties.forEach(function (pp, key) {
        propMap[pp.name] = key;
    });

    if (propMap.hasOwnProperty(prop.name)) {
        (0, _assign2.default)(doclet.properties[propMap[prop.name]], prop);
    } else {
        doclet.properties.push(prop);
    }
}

function rangeWithin(parent, child) {
    var _child$meta$range = (0, _slicedToArray3.default)(child.meta.range, 2),
        thisStart = _child$meta$range[0],
        thisEnd = _child$meta$range[1];

    var _parent$meta$range = (0, _slicedToArray3.default)(parent.meta.range, 2),
        propStart = _parent$meta$range[0],
        propEnd = _parent$meta$range[1];

    return thisStart > propStart && thisEnd < propEnd;
}

function markDefaultProps(node, e) {
    if (getInThere(node, 'parent.parent.left.property.name') == 'defaultProps' && node.type == "Property") {
        e.event = "symbolFound";
        e.comment = DEFAULTPROPCOMMENT;
    }
}

// jsdoc hooks
var astNodeVisitor = {
    visitNode: function visitNode(node, e, parser, currentSourceName) {
        markDefaultProps(node, e);

        // we dont care about these ones, just bail
        if (!e || e.comment == '@undocumented' || e.event != 'symbolFound') {
            return;
        }
        // lets remember almost everything
        // because why not
        // cant work out a better way
        astNodeMap[e.id] = node;
    }
};

// more jsdoc hooks
var handlers = {
    newDoclet: function newDoclet(e) {
        if (!e || !e.doclet || e.doclet.undocumented) {
            return;
        }

        var doclet = e.doclet;

        docletMap[doclet.longname] = e;
        var id = getInThere(e, 'doclet.meta.code.id');
        if (!id) {
            return;
        }

        var node = astNodeMap[id];

        // if doclet is a child of propTypes, this is a prop doclet...
        if (getBottomestMemberof(doclet) == 'propTypes') {
            lastPropDoclet = doclet;

            // found prop types, start collecting information for the jsdoc prop...
            var name = getInThere(doclet, 'meta.code.name');
            //console.log(">>>>>>>>>>", name);

            var _parseThatDescription = parseThatDescription(doclet.description),
                description = _parseThatDescription.description,
                types = _parseThatDescription.types,
                _defaultvalue = _parseThatDescription.defaultvalue;

            var _prop = getPropForNode(node, { name: name, description: description });

            if (_prop) {
                if (types) {
                    _prop.type.names = types;
                }
                if (_defaultvalue) {
                    _prop.defaultvalue = _defaultvalue;
                }
                addOrModifyThePropOnTheComponent(getToppestMemberof(doclet), _prop);
            }
            return;
        }

        // uh, well, maybe it s a default prop?! Lets looks and see!
        if (doclet.comment == DEFAULTPROPCOMMENT) {
            var defaultvalue = getInThere(doclet, 'meta.code.value');
            // values here have weird types, most are strings but Literals are not, so fix them up.
            // We want string representations of the syntax required to WRITE each of these
            // so string values should have quotes either end of a string, numbers should be strings etc.
            if (getInThere(doclet, 'meta.code.type') == "Literal") {
                var isString = typeof defaultvalue == "string";
                defaultvalue = isString ? '"' + defaultvalue + '"' : '' + defaultvalue;
            }
            var prop = {
                name: doclet.name,
                defaultvalue: defaultvalue
            };

            addOrModifyThePropOnTheComponent(getToppestMemberof(doclet), prop);
            return;
        }

        // is doclet's source code range is within that of last propType, this is a sub-prop doclet...
        // pretty sure it would be possible and way better to check through multiple parents of the AST node
        // to work this out, but I can't be fucked
        if (lastPropDoclet && rangeWithin(lastPropDoclet, doclet)) {
            var _name = getInThere(doclet, 'meta.code.name');
            var lastPropName = getInThere(lastPropDoclet, 'meta.code.name');

            var fuck = getPropForNode(node, {
                name: lastPropName + '.' + _name,
                description: doclet.description
            });

            if (fuck) {
                addOrModifyThePropOnTheComponent(getToppestMemberof(lastPropDoclet), fuck);
            }
            return;
        }
    }
};

exports.astNodeVisitor = astNodeVisitor;
exports.handlers = handlers;