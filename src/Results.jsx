function Results({text, items, nominees, updateNominees}) {
  function movieInNominees(imdbID){
    for(var movie of nominees){
      if(movie.imdbID == imdbID){
        return true
      }
    }
    return false
  }
  if(text != ""){
    return (
      <section>
        <h2>Results for "{text}"</h2>
        {
          items.Error && text != ""? <div>{items.Error}</div>: null
        }
      
        
        <ul>
          { 
           items.Search ? items.Search.map((data) => 
            <li key={"result-"+data.imdbID}>
              {data.Title} ({data.Year}) <button disabled={movieInNominees(data.imdbID)} onClick={() => updateNominees([...nominees, data])}>{movieInNominees(data.imdbID) ? 'Nominated' : 'Nominate'}</button>
            </li>) : null
          }
        </ul>
      </section>
    )} else {
      return null;
    }

  
}


export default Results;
