const u = require('./utils');
const UsersManager = require('./usersManager');

module.exports = function(io) {
    const users = new UsersManager(io);

    users.interval(100);

    io.sockets.on("connection", socket => {

    socket.on('join', function () {
        console.log(`A player joined the game`);

        let userJson = users.addUser();

        socket.emit('user', userJson);
    });

    socket.on('move', function (user) {
        console.log(user.id +' moved '+user.direction);

        users.getUser(user.id).then(resultUser=>{
            resultUser.changeDirection(user.direction);
        }).catch(e=>{})

        // io.sockets.emit('moves', Object.values(users).map(user=>user.json));
    });

    socket.on('kill', function (user) {
        console.log(user.id +' killed');
        users.getUser(user.id).then(resultUser=>{
            resultUser._state.dead = true;
        }).catch(e=>{})
    });

    socket.on('leave', function (user) {
        console.log(user.id +' left');
        users.getUser(user.id).then(resultUser=>{
            resultUser._state.dead = true;
        }).catch(e=>{})
    });



    });
}