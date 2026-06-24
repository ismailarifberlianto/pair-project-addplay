'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
    }
  }
  Profile.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter username',
        },
        notEmpty: {
          msg: 'Please enter username',
        }
      },
    },
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
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter age',
        },
        notEmpty: {
          msg: 'Please enter age',
        },
        min: {
          args: 1,
          msg: 'Please input valid age'
        }
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter gender',
        },
        notEmpty: {
          msg: 'Please enter gender',
        },
      },
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};