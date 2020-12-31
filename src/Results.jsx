import React from "react";
import "./Results.css";

function Results({ text, items, nominees, updateNominees }) {
  function movieInNominees(imdbID) {
    for (var movie of nominees) {
      if (movie.imdbID == imdbID) {
        return true;
      }
    }
    return false;
  }

  return (
    <section className="results">
      <h2 className="results__title">Results for "{text}"</h2>
      {text != "" ? (
        <React.Fragment>
          {items.Error && text != "" ? (
            <div className="results__errortext">{items.Error}</div>
          ) : null}

          <ul className="list">
            {items.Search
              ? items.Search.map((data) => (
                  <li className="list__item" key={"result-" + data.imdbID}>
                    {data.Title} ({data.Year})
                    <button
                      className="list__item__btn"
                      disabled={movieInNominees(data.imdbID)}
                      onClick={() => updateNominees([...nominees, data])}
                    >
                      {movieInNominees(data.imdbID) ? "Nominated" : "Nominate"}
                    </button>
                  </li>
                ))
              : null}
          </ul>
        </React.Fragment>
      ) : null}
    </section>
  );
}

export default Results;
