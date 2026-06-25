const {User, Profile, Song, Playlist, LikedPlaylist, PlaylistSong} = require('../models')

class LandingController{
    static async home(req, res){
        try {
            const {UserId} = req.session
            // console.log(UserId, 'userId');

            let findUser = null
            if(UserId){
                findUser = await User.findOne({
                    include: Profile,
                    where: {id: UserId} 
                })
            }
            // console.log(findUser ? 'ada' : 'Null', 'findUser');
            res.render('landing/home', {findUser})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
}


module.exports = {LandingController}