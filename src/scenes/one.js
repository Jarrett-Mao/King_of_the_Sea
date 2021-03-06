class One extends Phaser.Scene {
    constructor() {
        super("levelOne");
    }

    preload() {
        this.load.image('Pause', 'assets/art/PauseButton.png');
        this.load.image('BG', 'assets/art/PlayBackground.png');

        this.load.image('rock', 'assets/sprites/rock.png');

        this.load.spritesheet('fish', 'assets/character/fishSpritesheet.png',
            { frameWidth: 275, frameHeight: 100 });
        this.load.spritesheet('clam', 'assets/sprites/clamAnimation.png',
            { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('blueShark', 'assets/character/blueSharkSpritesheet.png',
            { frameWidth: 736, frameHeight: 258 });
        this.load.spritesheet('hammerheadSharkH', 'assets/character/HammerheadSpritesheetH.png',
            { frameWidth: 630, frameHeight: 322 });
        this.load.spritesheet('hammerheadSharkV', 'assets/character/HammerheadSpritesheetV.png',
            { frameWidth: 324, frameHeight: 532 });

        // Transformation gem...probably to be used as the finish line.
        this.load.image('gemT', 'assets/sprites/TransformGem.png');

        // Health gem.
        this.load.image('gemH', 'assets/sprites/HealthGem.png');

        // 
        this.load.image('lifeH', 'assets/sprites/HeartIcon.png');
        this.load.image('lostH', 'assets/sprites/NotHeartIcon.png');
    }

    create() {
        currLevel = 1;

        // this.scene.start("levelComplete"); //debug

        this.add.image(0, 0, 'BG').setOrigin(0);

        this.saveX;
        this.saveY;

        //Key Controls
        UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);


        //create groups
        // Walls
        this.rockGroup = this.physics.add.group();

        // Enemies
        this.clamsGroup = this.physics.add.group();
        this.BSharksGroup = this.physics.add.group();

        // Gems
        this.finGemGroup = this.physics.add.group();
        this.helGemGroup = this.physics.add.group();

        //creating player
        this.p1Fish = new Fish(this, 320, 320, "fish");
        this.p1Fish.setScale(0.5);



        // Swimming Fish Animation.
        this.anims.create({
            key: 'FishSwimming',
            frames: this.anims.generateFrameNumbers('fish', {
                start: 0, end: 1
            }),
            frameRate: 5,
            repeat: -1
        });
        this.p1Fish.anims.play('FishSwimming');
        // Clam mouth is already open.
        this.anims.create({
            key: 'clamMouthOpen',
            frames: this.anims.generateFrameNumbers('clam', {
                start: 2, end: 2
            }),
            frameRate: 2.5,
            repeat: -1
        });
        // Clam's mouth opening animation.
        this.anims.create({
            key: 'clamOpenAnim',
            frames: this.anims.generateFrameNumbers('clam', {
                start: 0, end: 2
            }),
            frameRate: 2.5,
            repeat: 0
        });
        // Blue shark swimming.
        this.anims.create({
            key: 'blueSharkSwim',
            frames: this.anims.generateFrameNumbers('blueShark', {
                start: 0, end: 1
            }),
            frameRate: 2.5,
            repeat: -1
        });
        // Blue shark eating.
        this.anims.create({
            key: 'blueSharkEat',
            frames: this.anims.generateFrameNumbers('blueShark', {
                start: 2, end: 2
            }),
            frameRate: 2.5,
        });
        // Hammerhead shark swimming horizontally.
        this.anims.create({
            key: 'hammerheadSharkSwimH',
            frames: this.anims.generateFrameNumbers('hammerheadSharkH', {
                start: 0, end: 1
            }),
            frameRate: 2.5,
            repeat: -1
        });
        // Hammerhead shark swimming horizontally.
        this.anims.create({
            key: 'hammerheadSharkSwimV',
            frames: this.anims.generateFrameNumbers('hammerheadSharkV', {
                start: 0, end: 1
            }),
            frameRate: 2.5,
            repeat: -1
        });





        // Each rock is 200 x 200 (because of scale).
        // Format:
        // 'r', lowX, highX, y    -> create row.
        // 'c', x, lowY, highY    -> create column.
        // 'i', x, y, 0           -> create individual cell.
        let wallArr = [
            'r', 120, 3720, 120,
            'c', 120, 320, 3720,
            'r', 320, 3720, 3720,
            'c', 3720, 320, 3520,

            // top left section.
            'r', 520, 1220, 520,
            'r', 320, 1220, 920,
            'i', 1520, 320, 0,
            'c', 1520, 720, 1720,

            // middle left section.
            'r', 520, 1220, 1320,
            'r', 520, 1420, 1920,
            'c', 720, 1720, 2520,

            // bottom left section.
            'r', 320, 1520, 3320,
            'c', 1520, 2120, 2720,

            // middle section.
            'r', 1720, 1920, 2520,
            'r', 2320, 2520, 2520,
            'i', 3120, 2520, 0,
            'c', 2520, 2720, 3120,
            'c', 3320, 2520, 3520,
            'c', 2320, 2120, 2320,
            'c', 2120, 720, 1920,
            'c', 2320, 720, 1920,
            'i', 1920, 920, 0,
            'i', 1720, 1320, 0,
            'i', 1920, 1720, 0,

            // top right section.
            'r', 2520, 3320, 720,
            'r', 2720, 3320, 1120,
            'r', 2520, 3320, 1520,
            'r', 2720, 3520, 1920,
        ];

        // Much easier format.
        // x, y
        let clamArr = [
            520, 320,
            920, 1720,
            1320, 1720,
            2120, 520,
            3120, 520,
            520, 3120,
            1320, 3120,
        ];

        // Blue Shark Guards.
        // x1, x2, y <- Shark moves horizontally from x1 to x2.
        let BSharkArr = [
            540, 1120, 2720,
            540, 2120, 3020,
            2020, 2920, 3320,
            1920, 3320, 340,
        ];



        this.spawnWalls(this.rockGroup, wallArr);
        this.spawnClams(this.clamsGroup, clamArr);
        this.spawnBSharks(this.BSharksGroup, BSharkArr);




        this.physics.add.collider(this.p1Fish, this.rockGroup);




        let finish = this.physics.add.sprite(3500, 3500, 'gemT');
        this.finGemGroup.add(finish);
        finish.setScale(0.65);
        finish.body.immovable = true;
        finish.body.allowGravity = false;

        let health = this.physics.add.sprite(320, 3520, 'gemH');
        this.helGemGroup.add(health);
        health.setScale(0.65);
        health.body.immovable = true;
        health.body.allowGravity = false;

        // Blue sharks.


        // Lives.
        this.heart1 = this.add.sprite(50, 50, 'lifeH');
        this.heart1.setScale(1.4);
        this.heart1.setScrollFactor(0);
        this.heart2 = this.add.sprite(110, 50, 'lifeH');
        this.heart2.setScale(1.4);
        this.heart2.setScrollFactor(0);
        this.heart3 = this.add.sprite(170, 50, 'lifeH');
        this.heart3.setScale(1.4);
        this.heart3.setScrollFactor(0);









        //creates pause button
        this.pause = this.add.image(720, 50, 'Pause');
        this.pause.setInteractive();
        this.pause.on("pointerdown", () => {
            // this.press.visible = false;
            this.scene.pause();
            this.scene.launch('pauseScene');
        });
        this.pause.setScrollFactor(0);

        this.physics.add.collider(this.p1Fish, this.clamsGroup, null, this.touchedClam, this);
        this.physics.add.collider(this.p1Fish, this.BSharksGroup, null, this.touchedBShark, this);
        this.physics.add.overlap(this.p1Fish, this.finGemGroup, null, this.touchedFinish, this);
        this.physics.add.overlap(this.p1Fish, this.helGemGroup, null, this.addLife, this);



        // Create camera.
        this.cameras.main.setBounds(0, 0, 4000, 4000);

        this.cameras.main.setZoom(1); // Real
        // this.cameras.main.setZoom(0.1); // Debug mode, see the entire map.
        // have camera follow copter
        // startFollow(target [, roundPixels] [, lerpX] [, lerpY] [, offsetX] [, offsetY])
        this.cameras.main.startFollow(this.p1Fish, true, 1, 1);
        // set camera dead zone
        this.cameras.main.setDeadzone(100, 50);
        this.cameras.main.setName("center");
    }

    spawnWalls(group, arr) {
        for (let i = 0; i < arr.length; i += 4) {
            if (arr[i] == 'r') {
                let row = [];
                row.push(arr[i + 1], arr[i + 2], arr[i + 3]);
                this.spawnRow(group, row);
            }
            else if (arr[i] == 'c') {
                let col = [];
                col.push(arr[i + 1], arr[i + 2], arr[i + 3]);
                this.spawnCol(group, col);
            }
            else if (arr[i] == 'i') {
                this.spawnInd(group, arr[i + 1], arr[i + 2]);
            }
        }
    }

    spawnRow(group, arr) {
        // arr[0] = low X.
        // arr[1] = high X.
        // arr[2] = y.

        for (let i = arr[0]; i <= arr[1]; i += 200) {
            let rock1 = this.physics.add.sprite(i, arr[2], "rock");
            group.add(rock1);
            rock1.setScale(2);
            rock1.body.immovable = true;
            rock1.body.allowGravity = false;
        }
    }
    spawnCol(group, arr) {
        // arr[0] = x.
        // arr[1] = low Y.
        // arr[2] = high Y.

        for (let i = arr[1]; i <= arr[2]; i += 200) {
            let rock1 = this.physics.add.sprite(arr[0], i, "rock");
            group.add(rock1);
            rock1.setScale(2);
            rock1.body.immovable = true;
            rock1.body.allowGravity = false;
        }
    }
    spawnInd(group, x, y) {
        let rock1 = this.physics.add.sprite(x, y, "rock");
        group.add(rock1);
        rock1.setScale(2);
        rock1.body.immovable = true;
        rock1.body.allowGravity = false;
    }

    spawnClams(group, arr) {
        for (let i = 0; i < arr.length; i += 2) {
            let clam = new Enemy(this, arr[i], arr[i + 1] + 60, "clam");
            group.add(clam);
            clam.setScale(0.7);
            clam.body.immovable = true;
            clam.body.allowGravity = false;

            clam.anims.play('clamMouthOpen');
        }
    }

    spawnBSharks(group, arr) {
        for (let i = 0; i < arr.length; i += 3) {
            let bshark = new BlueShark(this, arr[i], arr[i + 2], "blueShark");
            group.add(bshark);

            bshark.startX = arr[i];
            bshark.endX = arr[i + 1];

            bshark.setScale(0.7);
            bshark.body.immovable = true;
            bshark.body.allowGravity = false;
            bshark.anims.play('blueSharkSwim');
        }
    }

    update() {
        this.p1Fish.update();
        for (let i = 0; i < this.BSharksGroup.children.entries.length; i++) {
            this.BSharksGroup.children.entries[i].update();
        }
        if (!this.p1Fish.dead) {
            if (this.p1Fish.lifeNumChanged) {

                this.updateHearts(true);

                this.p1Fish.lifeNumChanged = false;
            }
        }
        else {
            numLevelFailed = 1;
            this.p1Fish.destroy();
            this.time.delayedCall(2800, () => {
                this.scene.start("gameOver");
            }, null, this);
        }
    }

    updateHearts(triggerDead) {
        if (this.p1Fish.lives == 3) {
            this.heart3.destroy();
            this.heart3 = this.add.sprite(170, 50, 'lifeH');
            this.heart3.setScale(1.4);
            this.heart3.setScrollFactor(0);
            this.heart2.destroy();
            this.heart2 = this.add.sprite(110, 50, 'lifeH');
            this.heart2.setScale(1.4);
            this.heart2.setScrollFactor(0);
            this.heart1.destroy();
            this.heart1 = this.add.sprite(50, 50, 'lifeH');
            this.heart1.setScale(1.4);
            this.heart1.setScrollFactor(0);
        }
        if (this.p1Fish.lives == 2) {
            this.heart3.destroy();
            this.heart3 = this.add.sprite(170, 50, 'lostH');
            this.heart3.setScale(1.4);
            this.heart3.setScrollFactor(0);
            this.heart2.destroy();
            this.heart2 = this.add.sprite(110, 50, 'lifeH');
            this.heart2.setScale(1.4);
            this.heart2.setScrollFactor(0);
            this.heart1.destroy();
            this.heart1 = this.add.sprite(50, 50, 'lifeH');
            this.heart1.setScale(1.4);
            this.heart1.setScrollFactor(0);
        }
        else if (this.p1Fish.lives == 1) {
            this.heart3.destroy();
            this.heart3 = this.add.sprite(170, 50, 'lostH');
            this.heart3.setScale(1.4);
            this.heart3.setScrollFactor(0);
            this.heart2.destroy();
            this.heart2 = this.add.sprite(110, 50, 'lostH');
            this.heart2.setScale(1.4);
            this.heart2.setScrollFactor(0);
            this.heart1.destroy();
            this.heart1 = this.add.sprite(50, 50, 'lifeH');
            this.heart1.setScale(1.4);
            this.heart1.setScrollFactor(0);
        }
        else if (this.p1Fish.lives == 0) {
            this.heart3.destroy();
            this.heart3 = this.add.sprite(170, 50, 'lostH');
            this.heart3.setScale(1.4);
            this.heart3.setScrollFactor(0);
            this.heart2.destroy();
            this.heart2 = this.add.sprite(110, 50, 'lostH');
            this.heart2.setScale(1.4);
            this.heart2.setScrollFactor(0);
            this.heart1.destroy();
            this.heart1 = this.add.sprite(50, 50, 'lostH');
            this.heart1.setScale(1.4);
            this.heart1.setScrollFactor(0);
            if (triggerDead) {
                this.p1Fish.dead = true;
            }
        }
    }

    addLife(fish, gem) {
        if (fish.lives < 3) {
            fish.lives++;
            fish.lifeNumChanged = true;
        }
        gem.destroy();
    }

    touchedClam(fish, clam) {
        if (fish.hurt == 0) {
            if (fish.lives > 0) {
                fish.lives--;
                fish.lifeNumChanged = true;
                fish.hurt = 200;
                clam.anims.play('clamOpenAnim');
            }
        }
    }

    touchedBShark(fish, shark) {
        if (fish.hurt == 0) {
            if (fish.lives > 1) {
                fish.lives--;
                fish.hurt = 200;
                fish.lifeNumChanged = true;
            }
            else {
                fish.lives--;
                fish.lifeNumChanged = true;
                this.updateHearts(true);
                shark.anims.play('blueSharkEat');
                this.time.delayedCall(300, () => {
                    shark.anims.play('blueSharkSwim');
                }, null, this);
            }
        }
    }

    touchedFinish(fish, finish) {
        finish.destroy();
        // this.p1Fish.stop();
        this.time.delayedCall(600, () => {
            this.scene.resume();
            this.scene.start("levelComplete");
        }, null, this);
        // this.scene.pause();


    }
}