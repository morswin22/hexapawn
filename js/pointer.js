let PointerSize = 32;
let PointerOffset = -11;

class Pointer {
    constructor (textures) {
        this.hovered = [];
        this.held = undefined;
        this.offset = [];
        let obj = Object.values(textures);
        this.textures = {
            default: obj[0],
            grab: obj[1],
            grabbing: obj[2]
        }
        noCursor();
        this.lastPos = [mouseX, mouseY];
    }

    update(pawns) {
        this.velocity = [mouseX - this.lastPos[0], mouseY - this.lastPos[1]];
        this.lastPos = [mouseX, mouseY];
        this.hovered = [];
        if (!this.held) {
            if (gameTurn.value == "player") {
                for (let pawn of pawns) {
                    if (testPointInRect(mouseX, mouseY, pawn.left, pawn.top, pawn.bottom, pawn.right)) {
                        this.hovered.push(pawn);
                        if (mouseIsPressed) {
                            this.held = pawn;
                            this.held.isHeld = true;
                            this.offset = [pawn.x - mouseX, pawn.y - mouseY];
                        }
                    }
                }
            }
        } else {
            if (!mouseIsPressed) {
                this.held.isHeld = false;
                this.held.release();
                this.held = undefined;
                this.offset = [];
            } else {
                this.held.x = mouseX + this.offset[0];
                this.held.y = mouseY + this.offset[1];
            }
        }
        if (this.held) {
            this.held.render();
            this.render(this.textures.grabbing);
        } else if (this.hovered.length == 0) {
            this.render(this.textures.default);
        } else if (this.hovered.length > 0) {
            this.render(this.textures.grab);
        } 
    }

    render(texture) {
        imageMode(CORNER);
        image(texture, mouseX + PointerOffset, mouseY, PointerSize, PointerSize);
    }
}

function testPointInRect(pointX, pointY, left, top, bottom, right) {
    return(pointX > left && pointX < right && pointY > top && pointY < bottom)
}