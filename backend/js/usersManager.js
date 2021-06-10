const User = require('./user');
const uuid = require('uuid');

module.exports = class UserManager {
    constructor(io) {
        this.io = io;

        this.cubeSize = 10;
        this.size = 350;
        this.cubes = [];

        for(let i =0; i<500; i++) {
            this.cubes.push([
                Math.round(Math.random() * (this.size/this.cubeSize-1) ) * this.cubeSize,
                0,
                Math.round(Math.random() * (this.size/this.cubeSize-1) ) * this.cubeSize 
            ])
        }

        this._items = ['apple'];

        this._itemsMap = [];
        this._itemsInc = 0;

        this._usersMap = [];
        this._newUsersMap = [];
        this._users = {};

        this._colors = [
            '#000000',
            '#006400',
            '#ff0000',
            '#0000cd',
            '#00ff00',
            '#e9967a',
            '#00ffff',
            '#ffff54',
            '#6495ed',
            '#ff1493'
        ];

        this.user = {
            height: this.cubeSize,
            width: this.cubeSize
        }
        this.map = {
            height: this.size*2,
            width: this.size*2
        }
    }

    get itemsMap() {return this._itemsMap}
    get usersMap() {return this._usersMap}
    get users() {return this._users}

    randomX() {
        return Math.floor(Math.random()*this.map.width/(2*this.user.width))*(this.user.width);
    }
    randomY() {
        return Math.floor(Math.random()*this.map.height/(2*this.user.width))*(this.user.height);
    }

    headOn(head, list, item=false) {
        for(let i = 0; i<this[list].length;i++) {
            if(this[list][i][0] == head.x && this[list][i][1] == head.y // point commun avec un élément de la liste
                && this[list][i][2] // si l'élément subit les collisions
                ) {
                if(item) {
                    let deletedItem = this[list].splice(i,1)[0]; // if don't wrk 
                    
                    // peut apporter un problème si un objet n'est pas supprimé, il ne le sera pas ensuite
                    // this.io.emit('item.despawn', this[list])
                    
                    this.io.emit('item.despawn', deletedItem)
                }
                return this[list][i]
            }
        }
        return false
    }

    interval(interval) {
        if(this._interval) clearInterval(this._interval);


        this._interval = setInterval(()=>{

            this.randomAddApple()


            this.io.sockets.emit('moves', Object.values(this.users).map(user=>{
                if(user.state.afk) {
                    this.io.sockets.emit('afk', user.id);
                    delete this.users[user.id]
                } else if(user.state.dead) {
                    console.log(user.id+' is dead');
                    this.io.sockets.emit('kill', user.id);
                    // delete this.users[user.id]
                    user.spawn();
                } else {
                    // console.log(user.id + ' deplaced');
                    this._newUsersMap = [...this._newUsersMap, ...user.move()]
                    return user.json
                }

            }));

            this._usersMap = this._newUsersMap;
            this._newUsersMap = [];
        }, interval);
    }

    randomAddApple() {
        if(this._itemsMap.length>=Object.keys(this.users).length*2) return
        if(++this._itemsInc>(17-Object.keys(this.users).length)) {
            this._itemsInc = 0;
            let item = [
                this.randomX(),
                this.randomY(),
                'apple',
                uuid.v4()
            ]
            console.log('apple spawned');
            this._itemsMap.push(item);
            this.io.sockets.emit('item.spawn', item)
        }
    }

    addUser() {
        let user = new User(this);
        this._users[user.id] = user;

        return user.json;
    }

    getUser(id) {
        return new Promise((resolve, reject)=>{
            if(this._users[id]!==undefined) {
                resolve(this._users[id])
            } else {
                reject()
            }
        })
    }
}