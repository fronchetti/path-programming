var config = {
    width: 2048,
    height: 2048,
    parent: 'game-canvas',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
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
    this.load.spritesheet('robot', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/robot.png?raw=true', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('boxes', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/ground_texture.png?raw=true', { frameWidth: 256, frameHeight: 256 });
    this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/sandbox.tmj');
    this.load.image('tileset', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/ground_texture.png?raw=true');
}

function create()
{
    /* Keyboard key mapping */
    this.cursors = this.input.keyboard.createCursorKeys();

    /* Create the map */
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('ground_texture', 'tileset');
    var groundLayer = map.createLayer('ground', tileset);
    var markersLayer = map.createLayer('markers', tileset);

    /* Robot and boxes are considered sprites */
    this.robot = this.physics.add.sprite(384, 384, 'robot');
    this.boxA = this.physics.add.sprite(1600, 1600, 'boxes', 4);
    this.boxB = this.physics.add.sprite(800, 900, 'boxes', 5);
    this.boxC = this.physics.add.sprite(1300, 1850, 'boxes', 6);
    this.boxD = this.physics.add.sprite(700, 200, 'boxes', 7);

    /* Robot animation */
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 0 }),
        frameRate: 2,
        repeat: -1
      });
    this.anims.create({
        key: 'up-right',
        frames: this.anims.generateFrameNumbers('robot', { start: 1, end: 1 }),
        frameRate: 2,
        repeat: -1
      });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('robot', { start: 2, end: 2 }),
        frameRate: 2,
        repeat: -1
      });
    this.anims.create({
        key: 'down-right',
        frames: this.anims.generateFrameNumbers('robot', { start: 3, end: 3 }),
        frameRate: 2,
        repeat: -1
      });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('robot', { start: 4, end: 4 }),
        frameRate: 2,
        repeat: -1
      });
    this.anims.create({
        key: 'down-left',
        frames: this.anims.generateFrameNumbers('robot', { start: 5, end: 5 }),
        frameRate: 2,
        repeat: -1
      });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('robot', { start: 6, end: 6 }),
        frameRate: 2,
        repeat: -1
      });
    this.anims.create({
        key: 'up-left',
        frames: this.anims.generateFrameNumbers('robot', { start: 7, end: 7 }),
        frameRate: 2,
        repeat: -1
      });

    /* Physics */
    this.physics.add.existing(this.robot);
    this.physics.add.existing(this.boxA);
    this.physics.add.existing(this.boxB);
    this.physics.add.existing(this.boxC);
    this.physics.add.existing(this.boxD);

    /* Make boxes collidable with robot */
    this.physics.add.collider(this.robot, this.boxA, null, null, this);
    this.physics.add.collider(this.robot, this.boxB, null, null, this);
    this.physics.add.collider(this.robot, this.boxC, null, null, this);
    this.physics.add.collider(this.robot, this.boxD, null, null, this);

    this.robot.setCollideWorldBounds(true);

    /* Make boxes immovable */
    this.boxA.body.setImmovable(true);
    this.boxB.body.setImmovable(true);
    this.boxC.body.setImmovable(true);
    this.boxD.body.setImmovable(true);

    /* Bounding sizes */
    this.robot.body.setSize(168, 168);
    this.boxA.body.setSize(168, 168);
    this.boxB.body.setSize(168, 168);
    this.boxC.body.setSize(168, 168);
    this.boxD.body.setSize(168, 168);
}

function update ()
{
    this.robot.setVelocity(0);

    if (this.cursors.left.isDown) {
        this.robot.setVelocityX(-300);
    }
    else if (this.cursors.right.isDown) {
        this.robot.setVelocityX(300);
    }
    else if (this.cursors.up.isDown) {
        this.robot.setVelocityY(-300);
    }
    else if (this.cursors.down.isDown) {
        this.robot.setVelocityY(300);
    }

    var isMovingUp = (this.robot.body.velocity.y < 0);
    var isMovingDown = (this.robot.body.velocity.y > 0);
    var isMovingLeft = (this.robot.body.velocity.x < 0);
    var isMovingRight = (this.robot.body.velocity.x > 0);

    if (isMovingUp) {
        this.robot.anims.play("up");
    }
    else if (isMovingDown) {
        this.robot.anims.play("down");
    }
    else if (isMovingLeft) {
        this.robot.anims.play("left");
    }
    else if (isMovingRight) {
        this.robot.anims.play("right");
    }
}