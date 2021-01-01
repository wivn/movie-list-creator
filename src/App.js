import React from "react";
import logo from "./logo.svg";
import Results from "./Results.jsx";
import Banner from "./Banner.jsx";
import SearchBar from "./SearchBar.jsx";
import Nominations from "./Nominations.jsx";
import "./App.css";


// TODO: Ensure exceeds specification

// TODO: Run grep searching for all todos

// TODO: Run the prettier formatting tool one last time

// TODO: Create README.md with screenshots

function App({ history }) {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [text, setText] = React.useState("");
  const [nominees, setNominees] = React.useState([]);
  const [starRankings, setStarRankings] = React.useState([]);

  React.useEffect(() => {
    if (history.location.pathname != "/") {
      var movieIDsWithRanking = history.location.pathname
        .split("/id=")[1]
        .split(",");
      var newRankings = [];
      var onlyMovieIDs = [];
      for (var movieData of movieIDsWithRanking) {
        var movieID = movieData.split("&")[0];
        var movieRankingData = {
          imdbID: movieID,
          ranking: Number(movieData.split("&")[1]),
        };
        onlyMovieIDs.push(movieID);
        newRankings.push(movieRankingData);
      }

      getMoviesBasedOnID(onlyMovieIDs)
        .then((values) => Promise.all(values.map((resp) => resp.json())))
        .then((results) => {
          updateNominees(results, newRankings);
        },
        (error) => {
          console.log("error", error)
          setIsLoaded(true);
          setError(error);
        });
    }
  }, []); // TODO: Fix depednecy, maybe I should use, useCallback on updateNominees?

  const getMovies = (text) => {
    fetch(`http://www.omdbapi.com/?apikey=53f20b78&s=${text}&page=1&type=movie`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  React.useEffect(() => {
    // when nominees or star rankings changes, update the URL
    var idSuffix = nominees
      .map((movie, index) => {
        var joiner = ",";
        if (index == nominees.length - 1) {
          joiner = "";
        }
        return (
          movie.imdbID + "&" + getStarRankingBasedOnID(movie.imdbID) + joiner
        );
      })
      .join("");
    if (idSuffix != "") {
      history.replace("/id=" + idSuffix);
    }
  }, [nominees, starRankings]);
  function setStarRankingsBasedOnID(imdbID, ranking) {
    var newRankings = starRankings.filter((movie) => movie.imdbID != imdbID);
    newRankings.push({ imdbID, ranking });
    setStarRankings(newRankings);
  }
  function getStarRankingBasedOnID(imdbID) {
    const data = starRankings.filter(
      (movieRanking) => movieRanking.imdbID == imdbID
    );
    if (data.length != 0) {
      return data[0].ranking;
    } else {
      return 0;
    }
  }
  function removeFromNominees(imdbID) {
    // Ensure URL gets cleared as well
    if (nominees.length == 1) {
      history.replace("/");
    }
    updateNominees(nominees.filter((movie) => movie.imdbID != imdbID));
  }
  function updateNominees(nominees, mostUpToDateStarRankings = null) {
    if (mostUpToDateStarRankings) {
      setStarRankings(mostUpToDateStarRankings);
    } else {
      // remove unneeded rankings
      var newRankings = starRankings.filter((movie) =>
        nominees.some((ranking) => movie.imdbID == ranking.imdbID)
      );
      // add missing ranking
      for (var movie of nominees) {
        if (!starRankings.some((ranking) => ranking.imdbID == movie.imdbID)) {
          newRankings.push({ imdbID: movie.imdbID, ranking: 0 });
        }
      }
      setStarRankings(newRankings);
    }

    setNominees(nominees);
  }
  return (
    <div>
      <header className="head">
        <h1 className="title">Movie List Creator</h1>
      </header>
      <main className="app">
        <Banner isLoaded={isLoaded} error={error} numOfNominees={nominees.length} />
        <SearchBar setText={setText} getMovies={getMovies} text={text} />

        <section className="app__main">
          <Results
            text={text}
            nominees={nominees}
            items={items}
            updateNominees={updateNominees}
          />

          <Nominations
            nominees={nominees}
            removeFromNominees={removeFromNominees}
            setStarRankingsBasedOnID={setStarRankingsBasedOnID}
            getStarRankingBasedOnID={getStarRankingBasedOnID}
          />
        </section>
        <div>
          Icons made by{" "}
          <a href="https://icon54.com/" title="Pixel perfect">
            Pixel perfect
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </main>
    </div>
  );
}

function getMoviesBasedOnID(ids) {
  return Promise.all(
    ids.map((id) => fetch(`http://www.omdbapi.com/?apikey=53f20b78&i=${id}`))
  );
}

export default App;
