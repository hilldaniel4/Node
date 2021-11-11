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



let tasks = ["wake up", "eat breakfast", "q"];
let completed = [];

app.get('/', function(request, response){
    ToDo.find(function(err, todo){
        if(err){
            console.log(err);
        }else {
            tasks = [];
            completed = [];
            for(let i=0; i< todo.length; i++){
                if(todo[i].done){
                    completed.push(todo[i]);
                }else {
                    tasks.push(todo[i]);
                }
            }
            response.render('index', {tasks: tasks, completed: completed});
        }
    })
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
        ToDo.updateOne({_id:remove}, {done:true}, function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/");
            }
        })
    }else if(typeof remove === "object"){
        for( var i=0; i< remove.length; i++){
            ToDo.updateOne({_id:remove[i]}, {done:true}, function(err){
                if(err){
                    console.log(err);
                }
            })
        }
        res.redirect("/");
    }
});

app.post('/deleteToDo', function(req, res){
    const deleteTask = req.body.delete;
    if(typeof deleteTask === "string"){
        ToDo.deleteOne({_id: deleteTask}, function(err){
            if(err){
                console.log(err);
            } else{
                res.redirect("/");
            }
        })
    }else if(typeof deleteTask === "object"){
        for( var i=0; i< deleteTask.length; i++){
            ToDo.deleteOne({_id: deleteTask[i]}, function(err){
                if(err){
                    console.log(err);
                }
            })
        }
        res.redirect("/");
    }
});

app.listen(3000, function(){
    console.log('App is running on port 3000!');
});