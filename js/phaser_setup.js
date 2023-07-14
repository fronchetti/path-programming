class Sandbox extends Phaser.Scene {
    constructor() {
        super('Sandbox');
        this.isMouseDown = false;
        this.animationBlocks = [];
        this.savedPositions = []; /* Path visualization */
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
        
        /* Boxes settings */
        this.boxA = this.physics.add.sprite(1600, 1600, 'boxes', 5);
        this.boxB = this.physics.add.sprite(800, 900, 'boxes', 6);
        this.boxC = this.physics.add.sprite(1300, 1850, 'boxes', 7);
        this.boxD = this.physics.add.sprite(700, 200, 'boxes', 8);

        /* Gripper settings */
        this.gripper = this.physics.add.sprite(1024, 1024, 'gripper');
        this.gripper.setScale(1.5);
        this.gripper.setInteractive();
        this.gripper.body.setSize(168, 168);
        this.gripper.setCollideWorldBounds(true);
        
        /* Container settings (used to group gripper and nearest box) */
        this.container = this.add.container(this.gripper.x, this.gripper.y);
        this.container.setSize(this.gripper.width, this.gripper.height);

        /* Mouse mapping */
        this.input.mouse.disableContextMenu();
        
        this.input.on('pointerdown', function () {
            this.isMouseDown = true;
        }, this);
        
        this.input.on('pointerup', function () {
            this.isMouseDown = false;
        }, this);
        
        /* Keyboard mapping */
        var directionsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        var labelsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

        /* Display directions */
        directionsKey.on('down', function () {
            this.drawPath();
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
        this.container.setPosition(this.gripper.x, this.gripper.y)

        if (this.isMouseDown) {
            this.gripper.x = this.input.activePointer.worldX;
            this.gripper.y = this.input.activePointer.worldY;
        }
    }

    getGripperPosition() {
        return [this.gripper.x, this.gripper.y]
    }

    setAnimationBlocks(blocks) {
        this.savedAnimations = blocks; /* Used to perform animation */
    }
    
    executeAnimation() {
        const nextBlock = this.savedAnimations.shift();
        
        if (nextBlock) {
            blocklyWorkspace.highlightBlock(nextBlock.id);
            
            if (nextBlock.type === "move_to_position") {
                var positionName = nextBlock.getFieldValue("DROPDOWN_OPTIONS");
                var coordinates = savedCoordinates.get(positionName);

                this.tweens.add({
                    targets: this.gripper,
                    x: coordinates[0],
                    y: coordinates[1],
                    duration: 1000,
                    onComplete: () => {
                        this.executeAnimation(); // Move to each saved position recursively
                    }
                });
            }
            else if (nextBlock.type === "pick_object") {
                var closestBox = this.physics.closest(this.gripper, [this.boxA, this.boxB, this.boxC, this.boxD]);
                var distanceFromGripper = Phaser.Math.Distance.Between(this.gripper.x, this.gripper.y, closestBox.x, closestBox.y);
                var pickupDistance = 25; /* Reachable radius */

                if (distanceFromGripper < pickupDistance) {
                    if (this.container.list.length == 0) {
                        closestBox.setPosition((this.gripper.height / 2) - (closestBox.height / 2), (this.gripper.width / 2) - (closestBox.width / 2));
                        this.container.add(closestBox);
                        this.children.bringToTop(this.gripper);    
                    } else {
                        console.log("Gripper is holding another box.")
                    }
                }

                this.time.addEvent({
                    delay: 1000,
                    callback: ()=>{
                        this.executeAnimation();
                    },
                    loop: false
                })
            }
            else if (nextBlock.type === "release_object") {
                this.container.each(function(box) {
                    box.setPosition(this.gripper.x, this.gripper.y);
                }, this);

                this.container.removeAll(); /* Clear container */
                this.children.bringToTop(this.gripper);

                this.time.addEvent({
                    delay: 1000,
                    callback: ()=>{
                        this.executeAnimation();
                    },
                    loop: false
                })
            }
            else {
                this.executeAnimation(); 
            }
        } else {
            console.log('Phaser: Executed all block animations.');
        }
    }
    
    drawLabels() {
        /* Get ordered positions of movement blocks
           attached to starting block */
        this.positionValues = getBlocklyPositions();

        /* Clear previous drawings */
        this.positionLabels.forEach(label => label.destroy());
        this.positionLabels = [];
        
        for (let i = 0; i < this.positionValues.length; i++) {
            // Create and position the text object
            var currentPositionName = this.positionValues[i][0];
            var currentPosition = this.positionValues[i][1];
            //this.labelGraphics.fillStyle(0xff0000, 1); // Circle
            //this.labelGraphics.fillCircle(currentPosition[0], currentPosition[1], 20);
            const text = this.add.text(currentPosition[0], currentPosition[1], String(currentPositionName), { color: '#000', fontSize: '60px', fontWeight: 'bold'}).setOrigin(0.5);
            this.positionLabels.push(text);
        }
    }

    hideLabels() {
        this.positionLabels.forEach(label => label.destroy());
    }
    
    drawPath() {
        /* Get ordered positions of movement blocks
        attached to starting block */
        this.positionValues = getBlocklyPositions();

        /* Clear previous drawings */
        this.directionGraphics.clear();
        
        for (let i = 0; i < this.positionValues.length - 1; i++) {
            const currentPosition = this.positionValues[i][1];
            const nextPosition = this.positionValues[i + 1][1];
            
            const arrowStartX = currentPosition[0];
            const arrowStartY = currentPosition[1];
            
            const arrowEndX = nextPosition[0];
            const arrowEndY = nextPosition[1];

            const angle = Phaser.Math.Angle.Between(arrowStartX, arrowStartY, arrowEndX, arrowEndY);
            
            const arrowHeadLength = 15;
            const arrowHeadWidth = 15;
            const lineThickness = 10;
                        
            const arrowHeadEndX = arrowEndX - Math.cos(angle) * arrowHeadLength;
            const arrowHeadEndY = arrowEndY - Math.sin(angle) * arrowHeadLength;
            
            this.directionGraphics.lineStyle(lineThickness, 0x262626);
            this.directionGraphics.moveTo(arrowStartX, arrowStartY);
            this.directionGraphics.lineTo(arrowEndX, arrowEndY);
            this.directionGraphics.strokePath();
            
            this.directionGraphics.lineStyle(lineThickness, 0x262626);
            this.directionGraphics.moveTo(arrowEndX, arrowEndY);
            this.directionGraphics.lineTo(arrowHeadEndX + Math.cos(angle + Math.PI / 2) * arrowHeadWidth, arrowHeadEndY + Math.sin(angle + Math.PI / 2) * arrowHeadWidth);
            this.directionGraphics.lineTo(arrowHeadEndX - Math.cos(angle + Math.PI / 2) * arrowHeadWidth, arrowHeadEndY - Math.sin(angle + Math.PI / 2) * arrowHeadWidth);
            this.directionGraphics.closePath();
            this.directionGraphics.strokePath();
        }
    }

    hidePath() {
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
            debug: false,
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
