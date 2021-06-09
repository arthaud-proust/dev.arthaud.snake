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

        this._colors = [
            '#2f4f4f',
            '#8b4513',
            '#006400',
            '#4b0082',
            '#ff0000',
            '#ffa500',
            '#ffff00',
            '#00ff00',
            '#00ffff',
            '#0000ff',
            '#ff00ff',
            '#1e90ff',
            '#98fb98',
            '#ff69b4',
            '#ffefd5'
        ];

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
            if(this[list][i][0] == head.x && this[list][i][1] == head.y // point commun avec un élément de la liste
                && this[list][i][2] // si l'élément subit les collisions
                ) {
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
        if(++this._itemsInc>(17-Object.keys(this.users).length)) {
            this._itemsInc = 0;
            let item = [
                this.randomX(),
                this.randomY(),
                'apple'
            ]
            console.log('apple spawned');
            this._itemsMap.push(item);
            this.io.sockets.emit('itemSpawn', item)
        }
    }

    addUser() {
        return new Promise((resolve, reject)=>{
            if(this._colors.length==0) {
                reject({
                    type:'error',
                    content: 'Le serveur est plein'
                })
            } else {
                let user = new User(this);
                this._users[user.id] = user;
        
                console.log(Object.keys(this._users));
                resolve(user.json);
            }

        })

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