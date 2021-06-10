import * as THREE from 'three';
import { OrbitControls } from './libs/orbitControls.js';
import World from './classes/world';
import io from 'socket.io-client';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

const WORLD_SIZE=350;

let camera, scene, renderer, world, startTime, stats,

    rubik,
    object, clipMaterial,
    globalClippingPlanes;


    
function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    // scene.fog = new THREE.Fog( 0xa0a0a0, 100, WORLD_SIZE );

    world = new World(scene, WORLD_SIZE);


    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight );
    camera.position.set( WORLD_SIZE/2,300,WORLD_SIZE*2 );
    scene.add( camera );

    // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

    //


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );

    //

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.minDistance = 400;
    controls.maxDistance = 1000;
    controls.distance = 1000;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI/2;
    controls.target.set( WORLD_SIZE/2, 20, WORLD_SIZE/2 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );


    // for ( let i = 0; i < 500; i ++ ) {
    //     world.addCube();
    // }

    
    var OBJFile = './models/apple_obj/apple.obj';
    var MTLFile = './models/apple_obj/apple.mtl';
    var JPGFile = './models/apple_obj/apple_color.jpg';

    // new MTLLoader()
    // .load(MTLFile, function (materials) {
    //     materials.preload();
    //     new OBJLoader()
    //         .setMaterials(materials)
    //         .load(OBJFile, function (object) {
    //             object.position.y = - 95;
    //             var texture = new THREE.TextureLoader().load(JPGFile);

    //             object.traverse(function (child) {   // aka setTexture
    //                 if (child instanceof THREE.Mesh) {
    //                     child.material.map = texture;
    //                 }
    //             });
    //             scene.add(object);
    //         });
    // });




    /*
    const loader = new OBJLoader();

    loader.load(
        'assets/apple_obj/apple.obj',
        function ( object ) {

            console.log(object);
            mesh = object.scene.children[ 0 ];
            object.position.x = 10;
            object.position.y = 10;
            object.position.z = 10;
            object.scale.x = object.scale.y = object.scale.z = 10;

            mesh.material = new THREE.MeshPhongMaterial( {
                specular: 0x111111,
                map: textureLoader.load( './assets/apple_obj/apple_color.jpg' ),
                specularMap: textureLoader.load( './assets/apple_obj/apple_specular_map.jpg' ),
                normalMap: textureLoader.load( './assets/apple_obj/apple_specular_map.jpg' ),
                shininess: 25
            } );
            scene.add( object );

        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        function ( error ) {

            console.log( 'An error happened' );
            console.error(error);

        }
    );
        */
    render();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {
    renderer.render( scene, camera );
}


function animate() {

    // const currentTime = Date.now(),
        // time = ( currentTime - startTime ) / 1000;

    requestAnimationFrame( animate );

    // stats.begin();
    renderer.render( scene, camera );
    // stats.end();

}

init();
animate();


const socket = io.connect(window.location.origin);
window.userQueues = {};

socket.emit('join');
socket.on('map.data', mapData=>{
    world.updateWith(mapData);
});

socket.on('item.spawn', item=>{
    world.addApple(item[3], [
        item[0],
        0,
        item[1]
    ]);
});

socket.on('item.despawn', item=>{
    let itemUuid = item[3];
    scene.remove(world.obj[itemUuid]);
});

window.onunload = window.onbeforeunload = () => {
    socket.emit('leave', {user: user.id})
    console.log(user.id);
    socket.close();
};

socket.on('user.data', userData=>{
    window.user = userData;
    console.log(user);
});

socket.on('moves', users=>{
    users.forEach(usr => {
        if (usr.id in userQueues) {
            userQueues[usr.id].push(
                world.addCube([
                    usr.queue[usr.queue.length-1][0],
                    0,
                    usr.queue[usr.queue.length-1][1]
                ], new THREE.MeshPhongMaterial( { color: usr.color, flatShading: true } ))
            );

            while(userQueues[usr.id].length>usr.queue.length) {
                scene.remove(userQueues[usr.id][0])
                userQueues[usr.id].shift();
            }
        } else {
            userQueues[usr.id] = [];
            for(let part of usr.queue) {
                userQueues[usr.id].push(
                    world.addCube([
                        part[0],
                        0,
                        part[1]
                    ], new THREE.MeshPhongMaterial( { color: usr.color, flatShading: true } ))
                );
            }
        }

    });
    // console.log(users);
    // map.place(users)
})

document.addEventListener('keydown', function(e) {
    let directions = ['left', 'up', 'right', 'down'];
    let direction = e.key.replace('Arrow', '').toLowerCase();
    if(directions.includes(direction)) {
        socket.emit('user.move', {
            user: user.id,
            direction
        });
    }
})

