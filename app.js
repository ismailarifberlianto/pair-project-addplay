const express = require('express');
const { AuthController } = require('./controllers/authController');
const { MainController } = require('./controllers/mainController');
const app = express();
const port = 3013;
const session = require('express-session');
const { isLogin, isAdmin, isOwner } = require('./middlewares/auth');
const { AdminController } = require('./controllers/adminController');

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
    maxAge: 1000 * 60 * 30
    }
}))

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

// LANDING
app.get('/', MainController.home);
app.get('/playlist/add', isLogin, MainController.getAddPlaylist);
app.post('/playlist/add', isLogin, MainController.postAddPlaylist);
app.get('/playlist/:id', MainController.playlistsId);
app.get('/playlist/:id/edit', isLogin, isOwner, MainController.getEditPlaylistId);
app.post('/playlist/:id/edit', isLogin, isOwner, MainController.postEditPlaylistId);
app.post('/playlist/:id/delete', isLogin, isOwner, MainController.deletePlaylistId);
app.post('/playlist/:id/like', isLogin, MainController.postLikePlaylistId); // atau unlike
app.post('/playlist/:id/add_song', isLogin, isOwner, MainController.postAddSongToPlaylist);
app.post('/playlist/:id/delete_song/:songId', isLogin, MainController.deleteSongPlaylist);

//admin
app.get('/songs', isLogin, isAdmin, AdminController.songs)
app.get('/songs/add', isLogin, isAdmin, AdminController.getAddSong)
app.post('/songs/add', isLogin, isAdmin, AdminController.postAddSong)
app.get('/songs/:id/edit', isLogin, isAdmin, AdminController.getEditSong)
app.post('/songs/:id/edit', isLogin, isAdmin, AdminController.postEditSong)
app.post('/songs/:id/delete', isLogin, isAdmin, AdminController.deleteSongId)

app.listen(port, () => {
  console.log(`Our lucky numbers is ${port}`);
});