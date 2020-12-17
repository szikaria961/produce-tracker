const API_URL = 'api/produce';
const MINIMUM_PRODUCE_NAME_LENGTH = 2;

const produceNameElement = document.getElementById('produce-name');
const numDaysElement = document.getElementById('num-days');
const addProduceBtn = document.getElementById('add-produce-btn');
const suggestionsRowElement = document.getElementById('suggestions-row');

const produceSuggestionList = [
  "alfalfa sprouts",
  "apple",
  "apricot",
  "artichoke",
  "asian pear",
  "asparagus",
  "atemoya",
  "avocado",
  "bamboo shoots",
  "banana",
  "beans",
  "bean sprouts",
  "beets",
  "belgian endive",
  "bitter melon",
  "bell peppers",
  "blackberries",
  "blueberries",
  "bok choy",
  "boniato",
  "boysenberries",
  "broccoflower",
  "broccoli",
  "brussels sprouts",
  "cabbage (green and red)",
  "cantaloupe",
  "carambola (star fruit or star apple)",
  "carrots",
  "casaba melon",
  "cauliflower",
  "celery",
  "chayote",
  "cherimoya (custard apple)",
  "cherries",
  "coconuts",
  "collard greens",
  "corn",
  "cranberries",
  "cucumber",
  "dates",
  "dried plums (a.k.a. prunes)",
  "eggplant",
  "endive",
  "escarole",
  "feijoa",
  "fennel",
  "figs (dry and fresh)",
  "garlic",
  "gooseberries",
  "grapefruit",
  "grapes",
  "green beans",
  "green onions",
  "greens (turnip, beet, collard, mustard)",
  "guava",
  "hominy",
  "honeydew melon",
  "horned melon",
  "iceberg lettuce",
  "jerusalem artichoke",
  "jicama",
  "kale",
  "kiwifruit",
  "kohlrabi",
  "kumquat",
  "leeks",
  "lemons",
  "lettuce (boston, iceberg, leaf, romaine)",
  "lima beans",
  "limes",
  "longan",
  "loquat",
  "lychee",
  "madarins",
  "malanga",
  "mandarin oranges",
  "mangos",
  "mulberries",
  "mushrooms",
  "napa (chinese cabbage)",
  "nectarines",
  "okra",
  "onion (green, red, spanish, yellow, white)",
  "oranges",
  "papayas",
  "parsnip",
  "passion fruit",
  "peaches",
  "pears",
  "peas (green, snow, sugar snap)",
  "peppers (bell – red, yellow, green, chili)",
  "persimmons",
  "pineapple",
  "plantains",
  "plums",
  "pomegranate",
  "potatoes",
  "prickly pear (cactus pear)",
  "prunes",
  "pummelo (chinese grapefruit)",
  "pumpkin",
  "quince",
  "radicchio",
  "radishes",
  "raisins",
  "raspberries",
  "red cabbage",
  "rhubarb",
  "romaine lettuce",
  "rutabaga",
  "shallots",
  "snow peas",
  "spinach",
  "sprouts",
  "squash (acorn, banana, buttercup, butternut,",
  "summer)",
  "strawberries",
  "string beans",
  "sweet potato",
  "tangelo",
  "tangerines",
  "tomatillo",
  "tomato",
  "turnip",
  "ugli fruit",
  "watermelon",
  "water chestnuts",
  "watercress",
  "waxed beans",
  "yams",
  "yellow squash",
  "yuca/cassava",
  "zucchini squash"
];

const commonProduceItems = [
  "avocado",
  "bananas",
  "kale"
];

let selectedInput = "";

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
      <th>Expiration Date</th>
      <th></th>
    </tr>
  `;

  const produce = JSON.parse(rawProduceList);

  produce.forEach(({ _id: id, name, numDays, createdAt }) => {
    const tableRow = document.createElement('TR');
    const expirationDate = getExpirationDate(createdAt, numDays);

    tableRow.innerHTML = `
      <td>${name}</td>
      <td>${expirationDate}</td>
      <td><span onclick="handleDelete('${id}')"><i class="fa fa-trash-o"></i></span></td>
    `;

    produceDataTable.append(tableRow);
  });
}

function getExpirationDate(createdDate, numDays) {
  return moment(createdDate, 'YYYY-MM-DD').add(numDays, 'days').format('LL');
}

function handleDelete(id) {
  var xhttp = new XMLHttpRequest();

  xhttp.open("DELETE", `/api/produce/${id}`, true);
  xhttp.send();

  loadAllProduce();
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
    .then(res => res.json())
    .then(data => console.log(data));
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
    suggestionsRowElement.appendChild(commonSuggestionElement);
  });
}

suggestionsRowElement.addEventListener('click', event => {
  produceNameElement.value = event.target.innerHTML;
});

function showSuggestions(input) {
  const filteredInputList = searchProduce(input);
  suggestionsRowElement.innerHTML = '';

  filteredInputList.forEach(item => {
    const suggestionElement = document.createElement('DIV');
    suggestionElement.innerHTML = `${item}`;
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


function main() {
  loadAllProduce();
  updateSuggestions();
}

main();
