const { Op, where } = require('sequelize')
const {User, Profile, Song, Playlist, LikedPlaylist, PlaylistSong} = require('../models')

class AdminController{
    static async songs(req, res){
        try {
            let data = await Song.findAll()
            res.render('admin/songs', {data})
        } catch (error) {
            res.send(error)
        }
    }
    static async getAddSong(req, res){
        try {
            res.render('admin/addsong')
        } catch (error) {
            res.send(error)
        }
    }
    static async postAddSong(req, res){
        try {
            const {title, singer, url} = req.body
            await Song.create({
                title, singer, url
            })
            res.redirect('/songs')
        } catch (error) {
            res.send(error)
            // console.log(error);
        }
    }
    static async getEditSong(req, res){
        try {
            const {id} = req.params
            let data = await Song.findByPk(id)
            res.render('admin/editsong', {data})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
    static async postEditSong(req, res){
        try {
            const {id} = req.params
            const {title, singer, url} = req.body
            let data = await Song.findByPk(id)
            await data.update({
                title, singer, url
            })
            res.redirect('/songs')
        } catch (error) {
            res.send(error)
        }
    }
    static async deleteSongId(req, res){
        try {
            const {id} = req.params
            let data = await Song.findByPk(id)
            await data.destroy()
            res.redirect('/songs')
        } catch (error) {
            res.send(error)
        }
    }
}
module.exports = {AdminController}