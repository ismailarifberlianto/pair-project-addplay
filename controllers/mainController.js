const { Op, where } = require('sequelize')
const {User, Profile, Song, Playlist, LikedPlaylist, PlaylistSong} = require('../models')
const createAt = require('../helper/createAt')
const { errorMonitor } = require('nodemailer/lib/xoauth2')

class MainController{
    static async homeHandler(req, res){
        try {
            res.redirect('/addplay')
        } catch (error) {
            res.send(error)
        }
    }
    static async home(req, res){
        try {
            const {search} = req.query
            const {UserId} = req.session
            // console.log(UserId, 'userId');
            let {errorMessage, successMessage} = req.query
            console.log('successMessage:', successMessage)  
            let findUser = null
            if(UserId){
                findUser = await User.findOne({
                    include: Profile,
                    where: {id: UserId} 
                })
            }
            //
            let playlists = await Playlist.findWithDetails(search)
            if(errorMessage && errorMessage.length > 0){
                errorMessage = errorMessage.split(",").join(". ") + ".";
            } else{
                errorMessage = undefined
            }
            if(successMessage && successMessage.length > 0){
                successMessage = successMessage
            } else {
                successMessage = undefined
            }
            res.render('main/home', {findUser, playlists, search, createAt, errorMessage, successMessage})
            // console.log(findUser ? 'ada' : 'Null', 'findUser');
        } catch (error) {
            res.send(error)
        }
    }
    static async getAddPlaylist(req, res){
        try {
            let {errorMessage} = req.query
            if(errorMessage && errorMessage.length > 0){
                errorMessage = errorMessage.split(",").join(". ") + ".";
            } else{
                errorMessage = undefined
            }
            res.render('main/addplaylist', {errorMessage})
        } catch (error) {
            res.send(error)
            // console.log(error);
        }
    }
    static async postAddPlaylist(req, res){
        try {
            const {name, imageUrl, description} = req.body
            const {UserId} = req.session
            // console.log(errorMessage, "error...");
            await Playlist.create({
                name, imageUrl, description, UserId
            })
            res.redirect('/')
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                let errorMessage = error.errors.map(el =>{
                    return el.message
                })
                res.redirect(`/playlist/add?errorMessage=${errorMessage}`)
            } else{
                res.send(error)
            }
        }
    }
    static async playlistsId(req, res){
        try {
            const {id} = req.params
            const {UserId} = req.session
            let playlistId = await Playlist.findOne({
                where: {id: id},
                include: [Song, User]
            })
            let findUser = null
            if(UserId){
                findUser = await User.findByPk(UserId)
            }
            let allSongs = await Song.findAll()
            let totalLike = await LikedPlaylist.count({
                where: { PlaylistId: id }
            })
            let {errorMessage} = req.query
            if(errorMessage && errorMessage.length > 0){
                errorMessage = errorMessage.split(",").join(". ") + ".";
            } else{
                errorMessage = undefined
            }
            res.render('main/playlistdetail', {playlistId, currentUser: findUser, allSongs, totalLike, errorMessage})
        } catch (error) {
            res.send(error)
            // console.log(error);
        }
    }
    static async getEditPlaylistId(req, res){
        try {
            const {id} = req.params
            let {errorMessage} = req.query
            if(errorMessage && errorMessage.length > 0){
                errorMessage = errorMessage.split(",").join(". ") + ".";
            } else{
                errorMessage = undefined
            }
            let playlistId = await Playlist.findByPk(id)
            res.render('main/editplaylist', {playlistId, errorMessage})
        } catch (error) {
            res.send(error)
        }
    }
    static async postEditPlaylistId(req, res){
        try {
            const {id} = req.params
            const {name, imageUrl, description} = req.body
            let findPlay = await Playlist.findByPk(id)
            await findPlay.update({
                name, imageUrl, description
            })
            res.redirect(`/playlist/${id}`)
        } catch (error) {
            const {id} = req.params
            if(error.name === "SequelizeValidationError"){
                let errorMessage = error.errors.map(el =>{
                    return el.message
                })
                res.redirect(`/playlist/${id}/edit?errorMessage=${errorMessage}`)
            } else{
                res.send(error)
            }
        }
    }
    static async deletePlaylistId(req, res){
        try {
            const {id} = req.params
            let playlistName = "";

            Playlist.findByPk(id)
                .then((findPlay) => {
                    if (!findPlay) {
                        throw new Error("PlaylistNotFound");
                    }
                    playlistName = findPlay.name;
                    
                    return findPlay.destroy();
                })
                .then(() => {
                    res.redirect(`/addplay?successMessage=Playlist '${playlistName}' has been deleted`);
                })
                .catch((error) => {
                    if (error.message === "PlaylistNotFound") {
                        res.redirect('/addplay?errorMessage=Playlist tidak ditemukan');
                    } else {
                        res.send(error);
                    }
                });
        } catch (error) {
            res.send(error)
        }
    }
    static async postLikePlaylistId(req, res){
        try {
            const {id} = req.params
            const {UserId} = req.session
            console.log('id:', id, 'UserId:', UserId)
            let findLike = await LikedPlaylist.findOne({
                where: {
                    UserId: UserId,
                    PlaylistId: id
                }
            })
            console.log('findLike:', findLike)
            if(findLike){
                await LikedPlaylist.destroy({
                    where: {
                        UserId, 
                        PlaylistId: id
                    }
                })
            } else {
                await LikedPlaylist.create({
                    UserId, PlaylistId: id
                })
            }
            res.redirect(`/playlist/${id}`)
        } catch (error) {
            res.send(error)
            // console.log(error);
        }
    }
    static async postAddSongToPlaylist(req, res){
        try {
            const {id} = req.params // PlaylistId
            const {SongId} = req.body
            let findSong = await PlaylistSong.findOne({
                where: {
                    SongId: SongId,
                    PlaylistId: id
                }
            })
            if(findSong){
                return res.redirect(`/playlist/${id}?errorMessage=Song already on Playlist`)
            } else {
                await PlaylistSong.create({
                    PlaylistId: id, 
                    SongId: SongId
                })
            }
            res.redirect(`/playlist/${id}`)

        } catch (error) {
            res.send(error)
            // console.log(error);
        }
    }
    static async deleteSongPlaylist(req, res){
        try {
            const {id} = req.params // PlaylistId
            const {songId} = req.params
            let findSong = await PlaylistSong.findOne({
                where: {
                    PlaylistId: id,
                    SongId: songId
                }
            })
            await findSong.destroy()
            res.redirect(`/playlist/${id}`)
        } catch (error) {
            res.send(error)
        }
    }
    static async getSongDetail(req, res) {
        try {
            const { songId } = req.params;
            const { playlistId } = req.query
            const song = await Song.findByPk(songId, {
                include: Playlist
            });

            if (!song) {
                return res.redirect('/songs?errorMessage=Song not found');
            }

            // Fungsi Helper untuk mengubah URL YouTube menjadi format Embed iFrame
            const getEmbedUrl = (url) => {
                if (!url) return null;
                
                let videoId = '';
                // Menangani format desktop biasa: youtube.com/watch?v=XXXXXX
                if (url.includes('youtube.com/watch')) {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    videoId = urlParams.get('v');
                } 
                else if(url.includes('music.youtube.com/watch')) {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    videoId = urlParams.get('v');
                }
                return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
            };

            const embedYoutubeUrl = getEmbedUrl(song.url);

            // Render halaman detail sambil mengirim data lagu dan URL embed-nya
            res.render('main/songdetail', { song, embedYoutubeUrl, playlistId });
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = {MainController}