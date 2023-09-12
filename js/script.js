const global = {
  currentPage: window.location.pathname,
  API_KEY: 'db68eaabd90d3c16efb79950c0a69cc3',
  API_URL: 'https://api.themoviedb.org/3/',
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
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

// Make request to search
const searchAPIData = async () => {
  showSpinner();

  const response = await fetch(
    `${global.API_URL}search/${global.search.type}?api_key=${global.API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
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
  const movie = await fetchAPIData(`movie/${movieID}`);

  // Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

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

const displayShowDetails = async () => {
  const showID = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${showID}`);

  // Overlay for background image
  displayBackgroundImage('show', show.backdrop_path);

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
        <p class="text-muted">First Aired: ${show.first_air_date}</p>
        <p>
          ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of Episodes:</span> ${addCommasToNumber(
          show.number_of_episodes
        )}</li>
        <li><span class="text-secondary">Last Episode to Air:</span> ${addCommasToNumber(
          show.last_episode_to_air.name
        )}</li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${show.production_companies
          .map((company) => `<span>${company.name}</span>`)
          .join(', ')}
      </div>
    </div>
  `;

  document.querySelector('#show-details').append(div);
};

const displayBackgroundImage = (type, backgroundPath) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').append(overlayDiv);
  } else {
    document.querySelector('#show-details').append(overlayDiv);
  };
};

// Search Movies/Shows
const search = async () => {
  const queryString = window.location.search;
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
    };

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term');
  };
};

const displaySearchResults = (results) => {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href='${global.search.type}-details.html?id=${result.id}'>
        ${
          result.poster_path
            ? `<img
            src='https://image.tmdb.org/t/p/w500${result.poster_path}'
            class='card-img-top'
            alt=${global.search.type === 'movie' ? result.title : result.name}
          />`
            : `<img
          src='../images'
          class='card-img-top'
          alt=${global.search.type === 'movie' ? result.title : result.name}
        />`
        }
      </a>
      <div class='card-body'>
        <h5 class='card-title'>${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class'card-text'>
          <small class='text-muted'>Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
        </p>
      </div>
    `;

    document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

    document.querySelector('#search-results').append(div);
  });

  displayPagination();
};

// Display and create pagination for search results
const displayPagination = () => {
  const div = document.createElement('div');
  div.classList.add('pagination')

  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  document.querySelector('#pagination').append(div);


  // Disable preview button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  };
  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  };

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
};

const displaySlider = async () => {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt=${movie.title} />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').append(div);

    initSwiper();
  });
};

const initSwiper = () => {
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
    };
  });
};
const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const showAlert = (message, className = 'error') => {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.append(document.createTextNode(message));

  document.querySelector('#alert').append(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
};

// Starts app
const init = () => {
  switch (global.currentPage) {
    case '/':
    case 'index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/show-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      break;
  };

  highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);