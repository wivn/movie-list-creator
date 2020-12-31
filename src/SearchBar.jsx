function SearchBar({ setText, getMovies, text }) {
  return (
    <section className="searchbar">
      <label htmlFor="search" className="searchbar__label">
        Movie title:{" "}
      </label>
      <input
        id="search"
        className="searchbar__input"
        onChange={(event) => {
          setText(event.target.value);
          getMovies(event.target.value);
        }}
        placeholder={"Movie name goes here..."}
        value={text}
        type="text"
      />
    </section>
  );
}

export default SearchBar;
