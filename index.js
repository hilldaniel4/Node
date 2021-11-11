let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const ToDo = require('./models/todo.model');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : true}));



//connection to mongo
const mongoDB = "mongodb+srv://dan:dan@cluster0.cgkfr.mongodb.net/todo?retryWrites=true&w=majority";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:    "));



var tasks = ["wake up", "eat breakfast", "q"];
var completed = [];

app.get('/', function(request, response){
    response.render('index', {tasks: tasks, completed: completed});
});

app.post('/addToDo', function(req, res){
    let newToDo = new ToDo({
        item: req.body.newtodo,
        done: false
    })
    newToDo.save(function(err, todo){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
});

app.post('/removeToDo', function(req, res){
    const remove = req.body.check;
    console.log(typeof remove);
    if(typeof remove === "string"){
        ToDo.updateOne({item:remove}, {done:true}, function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            }
        })
    }else if(typeof remove === "object"){
        for( var i=0; i< remove.length; i++){
            tasks.splice( tasks.indexOf(remove[i]) , 1);
            completed.push(remove[i]);
        }
        res.redirect("/");
    }
});

app.post('/deleteToDo', function(req, res){
    const deletetask = req.body.deletetask;
    if(typeof deletetask === "string"){
        completed.splice( completed.indexOf(deletetask) , 1);
    }else if(typeof deletetask === "object"){
        for( var i=0; i< deletetask.length; i++){
            completed.splice( completed.indexOf(deletetask[i]) , 1);
        }
    }
    res.redirect("/");
});

app.listen(3000, function(){
    console.log('App is running on port 3000!');
});