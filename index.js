const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
  })
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id ===id)

    if (person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.get('/info', (request, response) =>{
    response.send(`<p>Phonebook has ${persons.length} people</p><p>${Date(Date.now()).toString()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) =>{
    let newPerson = request.body
    const newId = Math.floor(Math.random() * 999999999)

    if (!newPerson.name){
        return response.status(400).json({ error: 'Bad request, name is nedeed' })
    }

    if (!newPerson.number){
        return response.status(400).json({ error: 'Bad request, number is needed' })
    }

    if (!persons.find(person => person.name === "Endika")){
        return response.status(409).json({ error: 'name must be unique' })
    }

    newPerson = {
        id: newId,
        name: newPerson.name,
        number: newPerson.number
    }

    persons.push(newPerson)

    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT)