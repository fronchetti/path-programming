class Sandbox extends Phaser.Scene {
    constructor() {
        super('Sandbox');
        this.isMouseDown = false;
        this.savedActions = [];
        this.positionLabels = [];
    }
    
    preload() {
        this.load.spritesheet('gripper', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/gripper.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('boxes', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/boxes.png', { frameWidth: 256, frameHeight: 256 });
        this.load.tilemapTiledJSON('map', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/sandbox.tmj');
        this.load.image('tileset', 'https://raw.githubusercontent.com/fronchetti/path-planning-web/main/assets/boxes.png');
    }
    
    create() {
        /* Create the level */
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
        
        /* Gripper settings */
        this.gripper.setScale(1.5);
        this.gripper.setInteractive();
        this.gripper.setCollideWorldBounds(true);
        
        /* Bounding sizes */
        this.gripper.body.setSize(168, 168);
        this.boxA.body.setSize(168, 168);
        this.boxB.body.setSize(168, 168);
        this.boxC.body.setSize(168, 168);
        this.boxD.body.setSize(168, 168);
        
        /* Mouse mapping */
        this.input.mouse.disableContextMenu();
        
        this.input.on('pointerdown', function () {
            this.isMouseDown = true;
        }, this);
        
        this.input.on('pointerup', function () {
            this.isMouseDown = false;
        }, this);
        
        /* Keyboard mapping */
        var spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        var enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        var directionsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        var labelsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

        /* Display directions */
        directionsKey.on('down', function () {
            this.drawDirections();
        }, this);

        /* Display position labels */
        labelsKey.on('down', function () {
            this.drawLabels();
        }, this);
        
        /* Arrow drawing */
        this.directionGraphics = this.add.graphics();
        this.labelGraphics = this.add.graphics();
    }
    
    update() {
        if (this.isMouseDown) {
            this.gripper.x = this.input.activePointer.worldX;
            this.gripper.y = this.input.activePointer.worldY;
        }
    }

    getGripperPosition() {
        return [this.gripper.x, this.gripper.y]
    }

    appendAction(action_type, coordinates) {
        this.savedActions.push([action_type, coordinates]);
    }
    
    executeGripperAnimation() {
        const nextAction = this.savedActions.shift();
        
        if (nextAction) {
            var action_type = nextAction[0];
            var coordinates = nextAction[1];
            
            if (action_type === "move_to_position") {
                this.tweens.add({
                    targets: this.gripper,
                    x: coordinates[0],
                    y: coordinates[1],
                    duration: 1000,
                    onComplete: () => {
                        this.executeGripperAnimation(); // Move to each saved position recursively
                    }
                });
            } 
        } else {
            console.log('Finished gripper animation.');
        }
    }
    
    drawLabels() {
        /* Clear previous drawings */
        this.positionLabels.forEach(label => label.destroy());
        this.positionLabels = [];
        
        for (let i = 0; i < this.savedActions.length; i++) {
            // Create and position the text object
            const currentPosition = this.savedActions[i];
            this.labelGraphics.fillStyle(0xff0000, 1); // Circle
            this.labelGraphics.fillCircle(currentPosition.x, currentPosition.y, 50);
            const text = this.add.text(currentPosition.x, currentPosition.y, String(i), { color: '#ffffff', fontSize: '80px', fontWeight: 'bold', fontFamily: 'Verdana' }).setOrigin(0.5);
            this.positionLabels.push(text);
        }
    }

    hideLabels() {
        this.positionLabels.forEach(label => label.destroy());
    }
    
    drawDirections() {
        /* Clear previous drawings */
        this.directionGraphics.clear();
        
        for (let i = 0; i < this.savedActions.length - 1; i++) {
            const currentPosition = this.savedActions[i];
            const nextPosition = this.savedActions[i + 1];
            
            const angle = Phaser.Math.Angle.Between(currentPosition.x, currentPosition.y, nextPosition.x, nextPosition.y);
            
            const arrowHeadLength = 15;
            const arrowHeadWidth = 15;
            const lineThickness = 10;
            
            const arrowStartX = currentPosition.x;
            const arrowStartY = currentPosition.y;
            
            const arrowEndX = nextPosition.x;
            const arrowEndY = nextPosition.y;
            
            const arrowHeadEndX = arrowEndX - Math.cos(angle) * arrowHeadLength;
            const arrowHeadEndY = arrowEndY - Math.sin(angle) * arrowHeadLength;
            
            this.directionGraphics.lineStyle(lineThickness, 0xa84632);
            this.directionGraphics.moveTo(arrowStartX, arrowStartY);
            this.directionGraphics.lineTo(arrowEndX, arrowEndY);
            this.directionGraphics.strokePath();
            
            this.directionGraphics.lineStyle(lineThickness, 0xa84632);
            this.directionGraphics.moveTo(arrowEndX, arrowEndY);
            this.directionGraphics.lineTo(arrowHeadEndX + Math.cos(angle + Math.PI / 2) * arrowHeadWidth, arrowHeadEndY + Math.sin(angle + Math.PI / 2) * arrowHeadWidth);
            this.directionGraphics.lineTo(arrowHeadEndX - Math.cos(angle + Math.PI / 2) * arrowHeadWidth, arrowHeadEndY - Math.sin(angle + Math.PI / 2) * arrowHeadWidth);
            this.directionGraphics.closePath();
            this.directionGraphics.strokePath();
        }
    }

    hideDirections() {
        this.directionGraphics.clear();
    }
}

var config = { 
    width: 2048,
    height: 2048,
    parent: 'game-canvas',
    scene: [Sandbox],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
    },
    loader: {
        crossOrigin: 'anonymous'
    },
};

var game = new Phaser.Game(config);
