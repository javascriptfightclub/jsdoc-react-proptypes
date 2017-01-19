import ReactDictionary from './dictionaries/react';

var dictionaries = []
    .concat(ReactDictionary);

var astNodeMap = {};
var docletMap = {};

function docletVarname(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(-1);
}

function docletParentLongname(doclet) {
    return doclet.memberof && doclet.memberof.split(".").slice(0, -1);
}

function parsePropArgs(args) {
    const {type} = args;
    if(type == 'ArrayExpression') {
        /*return args.elements.map(arg => {

        });*/
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
            }
            chain.unshift({
                name: callee && callee.property && callee.property.name,
                arguments: args
            });

            perNode(callee, chain);
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
        dict[name] && dict[name](prop);
    }
}

function addPropToComponent(component, prop) {
    if(!component || !component.doclet) {
        return;
    }
    if(!component.doclet.props) {
        component.doclet.props = [];
    }
    component.doclet.props.push(prop);
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
        if(docletVarname(doclet) != 'propTypes') {
            return;
        }

        // found prop types, start collecting information for the jsdoc prop...

        const name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
        const description = doclet.description;

        var prop = {
            name,
            description,
            optional: true,
            type: {
                names: []
            }
        };

        const node = astNodeMap[e.doclet.meta.code.id];
        const propChain = parsePropChain(node, 'PropTypes');

        // check if the prop chain matches a dictionary we have
        const res = findDictionaryMatchingChain(propChain, dictionaries);
        if(!res) {
            return;
        }

        processProp(prop, res.propChain, res.dict);
        addPropToComponent(docletMap[docletParentLongname(doclet)], prop);
    }
};

export {
    astNodeVisitor,
    handlers
}
