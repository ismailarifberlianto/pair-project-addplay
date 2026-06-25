'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Profile);
      User.hasMany(models.Playlist);
      User.belongsToMany(models.Playlist, { through: 'LikedPlaylists', timestamps: false });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter email',
        },
        notEmpty: {
          msg: 'Please enter email',
        },
        isEmail: {
          args: true,
          msg: 'Please input valid email'
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter password',
        },
        notEmpty: {
          msg: 'Please enter password',
        },
        len: {
          args: [8],
          msg: 'Please input min 8 characters of password'
        }
      },
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    if(!user.role){
      user.role = 'user'
    }
    user.password = bcrypt.hashSync(user.password, 10)
  })
  User.beforeUpdate((user) => {
    if(user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  })
  return User;
};