'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.belongsToMany(models.Playlist, { through: 'PlaylistSongs',  timestamps: false });
    }
  }
  Song.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter title',
        },
        notEmpty: {
          msg: 'Please enter title',
        },
      },
    },
    singer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter singer',
        },
        notEmpty: {
          msg: 'Please enter singer',
        },
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter url',
        },
        notEmpty: {
          msg: 'Please enter url',
        },
        isUrl: {
          args: true,
          msg: 'Please input valid url for Song'
        }
      },
    }
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};