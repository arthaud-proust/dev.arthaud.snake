const THREE = require('three');

module.exports = class {
    constructor(scene, size=500) {
        this.size = size;
        this.cubeSize = 10;
        this.scene = scene;

        this.obj={}

        this.cubes=[];
        this.cubeBase = {
            geometry: new THREE.BoxGeometry( 1, 1, 1 ),
            material: new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
        };
        this.cubeBase.geometry.translate( 0.5, 0.5, 0.5 );


        this.makeGround();
        this.setLight();
    }

    setLight() {
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 100, 0 );
        this.scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( - 0, 40, 50 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = - 25;
        dirLight.shadow.camera.left = - 25;
        dirLight.shadow.camera.right = 25;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 200;
        dirLight.shadow.mapSize.set( 1024, 1024 );
        this.scene.add( dirLight );
    }
    makeGround() {
        this.obj.ground = new THREE.Mesh( new THREE.BoxGeometry( this.size, 10, this.size), new THREE.MeshPhongMaterial( { color: 0x888888, depthWrite: false } ) );
        // this.obj.ground.rotation.x = - Math.PI / 2;
        this.obj.ground.position.x = 0;
        this.obj.ground.position.z = 0;
        this.obj.ground.geometry.translate( this.size/2, -5,this.size/2);
        this.obj.ground.receiveShadow = true;
        this.scene.add( this.obj.ground );
    }

    addCube(cube, material=this.cubeBase.material) {

        const mesh = new THREE.Mesh( 
            this.cubeBase.geometry, 
            material
        );

        // mesh.position.x = Math.round(Math.random() * (this.size/this.cubeSize-1) ) * this.cubeSize;
        // mesh.position.y = 0;
        // mesh.position.z = Math.round(Math.random() * (this.size/this.cubeSize-1) ) * this.cubeSize ;
        mesh.position.x = cube[0];
        mesh.position.y = cube[1];
        mesh.position.z = cube[2];
        mesh.scale.x = mesh.scale.y = mesh.scale.z = this.cubeSize;

        // mesh.scale.y = Math.random() * 80 + 10;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;

        // this.cubes.push(mesh);
        this.scene.add( mesh );

        return mesh;
    }

    setCubes(cubes) {
        for(let i=0; i<cubes.length;i++) {
            this.addCube(cubes[i]);
        }
    }

    updateWith(mapData) {
        // this.setCubes(mapData.cubes);
    }
}