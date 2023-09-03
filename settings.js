const GLOBAS_SCALE = 0.75;
const GAME_STATES = {menu: 0, game: 1};
var GAME_STATE = GAME_STATES.menu;
const cameraPos = {
    x: 0,
    y: 0
},
DRAWN_SIZE = 150 * GLOBAS_SCALE,
LOAD_RESOURCES = {map: false}
;
const HEALTH_BAR = {
    filled: new Image(),
    empty: new Image()
};

HEALTH_BAR.empty.src = `images/UI/HBempty.png`;
HEALTH_BAR.filled.src = `images/UI/HBfilled.png`;

const MAP_WIDTH = 208;
const SPAWN_POINT = {x: 0, y: 0};
const map = new Image();

// const TILE_SIZE = MAP_DRAWN_WIDTH * MAP_WIDTH / map.width;
const TILE_SIZE = 30 * GLOBAS_SCALE;