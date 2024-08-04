const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'a59df388056a55a434a8836cbdc48450',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  // Register your key at https://www.themoviedb.org/settings/api and
  // enter here
  // Only use this for development or very small projects. You should
  // store your key and make requests from server
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Make request to search
async function searchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
              : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
          }
        </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${formatDate(
                movie.release_date
              )}</small>
            </p>
          </div>
        `;

    document.querySelector('#popular-movies').appendChild(div);
  });
}

// Display 20 most popular tv shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
          ${
            show.poster_path
              ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
              : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
          }
        </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">First Aired: ${formatDate(
                show.first_air_date
              )}</small>
            </p>
          </div>
        `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

// Display 20 most popular actors
async function displayPopularActors() {
  const { results } = await fetchAPIData('person/popular');

  results.forEach((actor) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="/person-details.html?id=${actor.id}">
          ${
            actor.profile_path
              ? `<img
              src="https://image.tmdb.org/t/p/w500${actor.profile_path}"
              class="card-img-top"
              alt="${actor.name}"
            />`
              : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${actor.name}"
          />`
          }
        </a>
          <div class="card-body">
            <h5 class="card-title">${actor.name}</h5>
            <p class="card-text">
              <small class="text-muted">Known for: ${
                actor.known_for_department
              }</small>
            </p>
          </div>
        `;

    document.querySelector('#popular-actors').appendChild(div);
  });
}

// Display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieId}`);
  const credits = await fetchAPIData(`movie/${movieId}/credits`);

  // Overlay for backdrop image
  displayBackdropImage('movie', movie.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
      ${
        movie.poster_path
          ? `<img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />`
          : `<img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
      />`
      }
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${formatDate(
          movie.release_date
        )}</p>
        <p>
          ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${
          movie.homepage
        }" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
      </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${
              isZero(movie.budget)
                ? "Can't find the budget for the movie"
                : addCommasToNumber(movie.budget)
            }</li>
            <li><span class="text-secondary">Revenue:</span> ${
              isZero(movie.revenue)
                ? "Can't find the revenue for the movie"
                : addCommasToNumber(movie.revenue)
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            <li><span class="text-secondary">
            Director:</span> ${getDirectors(credits).join(', ')}</li>
          </ul>
          <h4>Actors</h4>
          <div class="list-group actors">
          ${getActors(credits).join(', ')}
          </div>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${movie.production_companies
              .map((company) => `<span>${company.name}</span>`)
              .join(', ')}
          </div>
        </div>`;

  document.querySelector('#movie-details').appendChild(div);
}

// Display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await fetchAPIData(`tv/${showId}`);
  const credits = await fetchAPIData(`tv/${showId}/credits`);

  // Overlay for backdrop image
  displayBackdropImage('tv', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
      ${
        show.poster_path
          ? `<img
          src="https://image.tmdb.org/t/p/w500${show.poster_path}"
          class="card-img-top"
          alt="${show.name}"
        />`
          : `<img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${show.name}"
      />`
      }
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">First Aired: ${formatDate(
          show.first_air_date
        )}</p>
        <p>
          ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${
          show.homepage
        }" target="_blank" class="btn">Visit show Homepage</a>
      </div>
      </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episodes:</span>
              ${show.number_of_episodes}
              </li>
              <li><span class="text-secondary">Last Episode to Air:</span> ${
                show.last_episode_to_air.name
              } </li>
            <li><span class="text-secondary">Last Aired:</span> 
              ${formatDate(show.last_episode_to_air.air_date)}</li>
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Actors</h4>
          <div class="list-group actors">
          ${getActors(credits).join(', ')}
          </div>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${show.production_companies
              .map((company) => `<span>${company.name}</span>`)
              .join(', ')}
          </div>
        </div>`;

  document.querySelector('#show-details').appendChild(div);
}

// Display person details
async function displayPersonDetails() {
  const personId = window.location.search.split('=')[1];

  const person = await fetchAPIData(`person/${personId}`);
  const credits = await fetchAPIData(`person/${personId}/combined_credits`);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
      ${
        person.profile_path
          ? `<img
          src="https://image.tmdb.org/t/p/w500${person.profile_path}"
          class="card-img-top"
          alt="${person.name}"
        />`
          : `<img
        src="../images/no-image.jpg"
        class="card-img-top"
        alt="${person.name}"
      />`
      }
      </div>
      <div>
        <h2>${person.name}</h2>
        <p class="text-muted">Born: ${formatDate(person.birthday)}</p>
                <p class="text-muted">Place of Birth: ${
                  person.place_of_birth
                }</p>
<p class="text-muted">Died: ${
    person.deathday ? formatDate(person.birthday) : '/'
  }</p>
  <p class="text-muted">Known For: ${person.known_for_department}</p>
  <div class="list-group">
  <h4>Appeared in:</h4>
  ${getMovieCredits(credits).join(', ')}
          </div>

        <a href="${
          person.homepage
        }" target="_blank" class="btn">Visit show Homepage</a>
        </div>
        </div>
          <div class="details-bottom">
            <h2>Biography</h2>
            
            <div class="list-group">
              ${person.biography}
            </div>
          </div>`;

  document.querySelector('#show-details').appendChild(div);
}

// Display backdrop image on details pages
function displayBackdropImage(type, backdropPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${backdropPath}')`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.15';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// Search Movies/Shows
async function search() {
  const queryString = document.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

    global.search.type === 'person'
      ? displaySearchResultsActors(results)
      : displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term and select a type.');
  }
}

function displaySearchResults(results) {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="${global.search.type}-details.html?id=${result.id}">
          ${
            result.poster_path
              ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? result.title : result.name
              }"
            />`
              : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
          />`
          }
        </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === 'movie' ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === 'movie'
                  ? formatDate(result.release_date)
                  : formatDate(result.first_air_date)
              }</small>
            </p>
          </div>
        `;

    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

function displaySearchResultsActors(results) {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="/person-details.html?id=${result.id}">
          ${
            result.profile_path
              ? `<img
              src="https://image.tmdb.org/t/p/w500${result.profile_path}"
              class="card-img-top"
              alt="${result.name}"
            />`
              : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${result.name}"
          />`
          }
        </a>
          <div class="card-body">
            <h5 class="card-title">${result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Known For: ${
                result.known_for_department
              }</small>
            </p>
          </div>
        `;

    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

// Create and display pagination for search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector('#pagination').appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Previous page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// Display Slider movies
async function displaySliderMovies() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
          1
        )} / 10
      </h4>
            `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

// Display Slider tv shows
async function displaySliderShows() {
  const { results } = await fetchAPIData('tv/on_the_air');

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${
      show.name
    }" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(
          1
        )} / 10
      </h4>
            `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Show Alert

function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

function isZero(num) {
  return num === 0;
}

// Get the directors
function getDirectors(credits) {
  const listOfDirectors = [];
  credits.cast.forEach((actor) => {
    if (
      actor.known_for_department === 'Directing' ||
      actor.known_for_department === 'Writing'
    ) {
      listOfDirectors.push(actor.name);
    }
  });

  if (listOfDirectors.length === 0) {
    return ["Can't find directors for this movie."];
  } else {
    return listOfDirectors;
  }
}

// Get the actors
function getActors(credits) {
  const listOfActors = [];
  credits.cast.forEach((actor) => {
    if (actor.known_for_department === 'Acting') {
      listOfActors.push(actor.name);
    }
  });

  if (listOfActors.length === 0) {
    return ["Can't find actors for this movie or show."];
  } else if (listOfActors.length > 5) {
    return listOfActors.slice(0, 5);
  } else {
    return listOfActors;
  }
}

// Get the movies of the actor
function getMovieCredits(credits) {
  const listOfMovies = [];
  credits.cast.forEach((details) => {
    listOfMovies.push(details.title);
  });

  const filteredArray = listOfMovies.filter((element) => element !== undefined);

  if (filteredArray.length === 0) {
    return ["Can't find movies or show of this person."];
  } else if (filteredArray.length > 50) {
    return filteredArray.slice(0, 50);
  } else {
    return filteredArray;
  }
}

// Format date to european style
const formatDate = (date) =>
  date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0];

// Function adds commas to numbers
function addCommasToNumber(number) {
  return '$' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySliderMovies();
      displayPopularMovies();
      break;
    case '/shows.html':
      displaySliderShows();
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/person-details.html':
      displayPersonDetails();
      break;
    case '/search.html':
      search();
      break;
    case '/actors.html':
      displayPopularActors();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
