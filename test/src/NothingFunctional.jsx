/**
 * NothingFunctional here.
 */
function NothingFunctional(props) {
    return <div>NothingFunctional</div>;
}

NothingFunctional.propTypes = {
  /** A random required boolean prop */
  shout: React.PropTypes.bool.isRequired,

  /** An array of names of people to yell at */
  yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

NothingFunctional.defaultProps = {
    yellees: []
};
export default NothingFunctional;
