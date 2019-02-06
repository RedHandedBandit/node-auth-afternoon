const express = require('express')
const session = require('express-session')
require('dotenv').config()
const bodyParser = require('body-parser')
const massive = require('massive')
const ac = require('./controllers/authController')

const app = express()

const {CONNECTION_STRING, SESSION_SECRET} = process.env

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('database connected')
})

app.use(bodyParser.json())
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

app.post('/auth/login', ac.login)
app.post('/auth/register', ac.register)
app.get('/auth/logout', ac.logout)

const PORT = 4000
app.listen(PORT, () => {
    console.log('listen to this port please', PORT)
})