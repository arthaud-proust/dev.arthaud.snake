const path = require('path');

module.exports = function(router) {

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        // console.log((new Date()).toLocaleTimeString('fr-FR', {minute: '2-digit', hour: '2-digit', second:'2-digit'})+': '+req.path);
        // console.log(req.path);
        next();
    });

    router.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/home.html'));
    });

    router.get('/ingame', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/game.html'));
    });

    router.get('/full', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/full.html'));
    });


    router.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/404.html'));
    });
};