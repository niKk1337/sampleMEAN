var mongoose = require("mongoose");

//Declaring a schema
var bookSchema = mongoose.Schema({
    name : String,
    author : String,
    pages : Number,
    edition : Number
});
//Adding another method to the schema
bookSchema.methods.read = function(){
    var bookName = this.name ? (this.name+" is quite reaadable") : "The book doesnt have a name";
    console.log(bookName);
};
//Adding another attribute to the schema
bookSchema.add({rating: {type: Number, default: 5}});

//Compiling the schema into a model
var book = mongoose.model('book', bookSchema);
var book1 = new book({
    name : "Let us C",
    author: "Yeshvant Kanetkar",
    pages: 500,
    edition: 5
});

// connecting to mongodb
mongoose.connect("mongodb://localhost:27017/test", function(err){
    if(err){
        console.log("***Error connecting to MongoDB***");
    }else{
        console.log("***Connection to MongoDB successful***");
    }
});

// checking if thec  connection to mongodb is open or not
mongoose.connection.once('open', function(){
    console.log("***Connection is open***\n\n");
    console.log("book1.name:-\t"+book1.name+"\nbook1.author:-\t"+book1.author+"\nbook1.pages:-\t"+book1.pages+"\nbook1.edition:-\t"+book1.edition+"\nbook1.rating:-\t"+book1.rating+"\nIs the book readable:-\t"+book1.read());
});

//to save the document in a db
/*book1.save(function(err, res){
    if(err){
        console.log("Error in saveing the data in MongoDB:- ",err);
    }else{
        console.log("Data saved in MongoDB:- ",res);
    }
});*/


//to find all the document in the collection
/*book.find(function(err,book){
    if(err)
        console.log("Error:- "+err);
    else
        console.log("Book:- "+book);
});*/


//to find a document based on a criteria.
/*book.find([{name: "Let us C"}], function(err, response){
   if(err)
       console.log("Error:- "+err);
    else
        console.log("Response:- "+response);
});*/

//to delete a record based on a certain conditions
/*book.remove({name: "Let us C" }, function(err) {
    if (!err) {
            console.log("deleted");
    }
    else {
            console.log("error occured:- ",err);
    }
});*/

//To close the connection on the termination of the program
process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        console.log("***MongoDB connection terminated due to the termination of the program***");
        process.exit(0);
    });
});



