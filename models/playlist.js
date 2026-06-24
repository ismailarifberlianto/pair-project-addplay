'use strict';
const {
  Model
} = require('sequelize');
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
      Playlist.belongsToMany(models.User, { through: 'LikedPlaylists', timestamps: false });
      Playlist.belongsToMany(models.Song, { through: 'PlaylistSongs', timestamps: false });

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