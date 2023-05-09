var config = {
    width: 2048,
    height: 2048,
    parent: 'game-canvas',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload()
{
    this.load.spritesheet('gripper', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/gripper.png?raw=true', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('boxes', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/boxes.png?raw=true', { frameWidth: 256, frameHeight: 256 });
    this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/sandbox.tmj');
    this.load.image('tileset', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/boxes.png?raw=true');
}

function create()
{
    /* Keyboard key mapping */
    this.cursors = this.input.keyboard.createCursorKeys();

    /* Create the map */
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('boxes', 'tileset');
    var groundLayer = map.createLayer('ground', tileset);
    var markersLayer = map.createLayer('markers', tileset);

    /* Gripper and boxes are considered sprites */
    this.boxA = this.physics.add.sprite(1600, 1600, 'boxes', 5);
    this.boxB = this.physics.add.sprite(800, 900, 'boxes', 6);
    this.boxC = this.physics.add.sprite(1300, 1850, 'boxes', 7);
    this.boxD = this.physics.add.sprite(700, 200, 'boxes', 8);
    this.gripper = this.physics.add.sprite(384, 384, 'gripper');
    this.gripper.setScale(1.5);
    
    this.gripper.setCollideWorldBounds(true);

    /* Make boxes immovable */
    this.boxA.body.setImmovable(true);
    this.boxB.body.setImmovable(true);
    this.boxC.body.setImmovable(true);
    this.boxD.body.setImmovable(true);

    /* Bounding sizes */
    this.gripper.body.setSize(168, 168);
    this.boxA.body.setSize(168, 168);
    this.boxB.body.setSize(168, 168);
    this.boxC.body.setSize(168, 168);
    this.boxD.body.setSize(168, 168);
}

function update ()
{
    this.gripper.setVelocity(0);

    if (this.cursors.left.isDown) {
        this.gripper.setVelocityX(-300);
    }
    else if (this.cursors.right.isDown) {
        this.gripper.setVelocityX(300);
    }
    else if (this.cursors.up.isDown) {
        this.gripper.setVelocityY(-300);
    }
    else if (this.cursors.down.isDown) {
        this.gripper.setVelocityY(300);
    }
}