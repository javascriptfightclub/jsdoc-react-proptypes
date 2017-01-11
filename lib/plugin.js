"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var defineTags = function defineTags(dictionary) {

    dictionary.defineTag("component", {
        canHaveType: false,
        canHaveName: false,
        onTagged: function onTagged(doclet, tag) {
            doclet.kind = "component";
            doclet.description = tag.value;
        }
    });

    /*dictionary.defineTag("prop", {
        canHaveType: true,
        canHaveName: true,
        mustHaveValue: true,
        onTagged: function(doclet, tag) {
            if(!doclet.props) {
                doclet.props = [];
            }
            doclet.props.push(tag.value);
        }
    });*/

    dictionary.defineTag("context", {
        canHaveType: true,
        canHaveName: true,
        mustHaveValue: true,
        onTagged: function onTagged(doclet, tag) {
            if (!doclet.props) {
                doclet.props = [];
            }
            doclet.props.push(tag.value);
        }
    });
};

var lastSourceName;
var lastComponent;
var lastPropTypes;
var lastDoclets = [];

var astNodeVisitor = {
    visitNode: function visitNode(node, e, parser, currentSourceName) {
        if (currentSourceName != lastSourceName) {
            // reset when we change files
            lastSourceName = currentSourceName;
            lastComponent = null;
            lastPropTypes = null;
            lastDoclets = [];
        }

        if (e && e.event == 'symbolFound' && e.comment != '@undocmented') {
            // when a documented symbol is found
            if (e.comment.indexOf('@component') != -1) {
                lastComponent = e;
                lastPropTypes = null;
            }
        }

        if (lastComponent && node.type == "ExpressionStatement" && node.expression && node.expression.left && node.expression.left.property && node.expression.left.property.name == "propTypes") {
            console.log(node);
        }

        /*
                node.expression.right.properties.forEach(function(prop) {
                    //console.log(prop.loc.start.line, lastDoclets[lastDoclets.length - 1]);
                    lastComponent.doclet.props.push({
                            type: {
                                names: [
                                    "Number",
                                    "Object"
                                ]
                            },
                            description: "<p>Deary me</p>",
                            name: prop.key.name
                        });
                });*/

        //lastPropTypes = lastComponent;

        /*
        e.comment = '@param {Object} wee wee wee';
        e.event = 'jsdocCommentFound';
        e.filename = currentSourceName;
        e.lineno = node.loc.start.line;
        */

        /*
        e.id = 'astnode'+Date.now();
        e.comment = '@component \n hello there \n @param {Object} wee wee wee';
        e.lineno = node.loc.start.line;
        e.filename = currentSourceName;
        e.astnode = node;
        e.code = {
            name: 'propTypes',
            type: "object",
            node: node
        };
        e.event = "symbolFound";
        //e.finishers.push(parser.addDocletRef);
        }
        /*if(node.property && node.property.name == "propTypes") {
        const belongsTo = node.object.name;
        console.log(node);
        console.log(" ");
        }*/
    }
};

exports.defineTags = defineTags;
exports.astNodeVisitor = astNodeVisitor;