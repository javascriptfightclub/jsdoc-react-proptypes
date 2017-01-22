import ReactDictionary from './dictionaries/react';

var dictionaries = []
    .concat(ReactDictionary);

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
    const {type} = args;
    if(type == 'Identifier') {
        return args.name;
    }
    if(type == 'ArrayExpression') {
        return args.elements.map(node => {
            if(node.type == 'Literal') {
                return node.value;
            }
            return getPropForNode({value:node}).type.names[0];
        });
    }
    if(type == 'MemberExpression') {
        return getPropForNode({value:args}).type.names[0];
    }
    if(type == 'ObjectExpression') {
        return getPropForNode({value:args}).type.names[0];
    }
}

function parsePropChain(node, lookFor) {
    const perNode = (value, chain) => {
        if(!value) {
            return;
        }

        const {callee} = value;
        if(callee) {
            var args = [];
            if(value.arguments && value.arguments[0]) {
                args = parsePropArgs(value.arguments[0]);
                console.log("ARGS", args);
            }
            chain.unshift({
                name: callee && callee.property && callee.property.name,
                args
            });

            perNode(callee.object, chain);
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

        perNode(object, chain);
    };

    var chain = [];
    perNode(node.value, chain);
    return chain;
}

function findDictionaryMatchingChain(propChain, dictionaries) {
    for(var i = 0; i < dictionaries.length; i++) {
        var dict = dictionaries[i];
        for(var j = 0; j < propChain.length; j++) {
            if(propChain[j].name == dict.name) {
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

    const propChain = parsePropChain(node, 'PropTypes');
    // check if the prop chain matches a dictionary we have
    const res = findDictionaryMatchingChain(propChain, dictionaries);
    if(res) {
        processProp(prop, res.propChain, res.dict);
    }
    return prop;
}

function addPropToComponent(longname, prop) {
    const component = docletMap[longname];
    if(!component || !component.doclet) {
        return;
    }
    if(!component.doclet.properties) {
        component.doclet.properties = [];
    }
    component.doclet.properties.push(prop);
}

function rangeWithin(parent, child) {
    const [thisStart, thisEnd] = child.meta.range;
    const [propStart, propEnd] = parent.meta.range;
    return thisStart > propStart && thisEnd < propEnd;
}

const astNodeVisitor = {
    visitNode: (node, e, parser, currentSourceName) => {
        if(!e || e.comment == '@undocumented' || e.event != 'symbolFound') {
            return;
        }
        astNodeMap[e.id] = node;
    }
};

const handlers = {
    newDoclet: (e) => {
        if(!e || !e.doclet || e.doclet.undocumented) {
            return;
        }

        const {doclet} = e;
        docletMap[doclet.longname] = e;
        const node = astNodeMap[e.doclet.meta.code.id];

        // if doclet is a child of propTypes, this is a prop doclet...
        if(docletVarname(doclet) == 'propTypes') {
            lastPropDoclet = doclet;

            // found prop types, start collecting information for the jsdoc prop...
            const name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
            console.log(">>>>>>>>>>", name);
            const description = doclet.description;
            const prop = getPropForNode(node, {name, description});

            if(prop) {
                if(lastES5Doclet && rangeWithin(lastES5Doclet, doclet)) {
                    addPropToComponent(lastES5Doclet.longname, prop);
                } else {
                    addPropToComponent(docletParentLongname(doclet), prop);
                }
            }
            return;
        }

        // is doclet's source code range is within that of last propType, this is a sub-prop doclet...
        if(lastPropDoclet && rangeWithin(lastPropDoclet, doclet)) {
            const name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
            const lastPropName = lastPropDoclet.meta && lastPropDoclet.meta.code && lastPropDoclet.meta.code.name;

            const prop = getPropForNode(node, {
                name: `${lastPropName}.${name}`,
                description: doclet.description
            });

            if(prop) {
                addPropToComponent(docletParentLongname(lastPropDoclet), prop);
            }
            return;
        }

        if(node
            && node.init
            && node.init.callee
            && node.init.callee.property
            && node.init.callee.property.name == 'createClass'
        ) {
            lastES5Doclet = doclet;
        }
    }
};

export {
    astNodeVisitor,
    handlers
}
