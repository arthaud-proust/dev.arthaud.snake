const User = require('./user');

module.exports = class UserManager {
    constructor(io) {
        this.io = io;

        this._items = ['apple'];

        this._itemsMap = [];
        this._itemsInc = 0;

        this._usersMap = [];
        this._newUsersMap = [];
        this._users = {};

        this.user = {
            height: 10,
            width: 10
        }
        this.map = {
            height: 700,
            width: 700
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
            if(this[list][i][0] == head.x && this[list][i][1] == head.y) {
                if(item) {
                    this[list].splice(i,1); // if don't wrk 
                    this.io.emit('itemDespawn', this[list])
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
        if(++this._itemsInc>20) {
            this._itemsInc = 0;
            let item = [
                this.randomX(),
                this.randomY(),
                'apple'
            ]
            console.log('apple spawned');
            this._itemsMap.push(item);
            this.io.emit('itemSpawn', item)
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