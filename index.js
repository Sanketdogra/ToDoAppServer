import express from "express";
import mongodb from "mongodb";
import cors from "cors";
import multer from "multer";

var mongoClient = mongodb.MongoClient;
var app = express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://sanketdogra:sanketdogra@todoappcluster.lrsp1em.mongodb.net/?retryWrites=true&w=majority";

var DATABASE_NAME = "ToDoAppDB";
var database;

app.listen(5049, () => {
    mongoClient.connect(CONNECTION_STRING, (error, client) => {
        if (error) return console.log("error ::", error);
        database = client.db(DATABASE_NAME);
        console.log("Mongo DB COnnected Successfully!!!");
    })
});

app.get("/api/todoapp/getToDoList", (request, response) => {
    database.collection("ToDoAppDBCollection").find({ "name": request.query.userName }).toArray((error, result) => {
       if (Object.hasOwn(result[0], 'items')) {
            response.send(result[0].items);
        }
        else {
            response.send(result[0]);
        }
    });
});

app.post("/api/todoapp/addItemToList", multer().none(), (request, response) => {
    database.collection("ToDoAppDBCollection").updateOne({ "name": request.body.userName }, { $push: { "items": request.body.userItem } });
    response.json("Added Suucessfully");
});

app.post("/api/todoapp/enterUser", multer().none(), (request, response) => {
    database.collection("ToDoAppDBCollection").find({ "name": request.body.userName }).count({}, function (error, numOfDocs) {
        if (numOfDocs > 0) {
            response.json("updated Suucessfully");
        } else {
            database.collection("ToDoAppDBCollection").count({}, function (error, numOfDocs) {
                database.collection("ToDoAppDBCollection").insertOne({
                    id: (numOfDocs + 1).toString() + "_base",
                    name: request.body.userName
                })
                response.json("Added Suucessfully");
            })
        }
    })
});

app.post("/api/todoapp/deleteItemFromList", multer().none(),(request, response) => {
    console.log("body", request.body);
    database.collection("ToDoAppDBCollection").updateOne({ "name": request.body.userName }, { $pull: { "items": request.body.userItem } });
    response.json("DELETED Suucessfully");
});
