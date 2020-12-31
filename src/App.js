import React from 'react';
import logo from './logo.svg';
import Results from "./Results.jsx";
import Stars from "./Stars.jsx";

// ooooo I could make shareable links using the IDs and the URLs, that might be cool (DONE)

// Give your nominees a ranking?  out of stars (which would be neat) and ensure it's saved to the URL (DONE)

// TODO: Ensure that setNominees is only accessed through the update nominees function

function App({history}) {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [text, setText] = React.useState("");
  const [nominees, setNominees] = React.useState([]);
  const [starRankings, setStarRankings] = React.useState([]);
  
  function onSubmit(event){
    event.preventDefault()
    setText("")
  }
  React.useEffect(()=> {
    console.log("PATHNAME", history.location.pathname)
    if(history.location.pathname != "/"){
      var movieIDsWithRanking = history.location.pathname.split("/id=")[1].split(",")
      var newRankings = []
      var onlyMovieIDs = []
      for(var movieData of movieIDsWithRanking){
        var movieID = movieData.split("&")[0]
        var movieRankingData = {imdbID: movieID, ranking: Number(movieData.split("&")[1])}
        onlyMovieIDs.push(movieID)
        newRankings.push(movieRankingData)
      }
      
      
      getMoviesBasedOnID(onlyMovieIDs)
      .then((values) => Promise.all(values.map((resp) => resp.json())))
      .then((results) => {
        updateNominees(results, newRankings)        
        
        
      }
        
      )

      
    }
    
    // TODO: Add error handling for the URL ids (just make it add an error banner if it's wrong) 
  }, []) // TODO: Fix depednecy, maybe I should use, useCallback on updateNominees?

  
  const getMovies = (text) => {
    console.log("Text is:", text)
      fetch(`http://www.omdbapi.com/?apikey=53f20b78&s=${text}&page=1&type=movie`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result)
          console.log("The result is", result, isLoaded);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    }
  React.useEffect(() => {
    if(nominees.length >= 5){
      // TODO: Make this an actual banner that appears at the top of the site
      console.log("You have filled up all your nominee spots! Congrats!")
    }
  }, [nominees])
  
  React.useEffect(() => {
      // when nominees or star rankings changes, update the URL
    var idSuffix = nominees.map((movie, index) => { 
      var joiner = ","
      if(index == nominees.length - 1){
        joiner = ""
      }
      return movie.imdbID + "&" + getStarRankingBasedOnID(movie.imdbID) + joiner
    }).join("")
    if(idSuffix != ""){
      history.replace('/id='+idSuffix);
    }
    
    
    
  }, [nominees, starRankings])
  function setStarRankingsBasedOnID(imdbID, ranking){
    console.log(imdbID)
    var newRankings = starRankings.filter((movie) => 
      movie.imdbID != imdbID
    )
    console.log(newRankings)
    newRankings.push({imdbID, ranking})
    setStarRankings(newRankings)
  }
  function getStarRankingBasedOnID(imdbID){
    const data = starRankings.filter((movieRanking) => movieRanking.imdbID == imdbID)
    if(data.length != 0){
      return data[0].ranking
    } else {
      return 0
    }
  }
  function removeFromNominees(imdbID){
    // Ensure URL gets cleared as well
    if(nominees.length == 1){
      history.replace('/');
    }
    updateNominees(nominees.filter((movie) => movie.imdbID != imdbID))
  }
  function updateNominees(nominees, mostUpToDateStarRankings = null){
    if(mostUpToDateStarRankings){
      setStarRankings(mostUpToDateStarRankings)
    } else {
      // remove unneeded rankings
      var newRankings = starRankings.filter((movie) => nominees.some((ranking) => movie.imdbID == ranking.imdbID))
      // add missing ranking
      for(var movie of nominees){
        if(!starRankings.some((ranking) => ranking.imdbID == movie.imdbID)){
          newRankings.push({imdbID: movie.imdbID, ranking: 0})
        }
      }
      setStarRankings(newRankings)
    }
    
    setNominees(nominees)
    
    
  }
  return (
    <div>
      <header>
        Movie List Creator
      </header>
      <section>
      <form onSubmit={(event) => onSubmit(event)}>
        <label>Movie: 
          <input 
            onChange={(event) => {
              setText(event.target.value)
              getMovies(event.target.value)
            }
            } 
            value={text} 
            type="text"/>
        </label>
        <input  value="Submit" type="submit"/>
      </form>
      </section>
      <section>
        <Results text={text} nominees={nominees} items={items} updateNominees={updateNominees}/>
      </section>
      <section>
        <h2>Nominations</h2>
        {nominees.length == 0 ? "Hey if you look up movies you can add them to your nominees list!" :null}
        <ul>
        {
          nominees.map((data) => <li key={"nominee-"+data.imdbID}>
              {data.Title} ({data.Year})
              <button onClick={() => removeFromNominees(data.imdbID)}>Remove</button>
              <Stars updateRanking={(ranking) => setStarRankingsBasedOnID(data.imdbID, ranking)} ranking={getStarRankingBasedOnID(data.imdbID)} id={data.imdbID}/>
            </li>)
        }
        </ul>
      </section>
<div>Icons made by <a href="https://icon54.com/" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

    </div>
  );
}

function getMoviesBasedOnID(ids){
  
  return Promise.all(ids.map((id) => fetch(`http://www.omdbapi.com/?apikey=53f20b78&i=${id}`)))
      
}

export default App;
