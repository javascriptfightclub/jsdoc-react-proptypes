/**
 * Nothing here.
 * @prop {boolean} shout A random required boolean prop
 * @prop {Array<string>} [yellees = []] An array of names of people to yell at
 */
function NothingAgain(props) {
    return <div>Nothing</div>;
}

NothingAgain.propTypes = {
  shout: React.PropTypes.bool.isRequired,
  yellees: React.PropTypes.arrayOf(React.PropTypes.string)
};

NothingAgain.defaultProps = {
    yellees: []
};
export default NothingAgain;
