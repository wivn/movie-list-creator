import "./Banner.css";
function Banner({ numOfNominees, isLoaded, error }) {
  if (isLoaded && error) {
    return (
      <div className="banner">ERROR: Please load the page again. Thanks!</div>
    );
  } else if (numOfNominees >= 5) {
    return (
      <div className="banner">
        Congrats! You have selected 5 or more nominees!
      </div>
    );
  } else {
    return null;
  }
}
export default Banner;
