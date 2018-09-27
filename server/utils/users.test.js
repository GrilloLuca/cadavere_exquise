const expect = require('expect');

const {Users} = require('./users');

describe('users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Luca',
            room: 'Test Room'
        }, {
            id: 2,
            name: 'Cazzo',
            room: 'Cazzo Room'
        }, {
            id: 3,
            name: 'Marica',
            room: 'Test Room'
        }]
    });


    it('create correct user', () => {

        console.log(users.getUserList('Test Room'));
        console.log(users.getUser(1));
        console.log(users.removeUser(2));

        var user = {
            id: '23456', 
            name: 'Luca', 
            room: 'test'
        }
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(resUser).toEqual(user);
    });
});

