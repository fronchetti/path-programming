class Sandbox extends Phaser.Scene {
    constructor() {
        super('Sandbox');
        this.isMouseDown = false;
        this.animationBlocks = [];

        /* Used in path visualization */
        this.pathLabels = [];
        this.pathCircles = [];
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
            this.drawCircles();
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

    drawCircles() {
        /* Settings */
        var circleRadius = 50;

        /* Clear position labels */
        this.pathLabels.forEach(label => label.destroy());
        this.pathLabels = [];

        /* Clear previous drawings */
        this.directionGraphics.clear();

        this.positionValues = getBlocklyPositions();

        for (let i = 0; i < this.positionValues.length; i++) {
            var positionName = this.positionValues[i][0];
            const positionCoordinates = this.positionValues[i][1];

            const positionX = positionCoordinates[0];
            const positionY = positionCoordinates[1];

            /* Interactable Circle */
            const positionCircle = this.add.circle(positionX, positionY, circleRadius, 0x000000);
            positionCircle.setInteractive();
            this.input.setDraggable(positionCircle);
            this.pathCircles.push(positionCircle)

            positionCircle.on('drag', function (p, x, y) {
                positionCircle.setFillStyle(0xe87041);
                positionCircle.x = x;
                positionCircle.y = y;
                this.positionValues[i][1][0] = x;
                this.positionValues[i][1][1] = y;
            }, this);

            positionCircle.on('dragend', function() {
                this.pathCircles.forEach(circle => circle.destroy());
                this.drawCircles();
            }, this);

            /* Position label */
            const text = this.add.text(positionX, positionY - 75, String(positionName), { fontFamily: 'Arial', color: '#000', fontSize: '48px', fontWeight: 'bold'}).setOrigin(0.5);
            this.pathLabels.push(text);
        }
    }

    drawPath() {
        /* Get ordered positions of movement blocks
        attached to starting block */
        this.positionValues = getBlocklyPositions();

        /* Clear previous drawings */
        this.directionGraphics.clear();
        
        for (let i = 0; i < this.positionValues.length - 1; i++) {
            var currentPositionName = this.positionValues[i][0];
            const currentPosition = this.positionValues[i][1];
            const nextPosition = this.positionValues[i + 1][1];
            
            const startPointX = currentPosition[0];
            const startPointY = currentPosition[1];
            const endPointX = nextPosition[0];
            const endPointY = nextPosition[1];

            var angle = Phaser.Math.Angle.Between(startPointX, startPointY, endPointX, endPointY);

            const lineThickness = 5;
    
            /* Lines */
            this.directionGraphics.lineStyle(lineThickness, 0x121212, 0.85);
            this.directionGraphics.beginPath()
            this.directionGraphics.moveTo(startPointX, startPointY);
            this.directionGraphics.lineTo(endPointX, endPointY);
            this.directionGraphics.strokePath();
            this.directionGraphics.closePath();

            //this.pathCircles.push(positionCircle);

            //this.directionGraphics.fillStyle(0xf5f5f5, 1); 
            //this.directionGraphics.fillCircle(startPointX, startPointY, circleRadius);

            if (i == this.positionValues.length - 2) {
                var currentPositionName = this.positionValues[i + 1][0];
                const currentPosition = this.positionValues[i + 1][1];

                const startPointX = currentPosition[0];
                const startPointY = currentPosition[1];

                /* Circle */
                this.directionGraphics.fillStyle(0xf5f5f5, 1); 
                this.directionGraphics.fillCircle(startPointX, startPointY, circleRadius);

                /* Label */
                const text = this.add.text(startPointX, startPointY, String(currentPositionName), { fontFamily: 'Arial', color: '#000', fontSize: '32px', fontWeight: 'bold'}).setOrigin(0.5);
                this.pathLabels.push(text);
            }
        }

        this.children.bringToTop(this.gripper);
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
