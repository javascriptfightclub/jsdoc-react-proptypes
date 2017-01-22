import test from 'ava';
import fs from 'fs';
import {fromJS} from 'immutable';

const taffy = fromJS(JSON.parse(fs.readFileSync("output/taffy.json")));
const es6 = taffy.find(ii => ii.get('longname') == 'ES6Component');
const es5 = taffy.find(ii => ii.get('longname') == 'ES5Component');
const mod = taffy.find(ii => ii.get('longname') == 'module:Module~ModuleComponent');

function getProp(doclet, propName, match) {
    const prop = doclet
        .get('properties')
        .find(ii => ii.get('name') == propName);

    return prop ? prop.toJS() : null;
}

//
// ES6
//

test('ES6 optionalArray prop is documented correctly', tt => {
    const prop = {
        name: "optionalArray",
        description: "<p>An array</p>",
        optional: true,
        type: {
            names: [
                "Array"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalArray'), prop);
});

test('ES6 optionalBool prop is documented correctly', tt => {
    const prop = {
        name: "optionalBool",
        description: "<p>A boolean</p>",
        optional: true,
        type: {
            names: [
                "boolean"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalBool'), prop);
});

test('ES6 optionalFunc prop is documented correctly (it adds no types)', tt => {
    const prop = {
        name: "optionalFunc",
        description: "<p>A function</p>",
        optional: true,
        type: {
            names: []
        }
    };
    tt.deepEqual(getProp(es6, 'optionalFunc'), prop);
});

test('ES6 optionalNumber prop is documented correctly', tt => {
    const prop = {
        name: "optionalNumber",
        description: "<p>A number</p>",
        optional: true,
        type: {
            names: [
                "number"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalNumber'), prop);
});

test('ES6 optionalNumberWithMarkdown prop is documented correctly', tt => {
    const prop = {
        name: "optionalNumberWithMarkdown",
        description: "<p>A number (and a <code>markdown</code> <em>comment!</em>)</p>",
        optional: true,
        type: {
            names: [
                "number"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalNumberWithMarkdown'), prop);
});

test('ES6 optionalObject prop is documented correctly', tt => {
    const prop = {
        name: "optionalObject",
        description: "<p>An object with a jsdoc type</p>",
        optional: true,
        type: {
            names: [
                "Object"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalObject'), prop);
});

test('ES6 optionalString prop is documented correctly', tt => {
    const prop = {
        name: "optionalString",
        description: "<p>A string</p>",
        optional: true,
        type: {
            names: [
                "string"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalString'), prop);
});


/*
  optionalSymbol: React.PropTypes.symbol,
  optionalNode: PropTypes.node,
  optionalElement: React.PropTypes.element,*/

test('ES6 optionalMessage prop is documented correctly', tt => {
    const prop = {
        name: "optionalMessage",
        description: "<p>You can also declare that a prop is an instance of a class. This uses JS's instanceof operator.</p>",
        optional: true,
        type: {
            names: [
                "Message"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalMessage'), prop);
});

test('ES6 optionalEnum prop is documented correctly', tt => {
    const prop = {
        name: "optionalEnum",
        description: "<p>You can ensure that your prop is limited to specific values by treating it as an enum.</p>",
        optional: true,
        type: {
            names: [
                "'News'",
                "'Photos'"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalEnum'), prop);
});

test('ES6 optionalUnion prop is documented correctly', tt => {
    const prop = {
        name: "optionalUnion",
        description: "<p>An object that could be one of many types</p>",
        optional: true,
        type: {
            names: [
                "string",
                "number",
                "Message"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalUnion'), prop);
});


test('ES6 optionalArrayOf prop is documented correctly', tt => {
    const prop = {
        name: "optionalArrayOf",
        description: "<p>An array of a certain type</p>",
        optional: true,
        type: {
            names: [
                "Array.<number>",
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalArrayOf'), prop);
});

test('ES6 optionalObjectOf prop is documented correctly', tt => {
    const prop = {
        name: "optionalObjectOf",
        description: "<p>An object with property values of a certain type</p>",
        optional: true,
        type: {
            names: [
                "Object.<string, number>",
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalObjectOf'), prop);
});

test('ES6 optionalObjectWithShape prop is documented correctly', tt => {
    const props = [
        {
            optional: true,
            type: {
                names: [
                    "Object"
                ]
            },
            name: "optionalObjectWithShape",
            description: "<p>An object taking on a particular shape</p>"
        },
        {
            optional: true,
            type: {
                names: [
                    "string"
                ]
            },
            name: "optionalObjectWithShape.color",
            description: "<p>Shapes can also have documented properties</p>"
        },
        {
            optional: false,
            type: {
                names: [
                    "number"
                ]
            },
            name: "optionalObjectWithShape.fontSize",
            description: "<p>Like these</p>"
        }
    ];
    tt.deepEqual([
        getProp(es6, 'optionalObjectWithShape'),
        getProp(es6, 'optionalObjectWithShape.color'),
        getProp(es6, 'optionalObjectWithShape.fontSize')
    ], props);
});

test('ES6 requiredString prop is documented correctly', tt => {
    const prop = {
        name: "requiredString",
        description: "<p>You can chain any of the above with <code>isRequired</code> to make sure a warning is shown if the prop isn't provided.</p>",
        optional: false,
        type: {
            names: [
                "string"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'requiredString'), prop);
});

test('ES6 requiredAny prop is documented correctly', tt => {
    const prop = {
        name: "requiredAny",
        description: "<p>A value of any data type</p>",
        optional: false,
        type: {
            names: [
                "*"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'requiredAny'), prop);
});

test('ES6 custom function prop is documented correctly (it adds no types)', tt => {
    const prop = {
        name: "customProp",
        description: "<p>You can also specify a custom validator.</p>",
        optional: true,
        type: {
            names: []
        }
    };
    tt.deepEqual(getProp(es6, 'customProp'), prop);
});

test('ES6 customArrayProp prop is documented correctly', tt => {
    const prop = {
        name: "customArrayProp",
        description: "<p>You can also supply a custom validator to <code>arrayOf</code>.</p>",
        optional: true,
        type: {
            names: [
                "Array",
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'customArrayProp'), prop);
});

test('ES6 customObjectProp prop is documented correctly', tt => {
    const prop = {
        name: "customObjectProp",
        description: "<p>You can also supply a custom validator to <code>objectOf</code>.</p>",
        optional: true,
        type: {
            names: [
                "Object",
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'customObjectProp'), prop);
});

//
// ES5
//

test('ES5 prop is documented correctly', tt => {
    const prop = {
        name: "firstName",
        description: "<p>Name string</p>",
        optional: true,
        type: {
            names: [
                "string"
            ]
        }
    };
    tt.deepEqual(getProp(es5, 'firstName'), prop);
});
