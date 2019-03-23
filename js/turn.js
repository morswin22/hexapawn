class GameTurn {
    constructor() {
        this.current = -1;
        this.values = ["toPlayer", "player", "toBrain", "brain"];
        this.displayText = "Default";
        this.alphaMax = undefined;

        this.next();
    }

    next() {
        this.current++;
        if (this.current == this.values.length) this.current = 0;
        this.value = this.values[this.current];
    }

    set value(value) {
        this.gameTurnValue = value;

        switch(this.gameTurnValue) {
            case "toPlayer":
                this.displayText = "Your's turn!";
                this.textFade();
                break;
            case "player":
                this.displayText = "";
                break;
            case "toBrain":
                this.displayText = "Enemy's turn!";
                this.textFade();
                break;
            case "brain":
                this.displayText = "";
                brain.play();
                break;
            case "playerWon":
                this.displayText = "You have won!";
                brain.loss();
                setTimeout(()=>{
                    this.value = "gameReset";
                }, 1000);
                break;
            case "gameReset":
                brain.restart();
                grid.restart();
                this.current = -1;
                this.next();
                break;
        }
    }

    get value() {
        return this.gameTurnValue;
    }

    render() {
        noStroke();

        let alpha = (this.alpha === undefined) ? 255 : this.alpha;
        if (this.alphaMax) {
            alpha = lerp(this.alphaFrom,this.alphaTo,this.alphaAmt/this.alphaMax);
            this.alphaAmt++;
            if (this.alphaAmt == this.alphaMax) {
                this.alphaMaxAction();
            }
        }
        fill(0,0,0,alpha);

        textSize(28);
        textAlign(CENTER,CENTER);
        text(this.displayText, width/2,height*3/8);
    }

    textFade() {
        this.alpha = 0;
        setTimeout(()=>{
            this.alphaFrom = 0;
            this.alphaTo = 255;
            this.alphaAmt = 0;
            this.alphaMax = 15;
            this.alphaMaxAction = () => {
                setTimeout(()=>{
                    this.alphaFrom = 255;
                    this.alphaTo = 0;
                    this.alphaAmt = 0;
                    this.alphaMax = 15;
                    this.alphaMaxAction = () => {
                        this.alpha = undefined;
                        this.alphaMax = undefined;
                        this.next();
                    }
                }, 500);
            }
        }, 200);
    }
}