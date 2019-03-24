let brain;
let grid;
let pointer;

let textures = [];
let match_boxes;
let brains = [];

let gameTurn;
let buttons = [];

let expertLoaded;

let games = 0;
let wins = 0; let winHeight = 1;
let loses = 0; let loseHeight = 1;
let winloseAmt = 0;
let winloseAmtMax = 10;

function preload() {
    textures.push(loadImage('/assets/image/pointer_default.png'));
    textures.push(loadImage('/assets/image/pointer_grab.png'));
    textures.push(loadImage('/assets/image/pointer_grabbing.png'));

    textures.push(loadImage('/assets/image/brain_pawn.png'));
    textures.push(loadImage('/assets/image/player_pawn.png'));

    textures.push(loadImage('/assets/image/expert.png'));
    textures.push(loadImage('/assets/image/derpy.png'));
    textures.push(loadImage('/assets/image/player.png'));

    match_boxes = loadJSON('/assets/match_boxes.json');

    brains.push(loadJSON('/assets/brains/expert.json'));
}

function setup() {
    let canvas = createCanvas(600, 800);
    canvas.parent(select('#canvas'));
    textFont('Montserrat');

    let baseColor = color(255,114,114);

    grid = new Grid(3,4);
    grid.insert([
        [{isBrain:!0},{isBrain:!0},{isBrain:!0}],
        [{},{},{}],
        [{isPlayer:!0},{isPlayer:!0},{isPlayer:!0}],
        [{isBase:!0,color: baseColor},{isBase:!0,color: baseColor},{isBase:!0,color: baseColor}]
    ]);
    brain = new Brain(match_boxes);
    gameTurn = new GameTurn();

    pointer = new Pointer([textures[0],textures[1],textures[2]]);

    expertLoaded = false;
    buttons.push(new Button(500,760,120,40,"Load expert", function(){
        games = 0; wins = 0; loses = 0;
        if (!expertLoaded) {
            this.text = "Reset brain";
            brain.import(brains[0]);
            gameTurn.value = "brainLoad";
            expertLoaded = true;
        } else {
            this.text = "Load expert";
            brain.import([]);
            gameTurn.value = "brainLoad";
            expertLoaded = false;
        }
    }));
}

function draw() {
    background(51);

    grid.update();
    grid.render();

    push();
    imageMode(CENTER);
    image(expertLoaded ? textures[6] : textures[5], 500, 670, 110, 110);
    pop();
    for(let button of buttons) button.render();

    push()
    winloseAmt += 0.3;
    if (winloseAmt > winloseAmtMax) { 
        winHeight = (games > 0) ? wins/games * 120 : 1;
        loseHeight = (games > 0) ? loses/games * 120 : 1;
        winloseAmt = winloseAmtMax;
    }
    imageMode(CENTER);
    noStroke();
    fill(100, 217, 98);
    rect(55, 740, 20, wins/games > 0 ? -(lerp(winHeight, wins/games * 120, winloseAmt/winloseAmtMax)) : 1);
    image(textures[7], 65, 770, 32, 32);
    rect(125, 740, 20, loses/games > 0 ? -(lerp(loseHeight, loses/games * 120, winloseAmt/winloseAmtMax)) : 1);
    image(!expertLoaded ? textures[6] : textures[5], 135, 770, 32, 32);
    pop()

    pointer.update(grid.pawns.player);

    gameTurn.render();
}

function mousePressed() {
    for(let button of buttons) button.check();
}