var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var app = express(),
    router = express.Router();

app.use( bodyParser.json());

//Creating schema for book Collection
var bookSchema = mongoose.Schema({
        name : {
            type: String, 
            required: true
        },
        author : {
            type: String,
            required: true
        },
        pages : {
            type: Number,
            required: true
        },
        edition : Number
    });


//Creating model
var book = mongoose.model("book", bookSchema);



//Creates connection with MongoDB when the server starts
var createConnection = function(callback){    
    mongoose.connect("mongodb://localhost:27017/test", function(err){
        if(err)
            return callback(err);
        else
            return callback(null);
    });
    
    mongoose.connection.once('open', function(){
       console.log("Connection is open with MongoDB"); 
    });
};

//creating the listener at 5000.
var server = app.listen(5000, function () {
    console.log("Server is listening at http://127.0.0.1:5000");
    createConnection( function(err){
        if(err != null || err!= undefined){
            console.log("Error occured in connecting with MongoDB:- ",err);
        }
    });
});


var responseBody = {
    status : 200,
    result : "SUCCESS"
};


//sample get API
app.get('/', function (req, res) {
   res.send(responseBody);
});


//get API to retrieve data from mongoDB
app.get('/getObject', function (req, res) {
    var name = req.query.name;
    var author = req.query.author;
    //Checking if valid details are coming in the uri
    if(name != null && name != undefined && author != null && author != undefined){
        
        //Searching for the object in MongoDB
        book.find({name: name, author: author}, function(err, response){
            if(!err){
                
                console.log("Object successfully found:- \n", response);
                res.send(response);
                
            }else{
                
                //Sending error response
                console.log("Error in finding the object:- ",err);
                var getErrorResponse = {
                    status: 400,
                    result: "FAILURE",
                    message: "INTERNAL SERVER ERROR"
                };
                res.send(getErrorResponse);
            }
        });
    }else{
        var getErrorResponse = {
            status: 400,
            result: "FAILURE",
            message: "Bookname or author is required. Please provide anyone or both of these"
        };
        res.send(getErrorResponse);
    }
    
});


//post API to post data into mongoDB
app.post('/postObject', function (req, res) {
    //Checking for the field values if they are present or not
    if(req.body.name != null && req.body.name != undefined && req.body.author != null && req.body.author != undefined && req.body.pages !=null && req.body.pages != undefined){
        
        //Creating a success object
        var postSuccessResponse = {
            status: 200,
            response: "SUCCESS"
        };
        
        //creating an object as per the schema
        var mongoObject = new book({
            name: req.body.name,
            author: req.body.author,
            pages: req.body.pages,
            edition: req.body.edition
        });
        
        //saving the object into mongoDB
        mongoObject.save(function(err, response){
           if(err != null){
               console.log("Error in saving the object into MongoDB:- ", err);
               var postErrorResponse = {
                    status: 400,
                    result: "FAILURE",
                    message: "The object could not be saved in MongoDB"
                };        
                res.send(postErrorResponse);
           }else{
               
               console.log("Object saved in mongoDB successfully");
               res.send(postSuccessResponse);
               
           } 
        });
        
    }else{
        
        //error send if any of the mandatory field's value is not present
        var postErrorResponse = {
            status: 400,
            result: "FAILURE",
            message: "Name, author, pages are mandatory. Onr or more of them are missing"
        };        
        res.send(postErrorResponse);
    }
    
});

//delete API to delete data from mongoDB
app.delete('/deleteObject/:bookName', function (req, res) {
   // console.log("Request param:- "+req.params.bookName);
    var bookName = req.params.bookName;
    
    book.remove({name: bookName}, function(err){
       if(!err){
           console.log("Successfully deleted the object");
           var deleteSuccessResponse = {
                status: 200,
                result: "SUCCESS"
            };
           res.send(deleteSuccessResponse);
       }else{
           console.log("Could not delete the event");
           var deleteErrorResponse = {
               status: 500,
               result: "FAILURE",
               message: "INTERNAL SERVER ERROR"
           };
           res.send(deleteErrorResponse);
       } 
    });    
    
});


//put API to delete data from mongoDB
app.put('/putObject/:bookName', function (req, res) {
    console.log("Request param:- "+req.params.bookName);
    console.log("Request body:- ",req.body);
    res.send(responseBody);
});

//closes the connection with MongoDB
process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        console.log("Connection with mongodb is closed due to the termination of program");
        process.exit(0);
    });
});

