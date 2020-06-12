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

let loading = true;
let latestRateList;

// Fetch currency list from API
function getCurrencyList() {
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
      currencyOptions(data.response.fiats);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Output currency list to the DOM
const currencyOptions = (res) => {
  let output = '<option value="" disabled selected>Please select</option>';
  for (const key in res) {
    if (res.hasOwnProperty(key)) {
      const element = res[key];
      output += `<option value="${element.currency_code}">${element.currency_name}</option>`;
    }
  }
  currencyElementFrom.innerHTML = output;
  currencyElementTo.innerHTML = output;
};

function fetchData() {
  loading = true;
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
      loading = false;
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
  const toCurrencyRate = currencyTo ? rates[currencyTo] : 1;
  const convertedRate = toCurrencyRate * dollerRate;

  if (inputValue < 0) {
    return;
  }
  inputElementTo.value = currencyTo
    ? (inputValue * convertedRate).toFixed(2)
    : 1;
  convertRate.innerText = currencyTo
    ? `1 ${currencyFrom} = ${convertedRate.toFixed(2)} ${currencyTo}`
    : '';
}

// swap function
swapEl.addEventListener('click', () => {
  const temp = currencyElementFrom.value;
  currencyElementFrom.value = currencyElementTo.value;
  currencyElementTo.value = temp;
  calculate();
});
getCurrencyList();
