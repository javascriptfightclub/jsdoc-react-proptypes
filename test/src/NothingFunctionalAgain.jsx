/**
 * NothingFunctional here.
 * @prop {boolean} shout A random required boolean prop
 * @prop {Array<string>} [yellees = []] An array of names of people to yell at
 */
function NothingFunctionalAgain(props) {
    return <div>Nothing</div>;
}

NothingFunctionalAgain.propTypes = {
  shout: React.PropTypes.bool.isRequired,
  yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

NothingFunctionalAgain.defaultProps = {
    yellees: []
};
export default NothingFunctionalAgain;
