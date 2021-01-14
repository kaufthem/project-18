'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Enter a valid first name."
        }
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Enter a valid last name."
        }
      }
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Email field cannot be empty."
        },
        isEmail: {
          msg: "Enter a valid email address."
        }
      },
      unique: {
        args: true,
        msg: 'This email address is already in use.'
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Enter a valid password."
        }
      }
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Course, {foreignKey: "userId" });
  };
  return User;
};