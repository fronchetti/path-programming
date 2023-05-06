
var config = {
    width: 640,
    height: 640,
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
    this.load.spritesheet('robot', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/robot.png?raw=true', { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapTiledJSON('floor', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/test_map.tmj');
    this.load.image('tiles', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/floor_texture.png?raw=true');
}

function create()
{
    this.cursors = this.input.keyboard.createCursorKeys();

    var map = this.make.tilemap({ key: 'floor' });
    var tileset = map.addTilesetImage('floor', 'tiles');
    var groundLayer = map.createLayer('floor', tileset);
    // var objectLayer = map.createLayer('boxes', tileset);

    this.robot = this.physics.add.sprite(160, 160, 'robot');
    
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('robot', { start: 5, end: 6 }),
        frameRate: 2,
        repeat: -1
      });
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('robot', { start: 2, end: 3 }),
        frameRate: 2,
        repeat: -1
      });
      this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
      });
      this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('robot', { start: 7, end: 8}),
        frameRate: 2,
        repeat: -1
      });

      this.robot.setCollideWorldBounds(true);
      this.robot.setScale(2);
}

function update ()
{
    this.robot.setVelocity(0);

    if (this.cursors.left.isDown) {
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