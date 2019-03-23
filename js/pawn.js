const PawnAmtMax = 10;

class Pawn {
    constructor(x,y,side) {
        this.col = x;
        this.row = y;

        this.x = this.col*grid.width+(grid.width/2);
        this.y = this.row*grid.height+(grid.height/2);

        this.width = grid.width*3/4;
        this.height = grid.height*3/4;

        if (side == 'player') this.isPlayer=!0;
        if (side == 'brain') this.isBrain=!0;

        this.destinationPoint = {x:this.x,y:this.y};
    }

    destination(x, y) {
        this.originPoint = {x:this.x,y:this.y};
        this.lerpAmt = 0;
        this.destinationPoint = {x,y};
    }

    release() {
        let inCell = undefined;
        for (let x in grid.data) {
            for (let y in grid.data[x]) {
                let cell = grid.data[x][y];
                if (testPointInRect(this.x, this.y, x*grid.width, y*grid.height, y*grid.height + grid.height, x*grid.width + grid.width)) {
                    inCell = {x,y,cell};
                }
            }
        }
        
        if (inCell) {
            if (this.col == inCell.x && this.row == inCell.y) {
                // same cell
                this.destination(this.col*grid.width+(grid.width/2), this.row*grid.height+(grid.height/2));
            } else {
                // check if can move
                let isAttacking = false;
                for (let brainPawn of grid.pawns.brain) {
                    if (brainPawn.col == inCell.x && brainPawn.row == inCell.y) {
                        isAttacking = brainPawn;
                    }
                }
                if (isAttacking) {
                    // can only move diagonally
                    if (this.row - inCell.y == 1 && abs(this.col - inCell.x) == 1) {
                        this.col = inCell.x;
                        this.row = inCell.y;
                        // todo: kill that pawn
                        let pawnI = grid.pawns.brain.indexOf(isAttacking);
                        grid.pawns.brain.splice(pawnI,1);
                        if (this.row == 0) {
                            gameTurn.value = 'playerWon';
                        } else {
                            gameTurn.next();
                        }
                    }
                } else {
                    // can only move straight one cell
                    if (this.row - inCell.y == 1 && this.col - inCell.x == 0) {
                        this.row = inCell.y;
                        gameTurn.next();
                    }
                }
                this.destination(this.col*grid.width+(grid.width/2), this.row*grid.height+(grid.height/2));
            }
        } else {
            // out of screen
            this.destination(this.col*grid.width+(grid.width/2), this.row*grid.height+(grid.height/2));
        }
    }

    update() {
        this.left = this.x - this.width/2;
        this.right = this.x + this.width/2;
        this.top = this.y - this.height/2;
        this.bottom = this.y + this.height/2;

        // if origin point is set, then lerp to the destination
        if (this.originPoint) {
            if (this.lerpAmt <= PawnAmtMax) {
                this.x = lerp(this.originPoint.x, this.destinationPoint.x, this.lerpAmt/PawnAmtMax);
                this.y = lerp(this.originPoint.y, this.destinationPoint.y, this.lerpAmt/PawnAmtMax);
                this.lerpAmt++;
            } else {
                this.originPoint = undefined;
                if (this.onDestinationReached) {
                    this.onDestinationReached();
                    this.onDestinationReached = undefined;
                }
            }
        }
    }

    render() {
        imageMode(CENTER);
        image((this.isBrain) ? textures[3] : textures[4], this.x, this.y, this.width, this.height);
    }
}