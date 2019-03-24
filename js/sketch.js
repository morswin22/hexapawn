let brain;
let grid;
let pointer;

let textures = [];
let match_boxes;
let brains = [];

let gameTurn;
let buttons = [];

let expertLoaded;

function preload() {
    textures.push(loadImage('/assets/image/pointer_default.png'));
    textures.push(loadImage('/assets/image/pointer_grab.png'));
    textures.push(loadImage('/assets/image/pointer_grabbing.png'));

    textures.push(loadImage('/assets/image/brain_pawn.png'));
    textures.push(loadImage('/assets/image/player_pawn.png'));

    textures.push(loadImage('/assets/image/expert.png'));
    textures.push(loadImage('/assets/image/derpy.png'));

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

    pointer.update(grid.pawns.player);

    gameTurn.render();
}

function mousePressed() {
    for(let button of buttons) button.check();
}