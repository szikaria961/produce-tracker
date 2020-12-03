const API_URL = 'api/produce';
const produceNameElement = document.getElementById('produce-name');
const produceQtyElement = document.getElementById('produce-qty');
const numDaysElement = document.getElementById('num-days');
const submitBtn = document.getElementById('submit-btn');

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
