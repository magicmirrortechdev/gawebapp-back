import Sequelize from 'sequelize';
import UserModel from './models/User';

const sequelize = new Sequelize('users', 'test', 'test1234', {
    host: 'db',
    dialect: 'mongodb',
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync().then(() => {
    // eslint-disable-next-line no-console
    console.log('Users db and user table have been created');
});

module.exports = User;