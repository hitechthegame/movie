
  const apiKey = 'abb923f0'; // Replace with your OMDb API key
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const movieContainer = document.getElementById('movie-container');

  function createMovieElement(movie) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Image';

    movieEl.innerHTML = `
      <img src="${poster}" alt="Poster of ${movie.Title}" />
      <div class="movie-details">
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p>
          <a class="trailer-btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' ' + movie.Year + ' official trailer')}" 
             target="_blank" rel="noopener noreferrer">🎬 Watch Trailer on YouTube</a>
        </p>
      </div>
    `;

    return movieEl;
  }

  async function fetchMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === "True") {
        return data;
      } else {
        throw new Error(data.Error);
      }
    } catch (error) {
      throw error;
    }
  }

  async function searchMovies(query) {
    movieContainer.innerHTML = '<p>Loading...</p>';
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        movieContainer.innerHTML = ''; // Clear loading

        // Fetch details for each movie found
        for (let movie of data.Search) {
          try {
            const details = await fetchMovieDetails(movie.imdbID);
            const movieEl = createMovieElement(details);
            movieContainer.appendChild(movieEl);
          } catch (err) {
            console.warn('Error fetching movie details:', err);
          }
        }
      } else {
        movieContainer.innerHTML = `<p class="error">${data.Error}</p>`;
      }
    } catch (error) {
      movieContainer.innerHTML = `<p class="error">Failed to fetch data. Please try again later.</p>`;
      console.error(error);
    }
  }

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      searchMovies(query);
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  document.querySelector(".refreshBtn").addEventListener("click", () => {
    location.reload();
  });
