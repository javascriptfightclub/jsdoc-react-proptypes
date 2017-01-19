import test from 'ava';
import fs from 'fs';
import {fromJS} from 'immutable';

const taffy = fromJS(JSON.parse(fs.readFileSync("output/taffy.json")));
const es6 = taffy.find(ii => ii.get('longname') == 'ES6Component');
const es5 = taffy.find(ii => ii.get('longname') == 'ES5Component');
const mod = taffy.find(ii => ii.get('longname') == 'module:Module~ModuleComponent');

function getProp(doclet, propName, match) {
    const prop = doclet
        .get('props')
        .find(ii => ii.get('name') == propName);

    return prop ? prop.toJS() : null;
}

//
// ES6
//

test('ES6 optionalArray prop is documented correctly', tt => {
    const prop = {
        "name": "optionalArray",
        "description": "<p>An array</p>",
        "optional": true,
        "type": {
            "names": [
                "Array"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalArray'), prop);
});



test('ES6 optionalBool prop is documented correctly', tt => {
    const prop = {
        "name": "optionalBool",
        "description": "<p>A boolean</p>",
        "optional": true,
        "type": {
            "names": [
                "boolean"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalBool'), prop);
});

test('ES6 optionalFunc prop is documented correctly', tt => {
    const prop = {
        "name": "optionalFunc",
        "description": "<p>A function</p>",
        "optional": true,
        "type": {
            "names": [
                "Function"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalFunc'), prop);
});

test('ES6 optionalNumber prop is documented correctly', tt => {
    const prop = {
        "name": "optionalNumber",
        "description": "<p>A number (and a <code>markdown</code> <em>comment!</em>)</p>",
        "optional": true,
        "type": {
            "names": [
                "number"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalNumber'), prop);
});

test('ES6 optionalObject prop is documented correctly', tt => {
    const prop = {
        "name": "optionalObject",
        "description": "<p>An object with a jsdoc type</p>",
        "optional": true,
        "type": {
            "names": [
                "Object"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalObject'), prop);
});

test('ES6 optionalString prop is documented correctly', tt => {
    const prop = {
        "name": "optionalString",
        "description": "<p>A string</p>",
        "optional": true,
        "type": {
            "names": [
                "string"
            ]
        }
    };
    tt.deepEqual(getProp(es6, 'optionalString'), prop);
});


/*
  optionalSymbol: React.PropTypes.symbol,
  optionalNode: PropTypes.node,
  optionalElement: React.PropTypes.element,
  optionalMessage: React.PropTypes.instanceOf(Message),
  optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),
  optionalUnion: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.instanceOf(Message)
  ]),
  optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),
  optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),
  optionalObjectWithShape: React.PropTypes.shape({
    color: React.PropTypes.string,
    fontSize: React.PropTypes.number
  }),
  requiredFunc: React.PropTypes.func.isRequired,
  requiredAny: React.PropTypes.any.isRequired,
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  customArrayProp: React.PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })

test('dummy test', tt => {
    tt.true(true);
});
*/
