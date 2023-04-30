
var config = {
    width: 600,
    height: 600,
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
    this.load.image('robot', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/robot.png?token=GHSAT0AAAAAABQOGQYVKY42KLGBDY7C5U7IZCOAAKQ');
}

function create()
{
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = this.physics.add.image(100, 100, 'robot');
    this.player.scale = 0.1;
    this.player.setCollideWorldBounds(true);
}

function update ()
{
    this.player.setVelocity(0);

    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-300);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(300);
    }
    else if (this.cursors.up.isDown)
    {
        this.player.setVelocityY(-300);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.setVelocityY(300);
    }
}