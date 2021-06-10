const u = require('./utils');
const UsersManager = require('./usersManager');

module.exports = function(io) {
    const users = new UsersManager(io);

    users.interval(120);

    io.sockets.on("connection", socket => {

        socket.emit('map.data', {
            cubes: users.cubes
        });

        socket.on('join', function () {
            console.log(`A player joined the game`);

            let userJson = users.addUser();
            socket.userId = userJson.id;
            socket.emit('user.data', userJson);
        });

        socket.on('user.move', function (data) {
            // console.log(data.user +' moved '+data.direction);

            users.getUser(data.user).then(resultUser=>{
                resultUser.changeDirection(data.direction);
            }).catch(e=>{})

            // io.sockets.emit('moves', Object.values(users).map(user=>user.json));
        });

        socket.on('kill', function (user) {
            console.log(user.id +' killed');
            users.getUser(user.id).then(resultUser=>{
                resultUser._state.dead = true;
            }).catch(e=>{})
        });

        socket.on('leave', function (userId) {
            console.log(userId +' left');
            users.getUser(userId).then(resultUser=>{
                resultUser.manager._colors.push(resultUser._color);
                resultUser._state.afk = true;
            }).catch(e=>{})
        });

        socket.on('disconnect', function() {
            console.log('Got disconnect!');
      
            users.getUser(socket.userId).then(resultUser=>{
                resultUser.manager._colors.push(resultUser._color);
                resultUser._state.afk = true;
            }).catch(e=>{})
         });
    });
}