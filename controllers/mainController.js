const { Op, where } = require('sequelize')
const {User, Profile, Song, Playlist, LikedPlaylist, PlaylistSong} = require('../models')

class MainController{
    static async home(req, res){
        try {
            const {search} = req.query
            const {UserId} = req.session
            // console.log(UserId, 'userId');

            let findUser = null
            if(UserId){
                findUser = await User.findOne({
                    include: Profile,
                    where: {id: UserId} 
                })
            }

            let option = { 
                include: [Song, User] 
            }
            
            if(search){
                option.where = {
                    name: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            }

            let playlists = await Playlist.findAll(option)
            res.render('main/home', {findUser, playlists, search})
            // console.log(findUser ? 'ada' : 'Null', 'findUser');
        } catch (error) {
            res.send(error)
            // console.log(error);
        }
    }
    static async getAddPlaylist(req, res){
        try {
            res.render('main/addplaylist')
        } catch (error) {
            res.send(error)
        }
    }
    static async postAddPlaylist(req, res){
        try {
            const {name, imageUrl, description} = req.body
            const {UserId} = req.session
            await Playlist.create({
                name, imageUrl, description, UserId
            })
            res.redirect('/')
        } catch (error) {
            res.send(error)
        }
    }
    static async playlistsId(req, res){
        try {
            const {id} = req.params
            const {UserId} = req.session
            let findUser = null
            let playlistId = await Playlist.findOne({
                where: {id: id},
                include: [Song, User]
            })
            let totalLike = await LikedPlaylist.count({
                where: { PlaylistId: id }
            })
            if(UserId){
                findUser = await User.findByPk(UserId)
            }

            let allSongs = await Song.findAll()
            res.render('main/playlistdetail', {playlistId, currentUser: findUser, allSongs, totalLike})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
    static async getEditPlaylistId(req, res){
        try {
            const {id} = req.params
            let playlistId = await Playlist.findByPk(id)
            res.render('main/editplaylist', {playlistId})
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
            res.send(error)
        }
    }
    static async deletePlaylistId(req, res){
        try {
            const {id} = req.params
            let findPlay = await Playlist.findByPk(id)
            //chaining promise?
            findPlay.destroy()
                .then(() => {
                    console.log(`Playlist ${findPlay.name} has been deleted.`);
                })
                .then(() => {
                    res.redirect('/')
                    
                })
                .catch((error) => {
                    res.send(error)
                })
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
            console.log(error);
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
}



module.exports = {MainController}