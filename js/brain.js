class Brain {
    constructor(gameTree) {
        this.current = 0;
        this.loadGameTree(gameTree);
        this.picked = [];
        this.history = [];
    }

    loadGameTree(gameTree) {
        this.tree = gameTree;
    }

    match(matchBox) {
        let brainPawns = [];
        let playerPawns = [];
        for(let row in matchBox.position) {
            for (let col in matchBox.position[row]) {
                let cell = matchBox.position[row][col];
                if (cell == "b") {
                    brainPawns.push({col, row});
                } else if (cell == "p") {
                    playerPawns.push({col, row});
                }
            }
        }
        if (brainPawns.length == grid.pawns.brain.length && playerPawns.length == grid.pawns.player.length) {
            // match brain pawns
            let brainMatches = true;
            for (let matchBoxPawn of brainPawns) {
                let pawnMatches = false;
                for (let gridPawn of grid.pawns.brain) {
                    if (matchBoxPawn.col == gridPawn.col && matchBoxPawn.row == gridPawn.row) {
                        pawnMatches = true;
                    }
                }
                if (!pawnMatches) {
                    brainMatches = false;
                }
            }
            // match player pawns
            let playerMatches = true;
            for (let matchBoxPawn of playerPawns) {
                let pawnMatches = false;
                for (let gridPawn of grid.pawns.player) {
                    if (matchBoxPawn.col == gridPawn.col && matchBoxPawn.row == gridPawn.row) {
                        pawnMatches = true;
                    }
                }
                if (!pawnMatches) {
                    playerMatches = false;
                }
            }

            if (playerMatches && brainMatches) {
                return true;
            }
        }
        return false;
    }

    flip(matchBox) {
        for (let row of matchBox.position) {
            row.reverse();
        }
        let moves = this.splitMoves(matchBox.moves);
        for(let moveI in moves) {
            for (let i in moves[moveI]) {
                if (moves[moveI][i].x == 0) {
                    moves[moveI][i].x = 2;
                } else if (moves[moveI][i].x == 2) {
                    moves[moveI][i].x = 0;
                }
            }
        }
        matchBox.moves = this.joinMoves(moves);
        return matchBox;
    }

    splitMoves(moves) {
        let splitted = [];
        for (let move of moves) {
            splitted.push(this.splitMove(move));
        }
        return splitted;
    }

    splitMove(move) {
        let data = /(\d)x(\d)=>(\d)x(\d)/.exec(move);
        return {from: {x:data[1], y:data[2]}, to: {x:data[3], y:data[4]}};
    }

    joinMoves(moves) {
        let joined = [];
        for (let move of moves) {
            joined.push(this.joinMove(move));
        }
        return joined;
    }

    joinMove(move) {
        return `${move.from.x}x${move.from.y}=>${move.to.x}x${move.to.y}`;
    }

    play() {
        let possible = this.tree[this.current];
        let setId;
        for (let set in possible) {
            if (this.match(possible[set]) || this.match(this.flip(possible[set]))) {
                possible = possible[set];
                setId = set;
                break;
            }
        }
        if (!possible.length && possible.length != 0) {
            // pick possible move
            let picked;
            let pickedArray;
            do {
                picked = random(possible.moves);
                pickedArray = this.picked.concat([{set:setId,move:possible.moves.indexOf(picked)}]);
            } while(this.inLossHistory(pickedArray))
            this.picked = pickedArray;
            this.current++;

            picked = this.splitMove(picked);
            for (let pawn of grid.pawns.brain) {
                if (pawn.col == picked.from.x && pawn.row == picked.from.y) {
                    pawn.col = picked.to.x;
                    pawn.row = picked.to.y;
                    pawn.onDestinationReached = function() {
                        if (picked.to.y == 2) {
                            gameTurn.value = "brainWon";
                        } else {
                            gameTurn.next();
                        }
                    }.bind(pawn);
                    pawn.destination(pawn.col*grid.width+(grid.width/2), pawn.row*grid.height+(grid.height/2));

                    // kill players pawn
                    for (let playerPawnI in grid.pawns.player) {
                        let playerPawn = grid.pawns.player[playerPawnI];
                        if (playerPawn.col == pawn.col && playerPawn.row == pawn.row) {
                            grid.pawns.player.splice(playerPawnI,1);
                        }
                    }
                }
            }
        } else {
            if (this.current == 2) {
                gameTurn.value = 'playerWon';
            }
            console.log('## No Matches! ##', this.current);
        }
    }

    win(loss) {
        this.history.push({
            loss: !!loss,
            picked: this.picked
        });
    }

    loss() {
        this.win(true);
    }

    restart() {
        this.current = 0;
        this.picked = [];
    }

    inLossHistory(picked) {
        for (let elem of this.history) {
            if (elem.loss) {
                if (JSON.stringify(elem.picked) == JSON.stringify(picked)) {
                    return true;
                }
            }
        }
        return false;
    }
}