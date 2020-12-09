const API_URL = 'api/produce';
const produceNameElement = document.getElementById('produce-name');
const numDaysElement = document.getElementById('num-days');
const addProduceBtn = document.getElementById('add-produce-btn');

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

let payload = {
  name: '',
  numDays: null
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

produceNameElement.addEventListener('keyup', event => {
  const updatedProduceName = event.target.value;

  payload = {
    ...payload,
    name: updatedProduceName
  }
});

numDaysElement.addEventListener('input', event => {
  const updatedProduceNumberOfDays = event.target.value;

  payload = {
    ...payload,
    numDays: updatedProduceNumberOfDays
  }
});

addProduceBtn.addEventListener('click', handleSubmit);
loadAllProduce();
