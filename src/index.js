import './css/styles.css';
import { fetchCountries } from '../src/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  counryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(findCountry, DEBOUNCE_DELAY));

function findCountry(e) {
  const inputValue = e.target.value.trim();
  
  if (inputValue.length === 0) {
    Notify.info('Please, start entering country name');
    return;
  }

  fetchCountries(inputValue)
    .then(renderCountries)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      return error;
    });
}

function renderCountries(countries) {
  
  refs.countriesList.innerHTML = countries
    .map(
      ({name:{official}, flags:{svg}}) =>
        `
          <li class="country"><img src="${svg}"alt="Flag of ${official}" />
              <h1>${official}</h1>
          </li>
        `
    )
    .join('');

  if (countries.length === 1) {
    refs.counryInfo.innerHTML = countries
      .map(
        ({capital,population, languages}) =>
          `
          <p><b>Capital: </b>${capital}</p>
          <p><b>Population: </b>${population}</p>
          <p><b>Languages: </b>${Object.values(languages)}</p>
         `
      )
      .join('');
      document.querySelector('.country').classList.add('single');
    return;
  }

  if (countries.length > 10) {
    refs.countriesList.innerHTML = '';
    Notify.warning('Too many matches found. Please enter a more specific name');
  }

  refs.counryInfo.innerHTML = '';
}