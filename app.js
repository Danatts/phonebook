const morgan = require('morgan')
const express = require('express');
const app = express();

// Datos
const { callLog } = require('./data');

// Middlewares
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan((tokens, req, res) => {
  if (req.method === 'POST') {
    return [tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res)
    ].join(' ')
  }
  return [tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
}))


app.get('/', (req, res) => {
  res.status(200).send('Hello World');
})

app.get('/api/people', (req, res) => {
  res.status(200).json(callLog);
})

app.get('/info', (req, res) => {
  res.status(200).send(
    `<p>Phonebook has info for ${callLog.length} people</p>
    <p>${new Date()}</p>`
  );
})

app.get('/api/people/:id', (req, res) => {
  const { id } = req.params
  const person = callLog.find((elem) => elem.id === Number(id));
  if (!person) {
    return res.status(404).send({'message': '404 Page not found'});
  } 
  res.status(200).send(person);

})

app.delete('/api/people/:id', (req, res) => {
  const { id } = req.params
  const index = callLog.findIndex((elem) => elem.id === Number(id));

  if (index !== -1) {
    callLog.splice(index, 1);
    return res.status(200).send(callLog);
  } 
  res.status(404).send({"message": "User id no found"});

})

app.post('/api/people', (req, res) => {
  const id = Math.floor(Math.random() * 10000);

  if (!req.body.name || !req.body.number) {
    return res.status(400).send({"message": "name and number values must be included"})
  }

  if (callLog.find((elem) => elem.name === req.body.name)) {
    return res.status(400).send({"message": "name must be unique"})
  }

  const newPerson = {
    id,
    ...req.body
  }
  callLog.push(newPerson); 
  res.status(200).send(callLog)
})

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

