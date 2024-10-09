require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
  })
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) =>{
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) =>{
    return response.status(200).send("<h1>Phonebook</h1><h2>Go to / to use the PhoneBook</h2><a href='/'>Go to the PhoneBook</a>")
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
    console.log(person)
    Person.findByIdAndUpdate(request.params.id, person, { new: true })//with false we obtain the object without the modification
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) =>{
    response.send(`<p>Phonebook has ${persons.length} people</p><p>${Date(Date.now()).toString()}</p>`)
})

app.delete('/api/persons/:id', (request, response, next) => {
    console.log("2- Me piden que borre una persona")
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        console.log("3- He borrado la persona correctamente")
        response.status(204).send(result)//.end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) =>{
    const body = request.body

    if (body.name === undefined | body.number === undefined) {
      return response.status(400).json({ error: 'name or/and number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))
   
  })

// app.post('/api/persons', (request, response) =>{
//     let newPerson = request.body
//     const newId = Math.floor(Math.random() * 999999999)

//     if (!newPerson.name){
//         return response.status(400).json({ error: 'Bad request, name is nedeed' })
//     }

//     if (!newPerson.number){
//         return response.status(400).json({ error: 'Bad request, number is needed' })
//     }

//     if (!persons.find(person => person.name === "Endika")){
//         return response.status(409).json({ error: 'name must be unique' })
//     }

//     newPerson = {
//         id: newId,
//         name: newPerson.name,
//         number: newPerson.number
//     }

//     persons.push(newPerson)

//     response.json(newPerson)
// })

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    // next(error)
    return response.status(500).end()
}
  
// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]