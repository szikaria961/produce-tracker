const API_URL = 'api/produce';
const produceNameElement = document.getElementById('produce-name');
const produceQtyElement = document.getElementById('produce-qty');
const numDaysElement = document.getElementById('num-days');
const submitBtn = document.getElementById('submit-btn');

function loadAllProduce() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      document.getElementById("produce").innerHTML = getProduceList(this.responseText);
    }
  };
  xhttp.open("GET", "/api/produce", true);
  xhttp.send();
}

function getProduceList(rawProduceList) {
  let output = '';
  const produce = JSON.parse(rawProduceList);
  produce.forEach(({ _id: id, name, qty, numDays }) => {
    output += `<div>Name: ${name} | Quantity: ${qty} | Number of days: ${numDays} | <span onclick="handleDelete('${id}')"><i class="fa fa-trash-o"></i></span></div>`;
  });
  return output;
}

function handleDelete(id) {
  var xhttp = new XMLHttpRequest();

  xhttp.open("DELETE", `/api/produce/${id}`, true);
  xhttp.send();

  loadAllProduce();
}

let payload = {
  name: '',
  qty: null,
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
    .then(response => response.json())
    .then(data => console.log(data));
}

produceNameElement.addEventListener('keyup', event => {
  const updatedProduceName = event.target.value;

  payload = {
    ...payload,
    name: updatedProduceName
  }
});

produceQtyElement.addEventListener('input', event => {
  const updatedProduceQty = event.target.value;

  payload = {
    ...payload,
    qty: updatedProduceQty
  }
});

numDaysElement.addEventListener('input', event => {
  const updatedProduceNumberOfDays = event.target.value;

  payload = {
    ...payload,
    numDays: updatedProduceNumberOfDays
  }
});

submitBtn.addEventListener('click', handleSubmit);
loadAllProduce();
