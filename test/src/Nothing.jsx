/**
 * Nothing here.
 */
class Nothing extends Component {
    render() {
        return <div>Nothing</div>;
    }
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
export default Nothing;
