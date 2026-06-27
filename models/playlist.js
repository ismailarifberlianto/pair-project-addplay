'use strict';
const {
  Model
} = require('sequelize');
const { Op, where } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Playlist.belongsTo(models.User);
      Playlist.belongsToMany(models.User, { through: 'LikedPlaylists' });
      Playlist.belongsToMany(models.Song, { through: 'PlaylistSongs' });

    }

    static async findWithDetails(search) {
      let option = {
        include: [sequelize.models.Song, sequelize.models.User]
      }

      if (search) {
        option.where = {
          name: {
            [Op.iLike]: `%${search}%`
          }
        }
      }

      let data = await Playlist.findAll(option)
      return data
    }

    get totalLike() {
      return this.LikedPlaylists ? this.LikedPlaylists.length : 0
    }

    get totalSong() {
      return this.Songs ? this.Songs.length : 0
    }
  }
  Playlist.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter Name',
        },
        notEmpty: {
          msg: 'Please enter Name',
        },
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter image url',
        },
        notEmpty: {
          msg: 'Please enter image url',
        },
        isUrl: {
          args: true,
          msg: 'Please input valid url for image'
        }
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter description',
        },
        notEmpty: {
          msg: 'Please enter description',
        },
      },
    }
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};