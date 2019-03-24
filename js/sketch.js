let brain;
let grid;
let pointer;

let textures = [];
let match_boxes;
let brains = [];

let gameTurn;

function preload() {
    textures.push(loadImage('/assets/image/pointer_default.png'));
    textures.push(loadImage('/assets/image/pointer_grab.png'));
    textures.push(loadImage('/assets/image/pointer_grabbing.png'));

    textures.push(loadImage('/assets/image/brain_pawn.png'));
    textures.push(loadImage('/assets/image/player_pawn.png'));

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
    // brain.import(brains[0]);
    gameTurn = new GameTurn();

    pointer = new Pointer([textures[0],textures[1],textures[2]]);
}

function draw() {
    background(51);

    grid.update();
    grid.render();

    pointer.update(grid.pawns.player);

    gameTurn.render();
}