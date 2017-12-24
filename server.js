const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');

let server;
const app = express();

// Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Express view engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Routes
app.use('/public', express.static('public'));
app.use('/channels', require('./controllers/channels'));
app.use('/commands', require('./controllers/commands'));

function start(port) {
    server = http.createServer(app);
    server.listen(port);
}

module.exports = {
    start
};