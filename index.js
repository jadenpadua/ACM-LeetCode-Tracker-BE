const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = express.Router()
const app = express()
const apiPort = 8000
const DATABASE_NAME = "Questions"

const MongoClient = require('mongodb').MongoClient
const MongoURL = "mongodb+srv://jaden:test1234@acmleetcodetracker.ppf0e.mongodb.net/ACMLeetCodeTracker?retryWrites=true&w=majority"
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

MongoClient.connect(MongoURL, function(err,client) {
    if(err) {
        console.log("Error occured while connect to MongoDB", err)
    }
    console.log("MongoDB Connected.....") 
    db = client.db(DATABASE_NAME)
    collection = db.collection("question-collection")

})

app.get('/', (req,res) => {
    res.send("This is working")
})

app.post('/create-question', (req,res) => {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    const questionObject = {
        name: req.body.name,
        questionName: req.body.questionName,
        questionDifficulty: req.body.questionDifficulty,
        questionLink: req.body.questionLink,
        dateSubmitted: today
    }

    collection.insert(questionObject, (error, result) => {

        if (error) {
            console.log(error)
            return res.status(500).send(error);
        }

        res.send(result);
    });
})

app.get('/all-questions', (req,res) => {

    collection.find({}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
})


app.post("/find-question", (req, res) => {

    collection.find({questionLink: req.body.questionLink}).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});




app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))