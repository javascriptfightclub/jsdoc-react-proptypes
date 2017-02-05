# jsdoc-react-proptypes

Ok. Readme file. Yeah, so this thing lets [jsdoc](https://github.com/jsdoc3/jsdoc) parse [React propTypes](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) and [defaultProps](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) to help auto document your props and related shenanigans. Only works for ES6 syntax right now. PRs are welcome if you need ES5 support.

So right off the bat I just want to say that this thing is a haphazard lean-to of breadsticks and ticky tacky. Like, it works for now because the tests say it works for now, so it does work for now but only in the same way that floating an egg in water is an indicator of whether it's gone off or not. 

Anyway fuck it I've just released `v1.0.0` in preparation for several weeks of bug fixing, followed by a complete rewrite for `v2.0.0` that compensates for too many edge / corner cases and bleeds the scope out way too far in the process, followed by a `v3.0.0` that takes a step back and splits the codebase in seventeen directions with a plugin based architecture that works well only for those who are already familiar with earlier rewrites and the rationale behind them, partly caused by the fact that our docs will be a classic case of "can't see the forest for the trees" and completely miss any useful higher level overview (if for some reason you have to deviate from the example set up in any way, which you almost certainly will, as not being able to facilitate everyone's unique project configurations was the reason for introducing the plugin based architecture in the first place), partly caused by such a massive overhaul of the public facing API that the userbase in general is completely confused about where everything has shifted, and the tutorials will only be updated once people complain about them being a major version out of date, and partly because who really wants to invest so much time into any of this nonsense caused by "move fast and break things", and "what is semver", before a gradual evaporation as everyone starts using anything else but this, and the idea that anyone ever used jsdoc with React becomes as laughable and apparently misguided as XHTML2.0, or at least I hope that's what will happen, minus having to release any major versions above version `v1.x.x`, and minus any of the related issues that may occur with those respective hypothetical new major releases.

But yeah, the code.

```
/**
 * Nothing here.
 */
function Nothing(props) {
    return <div>Nothing</div>;
}

Nothing.propTypes = {
  /** A random required boolean prop */
  shout: React.PropTypes.bool.isRequired,

  /** An array of names of people to yell at */
  yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

Nothing.defaultProps = {
    yellees: []
};
```

is a less duplicative equivalent of

```
/**
 * Nothing here.
 * @prop {boolean} shout A random required boolean prop
 * @prop {Array<string>} [yellees = []] An array of names of people to yell at
 */
function Nothing(props) {
    return <div>Nothing</div>;
}

Nothing.propTypes = {
  shout: React.PropTypes.bool.isRequired,
  yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

Nothing.defaultProps = {
    yellees: []
};
```

Also works with ES6 class components:

```
class NothingAgain extends Component {
    render() {
        return <div>Nothing again</div>;
    }
}

NothingAgain.propTypes = {
  shout: React.PropTypes.bool.isRequired,
  yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

NothingAgain.defaultProps = {
    yellees: []
};

```

And ES6 class components with static member variables, assuming you've got all your babels good.

```
class NothingOnceMore extends Component {

    static propTypes = {
      /** A random required boolean prop */
      shout: React.PropTypes.bool.isRequired,

      /** An array of names of people to yell at */
      yellees: React.PropTypes.arrayOf(React.PropTypes.string)
    };

    static defaultProps = {
        yellees: []
    };

    render() {
        return <div>Nothing once more</div>;
    }
}

```

You get all React's tags and the logic to transform them into jsdoc as part of this. Over time it'd be cool to add other kinds of prop types like [react-immutable-proptypes](https://github.com/HurricaneJames/react-immutable-proptypes). Once added you'll get that for free. Yes, free. Wow. On the flip side who would really even consider a package called `jsdoc-react-proptypes-plugin-react-immutable-proptypes` anyway.

## How to get it

`yarn add jsdoc-react-proptypes --dev` or `npm install jsdoc-react-proptypes --save-dev`

## How to do the thing

In your `conf.json` add:

```
"plugins": [
   "node_modules/jsdoc-react-proptypes/lib/plugin"
],
```

You will know what I'm talking about, because you are using jsdoc. If you are not using jsdoc, then I'm not sure I'd recommend it, but it works better than not having it I guess.

## Other fantasmo things you can do

### Override the inferred type

You might have some `@typedef`s or `@callback`s that obviously don't have corresponding React proptypes. When this happens you can just use jsdoc's regular type syntax with the curly braces to manually set the docuemnted type. In the case below, we have a `@callback OnClick` already doing its thing somewhere.

```
Button.propTypes = {
  /** {OnClick} A random required boolean prop */
  onClick: React.PropTypes.func.isRequired,
};
```

### Override the inferred default value

Overrides the inferred default props. Use syntax like `[=your default value]`.

```
Person.propTypes = {
  /** [=WhackyObjectThing] The person's accoutrements stored in a whacky object thing */
  accoutrements: React.PropTypes.object,
};

Person.defaultProps = {
  accoutrements: WhackyObjectThing(),
};
```

### Override the inferred type and the inferred default value

Guess how.

## Dev

If you want to dev this then I welcome it. Also I'm truly sorry. You'll know what I mean.

 - `npm run build` to build.
 - `npm run dev` to build automatically with watching.
 - `npm run test` to run all the tests.
 - Bulk of the logic is in `src/plugin`.

## License

Do whatever you want with it. 
