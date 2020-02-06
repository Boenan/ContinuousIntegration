const express = require('express')
const bodyParser = require('body-parser')
const firebase_controller = require('./controllers/firebase_controller')
var helper = require('./webhook_functions.js')

const app = express()
const port = 3001
const fs = require('fs');
const executeBuild = require('./executeBuild.js')

app.use(bodyParser.json())

/*
    Handles web-hooks POST request.
*/
app.post('/', (req, res) => {

/*
    Example set_status 
    Note that status can be one of error, failure, pending, or success
    Don't forget to enter your token to token.json and remove it when push
*/
    helper.set_status(req, 'pending')
    res.send('finished');
})

app.get('/', (req, res) => res.send('Hello World!'))


/*
    Get all the repositories and the information about them.
*/
app.get('/repo', async (req, res) => {
    const data = await firebase_controller.getAllRepos();
    if(data != null) {
        res.status(200).send(data);
    } else {
        res.status(500).send("data empty")
    }
    
})

/*
    Get all the builds from a specific repository id.
*/
app.get('/repo/:id', async (req, res, next) => {
    const data = await firebase_controller.getRepoBuilds(req.params.id);
    if(data != null) {
        res.status(200).send(data);
    } else {
        res.status(500).send("data empty")
    }
})

/*
    Get build from repository id and build id(head_commit.id)
*/
app.get('/repo/:repo_id/:build_id', async (req, res) => {
    const data = await firebase_controller.getBuild(req.params.repo_id, req.params.build_id);
    if(data != null) {
        res.status(200).send(data);
    } else {
        res.status(500).send("data empty")
    }
})


app.listen(port)
console.log('Server is up on port ', port)
