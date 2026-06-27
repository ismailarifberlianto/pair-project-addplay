const {Playlist} = require('../models')

const isLogin = (req, res, next) => {
    if(!req.session.UserId){
        return res.redirect('/login')
    }
    next()
}

const isAdmin = (req, res, next) => {
    if(req.session.role !== 'admin'){
        return res.redirect('/')
    }
    next()
}

const isOwner = async (req, res, next) => {
    const {id} = req.params
    let play = await Playlist.findByPk(id)
    if(play.UserId !== req.session.UserId){
        return res.redirect('/')
    }
    next()
}

module.exports = {isLogin, isAdmin, isOwner}