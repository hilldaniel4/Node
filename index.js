var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : true}));

var tasks = ["wake up", "eat breakfast"];
var completed = [];

app.get('/', function(request, response){
    response.render('index', {tasks: tasks, completed: completed});
});

app.post('/addToDo', function(req, res){
    console.log(req);
    tasks.push(req.body.newtodo);
    res.redirect("/");
});

app.post('/removeToDo', function(req, res){
    const remove = req.body.check;
    console.log(typeof remove);
    if(typeof remove === "string"){
        tasks.splice( tasks.indexOf(remove) , 1);
    }else if(typeof remove === "object"){
        for( var i=0; i< remove.length; i++){
            tasks.splice( tasks.indexOf(remove[i]) , 1);
        }
    }
    res.redirect("/");
});

app.post('/deleteToDo', function(req, res){
    res.send('world!');
});

app.listen(3000, function(){
    console.log('App is running on port 3000!');
});