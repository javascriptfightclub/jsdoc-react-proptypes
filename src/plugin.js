// I DONT NORMALLY CODE LIKE THIS I SWEAR
// ITS ALL VERY ODD
import ReactDictionary from './dictionaries/react';

// all the things we might try to match
// gotta add immutabl recursive
var dictionaries = [].concat(ReactDictionary);

// remember stuff
var astNodeMap = {};
var docletMap = {};
var lastPropDoclet;
var lastES5Doclet;

// not sure what this does
function getVariableNameOrSomething(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(-1);
}

function kindOfParentNameThingIGuess(doclet) {
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

    const matches = description.match(/\s*{(.+?)}\s*(\[=(.+?)\])?\s*/);
    if(!matches) {
        return {
            description
        };
    }

    const types = matches[1];
    const defaultvalue = matches[3];

    var output = {
        description: output.description.replace(matches[0], '').trim()
    };

    if(types) {
        output.types = types.split('|').map(ii => ii.trim());
    }

    if(defaultvalue) {
        output.defaultvalue = defaultvalue;
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
                name: callee && callee.property && callee.property.name,
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
            name: property && property.name
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
                    dict:dict.dict,//dictdictdictdictdictdictdictdictdictdictdictdictdictdictdict
                    propChain: propChain.slice(j + 1)
                };
            }
        }
    }
    return null;
}

function MUTATEPROPSwithadictionary(prop, propChain, dict) {
    for(var iiii = 0; iiii < propChain.length; iiii++) {
        const {name, args} = propChain[iiii];
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
    const cool = findDictionaryMatchingChain(propChain, dictionaries);
    if(cool) {
        MUTATEPROPSwithadictionary(prop, cool.propChain, cool.dict);
    }
    return prop;
}

function finallyAddPropToComponentThisIsShit(longname, prop) {
    const theComponent = docletMap[longname];
    if(!theComponent || !theComponent.doclet) {
        return;
    }
    if(!theComponent.doclet.properties) {
        theComponent.doclet.properties = [];
    }
    theComponent.doclet.properties.push(prop);
}

function rangeWithin(parent, child) {
    const [thisStart, thisEnd] = child.meta.range;
    const [propStart, propEnd] = parent.meta.range;
    return thisStart > propStart && thisEnd < propEnd;
}

// jsdoc weird hooks
const astNodeVisitor = {
    visitNode: (node, e, parser, currentSourceName) => {
        // we dont crae about these ones, just bail
        if(!e || e.comment == '@undocumented' || e.event != 'symbolFound') {
            return;
        }
        // LETS REMEMBER ALMOST EVERYTHING
        // BECAUSE WHY NOT
        // CANT WORK OUT A BETTER WAY
        astNodeMap[e.id] = node;
    }
};

// more weird jsdoc hooks
const handlers = {
    newDoclet: (e) => {
        if(!e || !e.doclet || e.doclet.undocumented) {
            // go home
            return;
        }

        // GET THE NODE OUT OF THAT MASSIVE LIST WE GOT GOING ON
        const {doclet} = e;
        docletMap[doclet.longname] = e;
        const node = astNodeMap[e.doclet.meta.code.id];

        // if doclet is a child of propTypes, this is a prop doclet...
        if(getVariableNameOrSomething(doclet) == 'propTypes') {
            lastPropDoclet = doclet;

            // found prop types, start collecting information for the jsdoc prop...
            const name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
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
                    finallyAddPropToComponentThisIsShit(lastES5Doclet.longname, prop);
                } else {
                    finallyAddPropToComponentThisIsShit(kindOfParentNameThingIGuess(doclet), prop);
                }
            }
            return;
        }

        // is doclet's source code range is within that of last propType, this is a sub-prop doclet...
        if(lastPropDoclet && rangeWithin(lastPropDoclet, doclet)) {
            const name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
            const lastPropName = lastPropDoclet.meta && lastPropDoclet.meta.code && lastPropDoclet.meta.code.name;

            const fuck = getPropForNode(node, {
                name: `${lastPropName}.${name}`,
                description: doclet.description
            });

            if(fuck) {
                finallyAddPropToComponentThisIsShit(kindOfParentNameThingIGuess(lastPropDoclet), fuck);
            }
            return;
        }

        // STUPID SAFE BABY STEPS
        // BABY STEPS
        if(node
            && node.init
            && node.init.callee
            && node.init.callee.property
            && node.init.callee.property.name == 'createClass' // we made it, phew, time for a nap
        ) {
            lastES5Doclet = doclet;
        }
    }
};

export {
    astNodeVisitor,
    handlers
}
