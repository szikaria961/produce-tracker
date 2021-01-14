const API_URL = 'api/produce';
const MINIMUM_PRODUCE_NAME_LENGTH = 3;
let selectedInput = "";

const produceNameElement = document.getElementById('produce-name');
const numDaysElement = document.getElementById('num-days');
const addProduceBtn = document.getElementById('add-produce-btn');
const suggestionsRowElement = document.getElementById('suggestions-row');


let payload = {
  name: '',
  numDays: null
}

function loadAllProduce() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      renderProduceList(this.responseText);
    }
  };
  xhttp.open("GET", "/api/produce", true);
  xhttp.send();
}

function renderProduceList(rawProduceList) {
  const produceDataTable = document.getElementById("produce-data-table-body");
  produceDataTable.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Expires</th>
      <th></th>
    </tr>
  `;

  const produce = JSON.parse(rawProduceList);

  produce.forEach(({ _id: id, name, numDays, createdAt }) => {
    const tableRow = document.createElement('TR');
    const expirationDate = getExpirationDate(createdAt, numDays);

    tableRow.innerHTML = `
      <td>${name}</td>
      <td>${moment(expirationDate).fromNow()}</td>
      <td><span onclick="handleDelete('${id}')"><i class="fa fa-trash-o"></i></span></td>
    `;

    produceDataTable.append(tableRow);
  });
  clearContent();
}

function getExpirationDate(createdDate, numDays) {
  return moment(createdDate, 'YYYY-MM-DD').add(numDays, 'days').format('LL');
}

function handleDelete(id) {
  const options = {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(API_URL + '/' + id, options)
    .then(response => {
      loadAllProduce();
    })
    .catch(error => {
      console.log(error);
    });
}

const handleSubmit = () => {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }

  fetch(API_URL, options)
    .then(response => {
      loadAllProduce();
    })
    .catch(error => {
      console.log(error);
    });

}

function filterArray(pattern, inputArray) {
  return inputArray.filter(item => item.includes(pattern));
}

function searchProduce(searchInput) {
  return filterArray(searchInput, produceSuggestionList);
}

function showCommonItems() {
  suggestionsRowElement.innerHTML = '';

  commonProduceItems.forEach(item => {
    const commonSuggestionElement = document.createElement('DIV');
    commonSuggestionElement.innerHTML = `${item}`;
    commonSuggestionElement.classList.add('suggestion');
    commonSuggestionElement.onclick = () => {
      produceNameElement.value = item;
      updatePayload('name', item);
    }
    suggestionsRowElement.appendChild(commonSuggestionElement);
  });
}

function showSuggestions(input) {
  const filteredInputList = searchProduce(input);
  suggestionsRowElement.innerHTML = '';

  filteredInputList.forEach(item => {
    const suggestionElement = document.createElement('DIV');
    suggestionElement.innerHTML = `${item}`;
    suggestionElement.classList.add('suggestion');
    suggestionElement.onclick = () => {
      produceNameElement.value = item;
      updatePayload('name', item);
    }
    suggestionsRowElement.appendChild(suggestionElement);
  });
}

function updateSuggestions() {
  const inputString = produceNameElement.value;

  if (inputString.length < MINIMUM_PRODUCE_NAME_LENGTH) {
    showCommonItems();
  } else {
    showSuggestions(inputString);
  }
}

function updatePayload(key, value) {
  payload = {
    ...payload,
    [key]: value
  }
}

produceNameElement.addEventListener('keyup', event => {
  updatePayload('name', event.target.value);
  updateSuggestions();
});

numDaysElement.addEventListener('input', event => {
  updatePayload('numDays', event.target.value);
});

addProduceBtn.addEventListener('click', handleSubmit);

function clearContent() {
  updatePayload('name', produceNameElement.value = '');
  updatePayload('numDays', numDaysElement.value = null);
  updateSuggestions();
}

function main() {
  loadAllProduce();
  updateSuggestions();
}

main();
