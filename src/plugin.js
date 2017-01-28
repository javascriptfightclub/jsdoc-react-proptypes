
import ReactDictionary from './dictionaries/react';

// all the things we might try to match
// gotta add immutable proptypes
var dictionaries = [].concat(ReactDictionary);

// remember stuff
var astNodeMap = {};
var docletMap = {};
var lastPropDoclet;
var lastES5Doclet;

const DEFAULTPROPCOMMENT = "/** hello there this is a default prop */";

// climb inside of the various animals in the safe way
function getInThere(thing, path) {
    var out = thing;
    var apathy = path.split('.');

    for(var i =0 ; i < apathy.length; i ++ ) {
        if(!out) {
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
    const {type} = aaargh;
    // dont
    if(type == 'Identifier') {
        return aaargh.name;
    }
    if(type == 'ArrayExpression') {
        return aaargh.elements.map(node => {
            if(node.type == 'Literal') {
                return node.value;
            }
            return getPropForNode({value:node}).type.names[0];
        });
    }
    if(type == 'MemberExpression') {
        return getPropForNode({value:aaargh}).type.names[0];
    }
    if(type == 'ObjectExpression') {
        return getPropForNode({value:aaargh}).type.names[0];
    }
}

function parseThatDescription(description) {
    var output = {description};

    const matchTypes = output.description.match(/\s*{(.+?)}\s*/);
    if(matchTypes) {
        output.types = matchTypes[1].split('|').map(ii => ii.trim());
        output.description = output.description.replace(matchTypes[0], '').trim();
    }

    const matchDefaultvalue = output.description.match(/\s*\[=(.+?)\]\s*/);
    if(matchDefaultvalue) {
        output.defaultvalue = matchDefaultvalue[1];
        output.description = output.description.replace(matchDefaultvalue[0], '').trim();
    }

    return output;
}

function mildPropChainParsing(node, lookFor) {
    const goDeeper = (value, chain) => {
        if(!value) {
            return;
        }

        const {callee} = value;
        if(callee) {
            var args = [];
            if(value.arguments && value.arguments[0]) {
                args = parseArgmuents(value.arguments[0]);
            }
            // add stuff to the wrong end of the array because the AST is kind of topsy turvy
            chain.unshift({
                name: getInThere(callee, 'property.name'),
                args
            });

            goDeeper(callee.object, chain);
            return;
        }

        const {
            property,
            object,
            name
        } = value;

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
    for(var i = 0; i < dictionaries.length; i++) {
        var dict = dictionaries[i];
        // and look in each prop part thing
        for(var j = 0; j < propChain.length; j++) {
            // and eventually they might match something like "PropTypes"
            // or maybe "ImmutablePropTypes"
            if(propChain[j].name == dict.name) {
                // so now we know which dictionary to use
                return {
                    dict:dict.dict,
                    propChain: propChain.slice(j + 1)
                };
            }
        }
    }
    return null;
}

function useTheDictionary(prop, propChain, dict) {
    for(var i = 0; i < propChain.length; i++) {
        const {name, args} = propChain[i];
        dict[name] && dict[name](prop, args);
    }
}

function getPropForNode(node, propMerge = {}) {
    var prop = Object.assign({
        optional: true,
        type: {
            names: []
        }
    }, propMerge);

    const propChain = mildPropChainParsing(node, 'PropTypes');
    // check if the prop chain matches a dictionary we have
    const gotMyselfADictionary = findDictionaryMatchingChain(propChain, dictionaries);
    if(gotMyselfADictionary) {
        useTheDictionary(prop, gotMyselfADictionary.propChain, gotMyselfADictionary.dict);
    }
    return prop;
}

function addOrModifyThePropOnTheComponent(longname, prop) {
    const theComponent = docletMap[longname];
    if(!theComponent || !theComponent.doclet) {
        return;
    }
    const {doclet} = theComponent;
    if(!doclet.properties) {
        doclet.properties = [];
    }
    const {name} = prop;
    var propMap = {};
    doclet.properties.forEach((pp, key) => {
        propMap[pp.name] = key;
    });

    if(propMap.hasOwnProperty(prop.name)) {
        Object.assign(doclet.properties[propMap[prop.name]], prop);
    } else {
        doclet.properties.push(prop);
    }
}

function rangeWithin(parent, child) {
    const [thisStart, thisEnd] = child.meta.range;
    const [propStart, propEnd] = parent.meta.range;
    return thisStart > propStart && thisEnd < propEnd;
}

function markDefaultProps(node, e) {
    if(getInThere(node, 'parent.parent.left.property.name') == 'defaultProps' && node.type == "Property") {
        e.event = "symbolFound";
        e.comment = DEFAULTPROPCOMMENT;
    }
}

// jsdoc hooks
const astNodeVisitor = {
    visitNode: (node, e, parser, currentSourceName) => {
        markDefaultProps(node, e);

        // we dont care about these ones, just bail
        if(!e || e.comment == '@undocumented' || e.event != 'symbolFound') {
            return;
        }
        // lets remember almost everything
        // because why not
        // cant work out a better way
        astNodeMap[e.id] = node;
    }
};

// more jsdoc hooks
const handlers = {
    newDoclet: (e) => {
        if(!e || !e.doclet || e.doclet.undocumented) {
            return;
        }

        const {doclet} = e;
        docletMap[doclet.longname] = e;
        const node = astNodeMap[e.doclet.meta.code.id];

        // if doclet is a child of propTypes, this is a prop doclet...
        if(getBottomestMemberof(doclet) == 'propTypes') {
            lastPropDoclet = doclet;

            // found prop types, start collecting information for the jsdoc prop...
            const name = getInThere(doclet, 'meta.code.name');
            //console.log(">>>>>>>>>>", name);

            const {
                description,
                types,
                defaultvalue
            } = parseThatDescription(doclet.description);

            const prop = getPropForNode(node, {name, description});

            if(prop) {
                if(types) {
                    prop.type.names = types;
                }
                if(defaultvalue) {
                    prop.defaultvalue = defaultvalue;
                }

                // jsdoc loses the plot with ES5, manually remember the last time we saw one
                // and if this new doclet is in the range of that last es5 class
                // then add the prop to it
                // probably has the ability to cause extremely rare bugs because it doesn't
                // bother checking if its in the same file
                // like this could happen way after the last es5 and what if the char ranges line up
                if(lastES5Doclet && rangeWithin(lastES5Doclet, doclet)) {
                    addOrModifyThePropOnTheComponent(lastES5Doclet.longname, prop);
                } else {
                    addOrModifyThePropOnTheComponent(getToppestMemberof(doclet), prop);
                }
            }
            return;
        }

        // maybe it s a default prop?! Lets looks and see!
        if(doclet.comment == DEFAULTPROPCOMMENT) {
            var defaultvalue = getInThere(doclet, 'meta.code.value');
            if(getInThere(doclet, 'meta.code.type') == "Literal") {
                const isString = typeof defaultvalue == "string";
                defaultvalue = isString ? `"${defaultvalue}"` : `${defaultvalue}`;
            }
            var prop = {
                name: doclet.name,
                defaultvalue
            };
            addOrModifyThePropOnTheComponent(getToppestMemberof(doclet), prop);
            return;
        }

        // is doclet's source code range is within that of last propType, this is a sub-prop doclet...
        if(lastPropDoclet && rangeWithin(lastPropDoclet, doclet)) {
            const name = getInThere(doclet, 'meta.code.name');
            const lastPropName = getInThere(lastPropDoclet, 'meta.code.name');

            const fuck = getPropForNode(node, {
                name: `${lastPropName}.${name}`,
                description: doclet.description
            });

            if(fuck) {
                addOrModifyThePropOnTheComponent(getToppestMemberof(lastPropDoclet), fuck);
            }
            return;
        }

        // no longer requires baby steps or a subsequent nap
        if(getInThere(node, 'init.callee.property.name') == 'createClass') {
            lastES5Doclet = doclet;
        }
    }
};

export {
    astNodeVisitor,
    handlers
}
