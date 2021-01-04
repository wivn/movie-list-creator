import "./Banner.css";
function Banner({ numOfNominees, isLoaded, error }) {
  if (isLoaded && error) {
    return (
      <div className="banner">ERROR: Please load the page again. Thanks!</div>
    );
  } else if (numOfNominees >= 5) {
    return (
      <div className="banner">
        Congrats! You have selected 5 nominees! Your work is done! Share the current URL so you can let others see who you've nominated!
      </div>
    );
  } else {
    return null;
  }
}
export default Banner;
