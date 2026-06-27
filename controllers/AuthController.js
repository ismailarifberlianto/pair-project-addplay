const { Op, where } = require("sequelize")
const {User, Profile} = require('../models');
const bcrypt = require('bcryptjs');
const welcomeEmail = require("../helper/mailer");

class AuthController{
    static async getSignup(req, res){
        try {
            let {errorMessage} = req.query
            // console.log(errorMessage, "error...");
            if(errorMessage && errorMessage.length > 0){
                errorMessage = errorMessage.split(",").join(". ") + ".";
            } else{
                errorMessage = undefined
            }
            res.render('auth/signup', {errorMessage})
        } catch (error) {
            res.send(error)
            // console.log(error);
        }
    }
    static async postSignup(req, res){
        try {
            // console.log(req.body);
            const {username, email, password, age, gender} = req.body
            let account = await Profile.create({
                username, email, age, gender
            })
            let user = await User.create({
                username,
                email,
                password,
                ProfileId: account.id
            })
            welcomeEmail(email, username)
                .then(info => console.log('Email successfully sent:', info.messageId))
                .catch(err => console.log('Email failed to send:', err));
            res.redirect('/login?successMessage=Registration successful! Please check your email.')
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                let errorMessage = error.errors.map(el =>{
                    return el.message
                })
                res.redirect(`/signup?errorMessage=${errorMessage}`)
            } else{
                res.send(error)
            }
        }
    }
    static async getLogin(req, res){
        try {
            let {errorMessage, successMessage} = req.query
            if(errorMessage && errorMessage.length > 0){
                errorMessage = errorMessage.split(",").join(". ") + ".";
            } else {
                errorMessage = undefined
            }
            res.render('auth/login', {errorMessage, successMessage: successMessage || undefined})
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
                res.redirect('/login?errorMessage=Email not found')
            } 
            let isValid = bcrypt.compareSync(password, findUser.password)
            if(!isValid){
                res.redirect('/login?errorMessage=Password is wrong')
                
            }
            req.session.UserId = findUser.id
            req.session.role = findUser.role
            req.session.username = findUser.username
            // console.log(req.session, 'setelah logout');
            res.redirect('/')
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                let errorMessage = error.errors.map(el =>{
                    return el.message
                })
                res.redirect(`/signup?errorMessage=${errorMessage}`)
            } else{
                res.send(error)
            }
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
            let findUser = await User.findOneUser(UserId)
            res.render(`auth/profile`, {findUser})
        } catch (error) {
            res.send(error)
            // console.log(error);
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
            await findUser.update({ username })
            res.redirect(`/profile/${UserId}`)
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = {AuthController}