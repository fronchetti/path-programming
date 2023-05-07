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
    this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/sandbox.tmj');
    this.load.image('tileset', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/ground_texture.png?raw=true');
}

function create()
{
    this.cursors = this.input.keyboard.createCursorKeys();

    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('ground_texture', 'tileset');
    var groundLayer = map.createLayer('ground', tileset);
    var markersLayer = map.createLayer('markers', tileset);
    var boxesLayer = map.createLayer('boxes', tileset);

    this.robot = this.physics.add.sprite(384, 384, 'robot');
    
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

    this.robot.setCollideWorldBounds(true);
    this.robot.anims.play("right");
}

function update ()
{
    this.robot.setVelocity(0);

    if (this.cursors.left.isDown && this.cursors.down.isDown) {
        this.robot.setVelocityX(-200);
        this.robot.setVelocityY(200);
        this.robot.anims.play("down-left");
    }
    else if (this.cursors.right.isDown && this.cursors.down.isDown) {
        this.robot.setVelocityX(200);
        this.robot.setVelocityY(200);
        this.robot.anims.play("down-right");
    }
    else if (this.cursors.left.isDown && this.cursors.up.isDown) {
        this.robot.setVelocityX(-200);
        this.robot.setVelocityY(-200);
        this.robot.anims.play("up-left");
    }
    else if (this.cursors.right.isDown && this.cursors.up.isDown) {
        this.robot.setVelocityX(200);
        this.robot.setVelocityY(-200);
        this.robot.anims.play("up-right");
    }
    else if (this.cursors.left.isDown) {
        this.robot.setVelocityX(-300);
        this.robot.anims.play("left");
    }
    else if (this.cursors.right.isDown) {
        this.robot.setVelocityX(300);
        this.robot.anims.play("right");
    }
    else if (this.cursors.up.isDown) {
        this.robot.setVelocityY(-300);
        this.robot.anims.play("up");
    }
    else if (this.cursors.down.isDown) {
        this.robot.setVelocityY(300);
        this.robot.anims.play("down");
    }
}