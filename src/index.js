const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const client = require('./db');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

//HTTP logger
app.use(morgan('combined'));

//Template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs' 
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));

app.get('/create', (req, res) => {
    client.query(`Select * from student`, (err, docs) => {
        if(!err) {
          res.json(docs);
        } else {
          console.log(err.message);
        }
    }) 
})

app.get('/', (req, res) => {
    res.render('home.hbs');
})

// route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

