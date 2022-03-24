# Phonebook

Simple API CRUD excercise with ExpressJs.

## Scripts

* `npm start`
* `npm run dev`

## Excercises

All the code is in [app.js file](./app.js)

### Excercise 1

Return an array with phone book entries.

```
app.get('/api/people', (req, res) => {
  res.status(200).json(callLog);
})
```

### Excercise 2

Return a web page that show phone book size and request time.

```
app.get('/info', (req, res) => {
  res.status(200).send(
    `<p>Phonebook has info for ${callLog.length} people</p>
    <p>${new Date()}</p>`
  );
})
```

### Excercise 3

Return the information of one selected entry.

```
app.get('/api/people/:id', (req, res) => {
  const { id } = req.params
  const person = callLog.find((elem) => elem.id === Number(id));
  if (!person) {
    return res.status(404).send({'message': '404 Page not found'});
  } 
  res.status(200).send(person);
})
```

### Excercise 4

Delete a selected entry.

```
app.delete('/api/people/:id', (req, res) => {
  const { id } = req.params
  const index = callLog.findIndex((elem) => elem.id === Number(id));
  if (index !== -1) {
    callLog.splice(index, 1);
    return res.status(200).send(callLog);
  } 
  res.status(404).send({"message": "User id no found"});
})
```

### Excercise 5 and 6

Create and post a new entry on the phone book with a random id. Show an error message if any information is missing or the name value is already used.

```
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
```


### Excercise 7 and 8

Apply [morgan module](https://github.com/expressjs/morgan) to log request information on the console. If the request's method is POST, also log the request's body.

```
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
```

