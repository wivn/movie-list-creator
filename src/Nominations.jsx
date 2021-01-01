import "./Nominations.css";
import Stars from "./Stars.jsx";

function Nominations({
  nominees,
  removeFromNominees,
  setStarRankingsBasedOnID,
  getStarRankingBasedOnID,
}) {
  return (
    <section className="nominations">
      <h2 className="nominations__title">Nominations</h2>
      {nominees.length === 0
        ? <span className="nominations__default">Hey if you look up movies you can add them to your nominees list!</span>
        : null}
      <ul className="list">
        {nominees.map((data) => (
          <li className="list__item" key={"nominee-" + data.imdbID}>
            {data.Title} ({data.Year})
            <button
              className="list__item__btn"
              onClick={() => removeFromNominees(data.imdbID)}
            >
              Remove
            </button>
            <Stars
              updateRanking={(ranking) =>
                setStarRankingsBasedOnID(data.imdbID, ranking)
              }
              ranking={getStarRankingBasedOnID(data.imdbID)}
              id={data.imdbID}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Nominations;
