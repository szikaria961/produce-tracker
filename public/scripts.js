const API_URL = 'api/produce';
const produceNameElement = document.getElementById('produce-name');
const submitBtn = document.getElementById('submit-btn');

let payload = {
  name: ''
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

submitBtn.addEventListener('click', handleSubmit);
