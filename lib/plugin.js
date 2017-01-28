'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlers = exports.astNodeVisitor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('./dictionaries/react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// all the things we might try to match
// gotta add immutable proptypes
var dictionaries = [].concat(_react2.default);

// remember stuff
var astNodeMap = {};
var docletMap = {};
var lastPropDoclet;
var lastES5Doclet;

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
    return doclet.memberof && doclet.memberof.split(".").slice(-1);
}

function getToppestMemberof(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(0, -1);
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

    var prop = Object.assign({
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
        Object.assign(doclet.properties[propMap[prop.name]], prop);
    } else {
        doclet.properties.push(prop);
    }
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
        var node = astNodeMap[e.doclet.meta.code.id];

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

                // jsdoc loses the plot with ES5, manually remember the last time we saw one
                // and if this new doclet is in the range of that last es5 class
                // then add the prop to it
                // probably has the ability to cause extremely rare bugs because it doesn't
                // bother checking if its in the same file
                // like this could happen way after the last es5 and what if the char ranges line up
                if (lastES5Doclet && rangeWithin(lastES5Doclet, doclet)) {
                    addOrModifyThePropOnTheComponent(lastES5Doclet.longname, _prop);
                } else {
                    addOrModifyThePropOnTheComponent(getToppestMemberof(doclet), _prop);
                }
            }
            return;
        }

        // maybe it s a default prop?! Lets looks and see!
        if (doclet.comment == DEFAULTPROPCOMMENT) {
            var defaultvalue = getInThere(doclet, 'meta.code.value');
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

        // no longer requires baby steps or a subsequent nap
        if (getInThere(node, 'init.callee.property.name') == 'createClass') {
            lastES5Doclet = doclet;
        }
    }
};

exports.astNodeVisitor = astNodeVisitor;
exports.handlers = handlers;