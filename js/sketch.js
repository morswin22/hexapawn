let brain;
let grid;
let pointer;

let textures = [];

let GameTurn = "player";

function preload() {
    textures.push(loadImage('/assets/image/pointer_default.png'));
    textures.push(loadImage('/assets/image/pointer_grab.png'));
    textures.push(loadImage('/assets/image/pointer_grabbing.png'));

    textures.push(loadImage('/assets/image/brain_pawn.png'));
    textures.push(loadImage('/assets/image/player_pawn.png'));
}

function setup() {
    let canvas = createCanvas(600, 800);
    canvas.parent(select('#canvas'))

    let baseColor = color(255,114,114);

    grid = new Grid(3,4);
    grid.insert([
        [{isBrain:!0},{isBrain:!0},{isBrain:!0}],
        [{},{},{}],
        [{isPlayer:!0},{isPlayer:!0},{isPlayer:!0}],
        [{isBase:!0,color: baseColor},{isBase:!0,color: baseColor},{isBase:!0,color: baseColor}]
    ]);
    brain = new Brain();

    pointer = new Pointer([textures[0],textures[1],textures[2]]);
}

function draw() {
    background(51);

    grid.update();
    grid.render();

    pointer.update(grid.pawns.player);
}