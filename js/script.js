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
    };
  });
};

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
    case '/movies.details':
      console.log('Movies html');
      break;
    case '/tv.details':
      console.log('Tv');
      break;
    case '/search.html':
      console.log('Search');
      break;
  };

  highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
