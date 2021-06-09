const path = require('path');

module.exports = function(router) {

    router.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/home.html'));
    });

    router.get('/ingame', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/game.html'));
    });

    router.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/404.html'));
    });

};