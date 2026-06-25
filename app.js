const express = require('express');
const { AuthController } = require('./controllers/AuthController');
const {LandingController} = require('./controllers/LandingController');
const app = express();
const port = 3013;
const session = require('express-session');

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}))

// LANDING
app.get('/', LandingController.home);

// AUTH
app.get('/signup', AuthController.getSignup);
app.post('/signup', AuthController.postSignup);
app.get('/login', AuthController.getLogin);
app.post('/login', AuthController.postLogin);
app.get('/logout/', AuthController.logoutId);
app.get('/profile/:id', AuthController.getProfileId);
app.get('/profile/', AuthController.profile);
app.get('/profile/:id/edit', AuthController.getEditProfileId);
app.post('/profile/:id/edit', AuthController.postEditProfileId);

app.listen(port, () => {
  console.log(`Our lucky numbers is ${port}`);
});