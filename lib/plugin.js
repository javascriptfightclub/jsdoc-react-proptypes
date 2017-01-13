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

/*
function isPropTypesNode(node) {
    return node.type == "ExpressionStatement"
        && node.expression
        && node.expression.left
        && node.expression.left.property
        && node.expression.left.property.name == "propTypes";
}

function getPropTypesArray(node) {
    return node.expression.right.properties;
}
*/

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
        // if(e && e.event == 'symbolFound' && e.comment != '@undocumented')
    }
};

var docletMap = {};

var handlers = {
    newDoclet: function newDoclet(e) {
        if (!e || !e.doclet || e.doclet.undocumented) {
            return;
        }

        var doclet = e.doclet;

        docletMap[doclet.longname] = e;

        var parent = doclet.memberof && doclet.memberof.split(".").slice(-1);
        if (parent == 'propTypes') {
            var componentLongname = doclet.memberof.split(".").slice(0, -1);
            var name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
            var description = doclet.description;

            addPropToComponent(docletMap[componentLongname], {
                name: name,
                description: description
            });
        }
    }
};

exports.defineTags = defineTags;
exports.astNodeVisitor = astNodeVisitor;
exports.handlers = handlers;