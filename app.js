// ========== GLOBAL STATE ==========
let allMovies = [];

// ========== APP INITIALIZATION ==========
window.addEventListener("load", initApp);

function initApp() {
  console.log("initApp: app.js is running 🎉");
  getMovies();

  // Event listeners for filtrering og sortering
  document
    .querySelector("#search-input")
    .addEventListener("input", filterMovies);
  document
    .querySelector("#genre-select")
    .addEventListener("change", filterMovies);
  document
    .querySelector("#sort-select")
    .addEventListener("change", filterMovies);
}



// ========== DATA FETCHING ==========

async function getMovies() {
  console.log("🌐 Henter alle movies fra JSON...");

  const response = await fetch(
    "https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/movies.json"
  );
  allMovies = await response.json();

  console.log(`📊 JSON data modtaget: ${allMovies.length} movies`);

  populateGenreDropdown();
  displayMovies(allMovies);
}

// ========== GENRE DROPDOWN ==========

function populateGenreDropdown() {
  const genreSelect = document.querySelector("#genre-select");
  const genres = new Set();

  // Saml alle unikke genrer
  for (const movie of allMovies) {
    for (const genre of movie.genre) {
      genres.add(genre);
    }
  }

  // Fjern gamle options undtagen 'Alle genrer'
  genreSelect.innerHTML = '<option value="all">Alle genrer</option>';

  // Sorter og tilføj genres
  const sortedGenres = Array.from(genres).sort();
  for (const genre of sortedGenres) {
    genreSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${genre}">${genre}</option>`
    );
  }
}

// ========== FILTERING & SORTING ==========

function filterMovies() {
  const searchValue = document
    .querySelector("#search-input")
    .value.toLowerCase();
  const genreValue = document.querySelector("#genre-select").value;
  const sortValue = document.querySelector("#sort-select").value;

  // Start med alle movies
  let filteredMovies = allMovies;

  // FILTER 1: Tekstsøgning
  if (searchValue) {
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.title.toLowerCase().includes(searchValue);
    });
  }

  // FILTER 2: Genre filtrering
  if (genreValue !== "all") {
    filteredMovies = filteredMovies.filter((movie) => {
      return movie.genre.includes(genreValue);
    });
  }

  // SORTERING
  if (sortValue === "title") {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "year") {
    filteredMovies.sort((a, b) => b.year - a.year);
  } else if (sortValue === "rating") {
    filteredMovies.sort((a, b) => b.rating - a.rating);
  }

  displayMovies(filteredMovies);
}

// ========== DISPLAY FUNCTIONS ==========

function displayMovies(movies) {
  console.log(`🎬 Viser ${movies.length} movies`);
  document.querySelector("#movie-list").innerHTML = "";

  for (const movie of movies) {
    displayMovie(movie);
  }
}

function displayMovie(movie) {
  const movieList = document.querySelector("#movie-list");

  const movieHTML = `
    <article class="movie-card">
      <img src="${movie.image}" 
           alt="Poster of ${movie.title}" 
           class="movie-poster" />
      <div class="movie-info">
        <h3>${movie.title} <span class="movie-year">(${movie.year})</span></h3>
        <p class="movie-genre">${movie.genre.join(", ")}</p>
        <p class="movie-rating">⭐ ${movie.rating}</p>
        <p class="movie-director"><strong>Director:</strong> ${
          movie.director
        }</p>
      </div>
    </article>
  `;

  movieList.insertAdjacentHTML("beforeend", movieHTML);

  // Tilføj click event (bonus feature)
  const newCard = movieList.lastElementChild;
  newCard.addEventListener("click", function () {
    console.log(`🎬 Klik på: "${movie.title}"`);
    showMovieDetails(movie);
  });
}

// ========== MOVIE DETAILS (BONUS) ==========

function showMovieDetails(movie) {
  console.log("📊 Viser detaljer for:", movie.title);

  const movieInfo = `🎬 ${movie.title} (${movie.year})
🎭 ${movie.genre.join(", ")}
⭐ Rating: ${movie.rating}
🎯 Instruktør: ${movie.director}
👥 Skuespillere: ${movie.actors.join(", ")}

📝 ${movie.description}`;

  alert(movieInfo);

  // TODO: Næste session - lav modal dialog!
}
