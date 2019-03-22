class Grid {
    constructor(w, h) {
        this.rows = w;
        this.cols = h;
        this.width = width/w;
        this.height = height/h;

        this.fill(undefined);
        this.pawns = {brain:[], player:[]};
    }

    fill(fillWith) {
        this.data = new Array(this.rows).fill(new Array(this.cols).fill(fillWith));
    }

    insert(data) {
        for (let x in this.data) {
            for (let y in this.data[x]) {
                this.data[x][y] = data[y][x];
                // create pawns
                if (data[y][x].isBrain) this.pawns.brain.push(new Pawn(x, y, 'brain'));
                if (data[y][x].isPlayer) this.pawns.player.push(new Pawn(x, y, 'player'));
            }
        }
    }

    set(x, y, value) {
        if (x >= 0 && x < this.rows && y >= 0 && y < this.cols) {
            this.data[x][y] = value;
        }
    }

    get(x, y) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            return this.data[x][y];
        } else {
            return false;
        }
    }

    render() {
        this.renderGrid();
        this.renderPawns();
    }

    renderGrid() {
        for (let x in this.data) {
            for (let y in this.data[x]) {
                let cell = this.data[x][y];
                let cellColor = ((parseInt(y) + (parseInt(x)*this.rows)) % 2 == 0) ? color(200) : color(100);
                if (cell.color) {
                    cellColor = cell.color;
                }
                noStroke();
                fill(cellColor);
                rect(x*this.width, y*this.height, this.width, this.height);
            }
        }
    }

    renderPawns() {
        for(let side in this.pawns) {
            for (let pawn of this.pawns[side]) {
                if (!pawn.isHeld) {
                    pawn.render();
                }
            }
        }
    }
}