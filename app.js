// ...existing code...
"use strict";

// Gem alle movies efter load
let allMovies = [];

// Movie-list container sættes når DOM er klar
let movieListContainer;

// ========== DISPLAY SINGLE MOVIE ==========
function displayMovie(movieObject) {
  if (!movieListContainer) return;

  const genreString = Array.isArray(movieObject.genre)
    ? movieObject.genre.join(", ")
    : movieObject.genre || "";
  const actorsString = Array.isArray(movieObject.actors)
    ? movieObject.actors.join(", ")
    : movieObject.actors || "";

  const movieHTML = `
    <article class="movie-card" data-description="${
      movieObject.description || ""
    }">
      <img src="${movieObject.image}" 
           alt="Poster of ${movieObject.title}" 
           class="movie-poster" />
      <div class="movie-info">
        <h3>${movieObject.title} <span class="movie-year">(${
    movieObject.year
  })</span></h3>
        <p class="movie-genre">${genreString}</p>
        <p class="movie-rating">⭐ ${movieObject.rating}</p>
        <p class="movie-director"><strong>Director:</strong> ${
          movieObject.director
        }</p>
        <p class="movie-actors"><strong>Stars:</strong> ${actorsString}</p>
      </div>
    </article>
  `;

  movieListContainer.insertAdjacentHTML("beforeend", movieHTML);
}

// ========== DISPLAY ALL MOVIES ==========
function displayMovies(movieArray) {
  if (!movieListContainer) return;

  movieListContainer.innerHTML = "";

  for (const movie of movieArray) {
    displayMovie(movie);
  }

  console.log(`🎉 ${movieArray.length} movies vist!`);
}

// ========== LOAD MOVIES FROM JSON ==========
async function loadMovies() {
  console.log("🌐 Henter movies fra JSON...");

  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/cederdorff/race/master/data/movies.json"
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const moviesFromJSON = await response.json();

    allMovies = moviesFromJSON; // gem globalt
    console.log("📊 Data modtaget:", moviesFromJSON.length, "movies");

    displayMovies(allMovies);
  } catch (err) {
    console.error("Fejl ved hentning af movies:", err);
  }
}

// ========== SØGE-FUNKTIONALITET ==========
function performSearch(query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();

  if (!q) {
    displayMovies(allMovies);
    return;
  }

  const filtered = allMovies.filter((m) => {
    const title = (m.title || "").toLowerCase();
    const director = (m.director || "").toLowerCase();
    const description = (m.description || "").toLowerCase();
    const genres = Array.isArray(m.genre)
      ? m.genre.join(" ").toLowerCase()
      : (m.genre || "").toLowerCase();
    const actors = Array.isArray(m.actors)
      ? m.actors.join(" ").toLowerCase()
      : (m.actors || "").toLowerCase();

    return (
      title.includes(q) ||
      director.includes(q) ||
      description.includes(q) ||
      genres.includes(q) ||
      actors.includes(q)
    );
  });

  displayMovies(filtered);
  console.log(`🔎 Søgning "${q}" gav ${filtered.length} resultater`);
}

function setupSearch() {
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#search-input");

  if (!form || !input) {
    console.warn(
      "Søgeform eller input ikke fundet (brug #search-form og #search-input)"
    );
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch(input.value);
  });

  // Live-søgning mens brugeren skriver
  input.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });
}

// ===== APP INITIALISERING =====
document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  movieListContainer = document.querySelector("#movie-list");
  if (!movieListContainer) {
    console.error(
      'Element med id="movie-list" ikke fundet i DOM. Ingen visning vil ske.'
    );
    return;
  }

  setupSearch();
  loadMovies();
}
// ...existing code...
