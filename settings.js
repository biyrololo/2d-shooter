const isMobile = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const GLOBAS_SCALE = isMobile? 0.75: 1;
const GAME_STATES = {menu: 0, game: 1};
var GAME_STATE = GAME_STATES.game;
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
const TILE_SIZE = 45 * GLOBAS_SCALE;

let isHdTextures = true;