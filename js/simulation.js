
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
    this.load.spritesheet('robot', 'https://i.imgur.com/mb4zipF.png', { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/sandbox.tmj');
    this.load.image('ground-tiles', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/ground_texture.png?raw=true');
    this.load.image('objects-tiles', 'https://github.com/fronchetti/path-planning-web/blob/main/assets/objects_texture.png?raw=true');
}

function create()
{
    this.cursors = this.input.keyboard.createCursorKeys();

    var map = this.make.tilemap({ key: 'map' });
    var groundTileset = map.addTilesetImage('ground', 'ground-tiles');
    var objectsTileset = map.addTilesetImage('objects', 'objects-tiles');
    var groundLayer = map.createLayer('ground', groundTileset);
    var objectsLayer = map.createLayer('objects', objectsTileset);

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