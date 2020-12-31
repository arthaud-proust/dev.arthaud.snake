function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

class User {
    constructor(user) {
        this._id = user.id;
        this._color = user.color;
        this._queue = [];
    }

    get color() {return this._color}

    get id() {return this._id}

    get queue() {return this._queue}
    get length() {return this._queue.length}

    get json() {
        return {
            id: this.id,
            color: this.color,
            length: this.length,
            queue: this.queue
        }
    }

    move(direction) {
        socket.emit('move', {
            id: this.id,
            direction
        });
    }
}

class Map {
    constructor(parent, height, width) {
        this.height = height;
        this.width = width;
        this.background = '#000';
        this.items = [];
        
        this.factor = (window.screen.width < 700)?1:2
        
        $(parent).append(`<canvas id="map" height="${(height/2)*this.factor}" width="${(width/2)*this.factor}"></canvas>`);
        
        this.elScore = $('#score');
        this.el = $('#map');
        this.el.scaleCanvas({
            scale: (window.screen.width < 700)?1:2
        })
    }

    clear() {
        this.el.drawRect({
            fillStyle: this.background,
            x: 0, y: 0,
            width: this.width,
            height: this.height
        });

        for(let i=0; i<this.items.length; i++) {
            this.placeItem(this.items[i])
        }
    }

    place(users) {
        this.clear()
        for(let i = 0; i<users.length; i++) {
            if(user.id == users[i].id) {
                this.elScore.text(users[i].queue.length<15?'0':(users[i].queue.length-15)*5);
            }
            if(users[i].queue.length == 1) {
                $('canvas').drawArc({
                    fillStyle: users[i].color,
                    x: users[i].height/2 + users[i].queue[0][0],
                    y: users[i].width/2 + users[i].queue[0][1],
                    radius: users[i].height/2
                });

                continue
            }


            let line = {
                strokeStyle: users[i].color,
                strokeWidth: users[i].height,
                rounded: true
            };
            for (let p = 0; p < users[i].queue.length; p++) {
                line['x'+(p+1)] = users[i].height/2 + users[i].queue[p][0];
                line['y'+(p+1)] = users[i].width/2 + users[i].queue[p][1];
            }

            $('canvas').drawLine(line);
        }
    }

    placeItem(item) {
        $('canvas').drawImage({
            source: `/assets/${item[2]}.jpg`,
            x: item[0], y: item[1],
            scale: 0.70,
            fromCenter: false
        });
    }
}





// Join
socket.emit('join');

socket.on('user', newUser=>{
    window.map = new Map('body', newUser.map.height, newUser.map.width)
    window.user = new User(newUser);
    map.clear()

    console.log('Joined.', 'Color:', user.color);

    document.body.style.background = user.color;
    map.place([window.user.json])


    
    socket.on('moves', users=>{
        map.place(users)
    })


    socket.on('kill', user=>{
        if(user == window.user._id) window.location.reload()
        map.clear()
    })


    socket.on('itemSpawn', item=>{
        map.items.push(item)
    })

    socket.on('itemDespawn', items=>{
        map.items = items
    })



    document.addEventListener('click', function(e) {
        let directions = ['left', 'up', 'right', 'down'];
        let direction = e.target.id;
        if(directions.includes(direction)) {
            window.user.move(direction);
        }
    })

    document.addEventListener('keydown', function(e) {
        let directions = ['left', 'up', 'right', 'down'];
        let direction = e.key.replace('Arrow', '').toLowerCase();
        if(directions.includes(direction)) {
            window.user.move(direction);
        }
    })



})


window.onunload = window.onbeforeunload = () => {
    socket.emit('leave', window.user.json);
    socket.close();
};