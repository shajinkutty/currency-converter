// Input selector
const currencyElementFrom = document.getElementById('currency-from');
const inputElementFrom = document.getElementById('amount-from');

const currencyElementTo = document.getElementById('currency-to');
const inputElementTo = document.getElementById('amount-to');

const convertRate = document.getElementById('convert-rate');
const swapEl = document.getElementById('swap');

// Select Input change handler
currencyElementFrom.addEventListener('change', fetchData);
currencyElementTo.addEventListener('change', fetchData);

// Number Input change handler
inputElementFrom.addEventListener('input', calculate);
inputElementTo.addEventListener('input', calculate);

let latestRateList;

// Fetch currency list from API
function getCurrencyList() {
  showLoading(true);
  fetch('https://currencyscoop.p.rapidapi.com/currencies', {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'currencyscoop.p.rapidapi.com',
      'x-rapidapi-key': 'c306c7de18mshe582ac996941567p17fb3ejsn547885689a13',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showLoading(false);
      currencyOptions(data.response.fiats);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Output currency list to the DOM
const currencyOptions = (res) => {
  const listArray = [];
  for (const key in res) {
    if (res.hasOwnProperty(key)) {
      listArray.push(res[key]);
    }
  }
  const options = listArray
    .sort((a, b) => {
      return a.currency_name < b.currency_name ? -1 : 0;
    })
    .filter((f) => {
      return f.currency_name != 'ADB Unit of Account';
    })
    .map((c) => {
      return `<option value="${c.currency_code}">${c.currency_name}</option>`;
    });
  currencyElementFrom.innerHTML =
    '<option disabled selected>Please select</option>' + options;
  currencyElementTo.innerHTML =
    '<option disabled selected>Please select</option>' + options;
};

function fetchData() {
  showLoading(true);
  // Fetching data
  fetch('https://currencyscoop.p.rapidapi.com/latest', {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'currencyscoop.p.rapidapi.com',
      'x-rapidapi-key': 'c306c7de18mshe582ac996941567p17fb3ejsn547885689a13',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showLoading(false);
      latestRateList = data.response;
      calculate();
    })
    .catch((err) => {
      console.log(err);
    });
}

// calculate function

function calculate() {
  const inputValue = inputElementFrom.value;
  const rates = latestRateList.rates;
  const currencyFrom = currencyElementFrom.value;
  const currencyTo = currencyElementTo.value;

  const fromCurrencyRate = rates[currencyFrom];
  const dollerRate = 1 / fromCurrencyRate; // calculate selected currency to USD
  const toCurrencyRate = rates[currencyTo];
  const convertedRate = toCurrencyRate * dollerRate;

  if (!toCurrencyRate) {
    return;
  }

  if (inputValue < 0) {
    return;
  }
  inputElementTo.value = (inputValue * convertedRate).toFixed(2);
  convertRate.innerText = `1 ${currencyFrom} = ${convertedRate.toFixed(
    2
  )} ${currencyTo}`;
}

// swap function
swapEl.addEventListener('click', () => {
  const temp = currencyElementFrom.value;
  currencyElementFrom.value = currencyElementTo.value;
  currencyElementTo.value = temp;
  calculate();
});

function showLoading(bool) {
  const loader = document.querySelector('.loader');
  if (bool) {
    loader.classList.add('show');
  } else {
    loader.classList.remove('show');
  }
}

getCurrencyList();
