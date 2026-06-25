const { Op, where } = require("sequelize")
const {User, Profile} = require('../models');
const bcrypt = require('bcryptjs');

class AuthController{
    static async getSignup(req, res){
        try {
            res.render('auth/signup')
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
    static async postSignup(req, res){
        try {
            // console.log(req.body);
            const {username, email, password, age, gender} = req.body
            let account = await Profile.create({
                username, email, age, gender
            })
            await User.create({
                username,
                email,
                password,
                ProfileId: account.id
            })
            res.redirect('/login')
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
    static async getLogin(req, res){
        try {
            res.render('auth/login')
        } catch (error) {
            res.send(error)
        }
    }
    static async postLogin(req, res){
        try {
            // console.log(req.body);
            const {email, password} = req.body
            let findUser = await User.findOne({
                where: {email}
            })
            if(!findUser){
                throw new Error('Email not found')
            } 
            let isValid = bcrypt.compareSync(password, findUser.password)
            if(!isValid){
                throw new Error('Wrong Password')
            }
            req.session.UserId = findUser.id
            req.session.role = findUser.role
            req.session.username = findUser.username
            // console.log(req.session, 'setelah logout');
            res.redirect('/')
        } catch (error) {
            res.send(error)
        }
    }
    static async logoutId(req, res){
        try {
            req.session.destroy()
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }
    static async profile(req, res){
        try {
            const {UserId} = req.session
            res.redirect(`/profile/${UserId}`)
        } catch (error) {
            res.send(error)
        }
    }
    static async getProfileId(req, res){
        try {
            const {UserId} = req.session
            let findUser = await User.findOne({
                include: Profile,
                where: {id: UserId} 
            })
            res.render(`auth/profile`, {findUser})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
    static async getEditProfileId(req, res){
        try {
            const {UserId} = req.session
            let findUser = await User.findOne({
                include: Profile,
                where: {id: UserId} 
            })
            res.render('auth/editprofile', {findUser})
        } catch (error) {
            res.send(error)
        }
    }
    static async postEditProfileId(req, res){
        try {
            const {UserId} = req.session
            const {username, email, age, gender} = req.body
            let findUser = await User.findByPk(UserId)
            let data = await Profile.findByPk(findUser.ProfileId)
            await data.update({
                username, email, age, gender
            })
            res.redirect(`/profile/${UserId}`)
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = {AuthController}