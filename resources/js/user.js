const u = require('./utils');

module.exports = class User {
    constructor(manager) {
        this.manager = manager;
        this.height = this.manager.user.height;
        this.width = this.manager.user.width;
        this.map = this.manager.map;
        this._id = u.randomId();
        this._color = this.manager._colors.shift();
        // this._color = u.randomColor();

        this.KICK_AFTER = 999999;
        // this.KICK_AFTER = 100;

        this.spawn();
        this._directions = {
            "none": [0,0, 'x',0,"empty", 0],
            "left": [-1,0,'x',0, "right"],
            "up": [0,-1,'y',0, "down"],
            "right": [1,0,'x',this.map.width/2-this.width, "left"],
            "down": [0, 1,'y',this.map.height/2-this.height, "up"]
        };
    }

    get color() {return this._color}

    get id() {return this._id}
    get state() {return this._state}
    get queue() {return this._queue}
    get length() {return this._queue.length}
    
    get direction() {return this._direction}

    get directionData() {
        return this._directions[this._direction];
    }

    get fromDirectionData() {
        return this._directions[this._from];
    }

    get head() {return {
        x: this._queue[this.length-1][0],
        y: this._queue[this.length-1][1],
    }}

    get json() {
        return {
            id: this._id,
            color: this._color,
            map: this.map,
            itemsMap: this.manager.itemsMap,
            queue: this._queue,
            direction: this._direction,
            height: this.height,
            width: this.width,
        }
    }

    spawn() {
        this._queue = [
            [
                this.manager.randomX(),
                this.manager.randomY()
            ],
        ];
        this._state = {
            grow:10,
            born: true,
            dead: false,
            afk: false,
            afkTurns:0,
            innocent: true,
            innocentTurns: 10,
        };
        this._direction = "none";
        this._from = "none";
    }

    changeDirection(direction) {
        if(this.fromDirectionData[4] == direction ) return
        this._direction = direction;
        this._state.born = true;
    }

    headOn(list, item=false) {
        return this.manager.headOn(this.head, list, item)
    }

    move() {
        if(this.direction=="none") {
            if(++this._state.afkTurns >= this.KICK_AFTER) {
                this._state.afk=true;
            }
            return []
        }

        if(this._state.innocentTurns > 0) {
            this._state.innocentTurns--;
        } else {
            this._state.innocent = false;
        }

        // si touche bordure, ou un autre joueur est qu'il n'est pas innocent
        if(
            // this.head[this.directionData[2]] == this.directionData[3] ||
            (this.headOn("usersMap") && !this._state.innocent)// usersMap contient toutes les coordonnées occupées par les joueurs
            ) { 
            this._state.dead = true;
            return []
        }

        if(this.state.grow > 0) {
            this._state.grow--
        } else {
            this._queue.shift();
        }

        const item = this.headOn("itemsMap", true)
        if(item) {
            if(item[2]=="apple") {
                this._state.grow+=3;
                console.log(this.id+' eat an apple');
            }
        }

        this._queue.push([
            this.head.x + this.directionData[0]*this.width,
            this.head.y + this.directionData[1]*this.height,
            !this._state.innocent //  innocent = intouchable
        ])

        // si traverse le mur
        if(this.directionData[2] == 'x') {
            if(this.head[this.directionData[2]] == this.directionData[3] + this.directionData[0]*this.width) {
                // this._queue[this.length-1][0] -= this.directionData[0] * (this.map.width/2+this.width);
                this._queue[this.length-1][0] -= this.directionData[0] * (this.map.width/2);
            }
        } else {
            if(this.head[this.directionData[2]] == this.directionData[3] + this.directionData[1]*this.height) {
                // this._queue[this.length-1][1] -= this.directionData[1] * (this.map.height/2+this.height);
                this._queue[this.length-1][1] -= this.directionData[1] * (this.map.height/2);
            }
        }


        this._from = this.direction;

        return this.queue.slice(0, this.length-1) // return queue without head
    }

}