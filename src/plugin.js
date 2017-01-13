const defineTags = (dictionary) => {

    dictionary.defineTag("component", {
        canHaveType: false,
        canHaveName: false,
        onTagged: (doclet, tag) => {
            doclet.kind = "component";
            doclet.description = tag.value;
        }
    });

    dictionary.defineTag("context", {
        canHaveType: true,
        canHaveName: true,
        mustHaveValue: true,
        onTagged: (doclet, tag) => {
            if(!doclet.props) {
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
       // if(e && e.event == 'symbolFound' && e.comment != '@undocumented')
    }
};

var docletMap = {};

const handlers = {
    newDoclet: (e) => {
        if(!e || !e.doclet || e.doclet.undocumented) {
            return;
        }

        const {doclet} = e;
        docletMap[doclet.longname] = e;

        const parent = doclet.memberof && doclet.memberof.split(".").slice(-1);
        if(parent == 'propTypes') {
            const componentLongname = doclet.memberof.split(".").slice(0, -1);
            var name = doclet.meta && doclet.meta.code && doclet.meta.code.name;
            var description = doclet.description;

            addPropToComponent(docletMap[componentLongname], {
                name,
                description
            });
        }
    }
};

export {
    defineTags,
    astNodeVisitor,
    handlers
}
