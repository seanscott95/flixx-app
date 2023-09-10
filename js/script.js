const global = {
  currentPage: window.location.pathname,
  API_KEY: 'db68eaabd90d3c16efb79950c0a69cc3',
  API_URL: 'https://api.themoviedb.org/3/',
};

// Fetch data from TMDB API
const fetchAPIData = async (endpoint) => {
  showSpinner();
  const response = await fetch(
    `${global.API_URL}${endpoint}?api_key=${global.API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
};

const displayPopularMovies = async () => {
  const { results } = await fetchAPIData('movie/popular');

  const popMovieEl = document.querySelector('#popular-movies');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href='movie-details.html?id=${movie.id}'>
        ${
          movie.poster_path
            ? `<img
            src='https://image.tmdb.org/t/p/w500${movie.poster_path}'
            class='card-img-top'
            alt= ${movie.title}
          />`
            : `<img
          src='../images'
          class='card-img-top'
          alt= ${movie.title}
        />`
        }
      </a>
      <div class='card-body'>
        <h5 class='card-title'>${movie.title}</h5>
        <p class'card-text'>
          <small class='text-muted'>Release: ${movie.release_date}</small>
        </p>
      </div>
    `;

    popMovieEl.append(div);
  });
};

const displayPopularShows = async () => {
  const { results } = await fetchAPIData('tv/popular');

  const popShowEl = document.querySelector('#popular-shows');

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href='show-details.html?id=${show.id}'>
        ${
          show.poster_path
            ? `<img
            src='https://image.tmdb.org/t/p/w500${show.poster_path}'
            class='card-img-top'
            alt= ${show.name}
          />`
            : `<img
          src='../images'
          class='card-img-top'
          alt= ${show.name}
        />`
        }
      </a>
      <div class='card-body'>
        <h5 class='card-title'>${show.name}</h5>
        <p class'card-text'>
          <small class='text-muted'>Release: ${show.first_aired_date}</small>
        </p>
      </div>
    `;

    popShowEl.append(div);
  });
};

const displayMovieDetails = async () => {
  const movieID = window.location.search.split('=')[1];
  console.log("mID", movieID)
  const movie = await fetchAPIData(`movie/${movieID}`);

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
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
          ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
          movie.budget
        )}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
          movie.revenue
        )}</li>
        <li><span class="text-secondary">Runtime:</span> ${
          movie.runtime
        } minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${movie.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(', ')}
      </div>
    </div>
  `;

  document.querySelector('#movie-details').append(div);
};

// Utility Functions
const showSpinner = () => {
  document.querySelector('.spinner').classList.add('show');
};
const hideSpinner = () => {
  document.querySelector('.spinner').classList.remove('show');
};
const highlightActiveLink = () => {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
};
const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Starts app
const init = () => {
  switch (global.currentPage) {
    case '/':
    case 'index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv.details':
      console.log('Tv');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }

  highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
console.log('cp', global.currentPage)