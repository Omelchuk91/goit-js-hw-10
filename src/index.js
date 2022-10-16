import { fetchCountries } from './js/fetchCounties';
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const nameCountry = searchBox.value.trim();
  if (nameCountry === '') {
    return clearResult();
  }
  fetchCountries(nameCountry)
    .then(country => {
      clearResult();

      if (country.length === 1) {
        countryInfo.insertAdjacentHTML('beforeend', onRenderCountry(country));
      } else if (country.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        countryList.insertAdjacentHTML('beforeend', onRenderList(country));
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function onRenderList(country) {
  const layoutCountryList = country
    .map(({ name, flags }) => {
      const layout = `
          <li>
              <img src="${flags.svg}" width="15" height="15" alt="Flag of ${name.official}"> ${name.official}
          </li>
          `;
      return layout;
    })
    .join('');
  return layoutCountryList;
}

function onRenderCountry(country) {
  const layoutCountryInfo = country
    .map(({ name, flags, capital, population, languages }) => {
      const layout = `
        <div>
            <h2>
              <img src="${flags.svg}"width="20" height="20" alt="Flag of ${
        name.official
      }">
              ${name.official}</h2>
            <p><span>Capital: </span>${capital}</p>
            <p><span>Population: </span>${population}</p>
            <p><span>Languages: </span>${Object.values(languages).join(
              ', '
            )}</p>
        </div>
        `;
      return layout;
    })
    .join('');
  return layoutCountryInfo;
}

function clearResult() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
