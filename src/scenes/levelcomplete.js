class LevelComplete extends Phaser.Scene {
    constructor() {
        super("levelComplete");
    }
    preload() {


    }
    create() {
        let levelConfig = {
            // fontFamily: 'Arial Black',
            fontSize: '32px',
            // backgroundColor: '#F3B141',
            // color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            // fixedWidth: 100
        }

        let levelName = "";
        console.log(currLevel);

        // currLevel = 3; //debug

        switch(currLevel) {
            case 1:
                levelName = "One";
                this.input.on("pointerdown", () => {
                    this.scene.start("levelTwo");
                });
                break;
            case 2:
                levelName = "Two";
                this.add.text(100, 240, "You've unlocked the Hammerhead! Use 1 and 2 to switch between forms.");
                
                this.input.on("pointerdown", () => {
                    this.scene.start("levelThree");
                });
                break;
            case 3: 
                levelName = "Three";
                this.add.text(60, 240, "You've unlocked the Great White! Use 1, 2, and 3 to switch between forms.");
                this.input.on("pointerdown", () => {
                    this.scene.start("victory");
                });
                break;
        }

        this.lev = this.add.text(200, 150, "Level " + levelName + " Complete.", levelConfig);

        this.add.text(200, 300, "Click anywhere on the screen to continue").setColor("#00F000");


    }
    update() {

    }
}