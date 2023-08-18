const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const p = new Entity('Biker', {x: 200, y: 200}, '1', 1);
// const ent = new Entity('Biker', {x: 1000, y: 200})
// ent.setDirection('left');

const crosshair = new Image();
crosshair.src = `images/Crosshair.png`;

const mouse = {x: 0, y: 0};

function animate(){
    c.fillStyle='gray';
    c.fillRect(0, 0, canvas.width, canvas.height);
    updateCameraPos();
    c.drawImage(map, 0, 0, map.width, map.height, -cameraPos.x, -cameraPos.y, MAP_DRAWN_WIDTH, map.height / map.width * MAP_DRAWN_WIDTH);
    // c.fillStyle = 'green';
    // c.fillRect(canvas.width*0.35, canvas.height*0.3, canvas.width*0.3, canvas.height*0.5)
    updatePlayerDir();
    updateBullets();
    collisionEntities.forEach(e=>e.update())
    drawCrosshair();
    if(p.health <= 0) GAME_STATE.end = true;
    // c.fillStyle = 'red'
    // COLLISION_BLOCKS.forEach(block=>{
    //     c.fillRect(block.x*TILE_SIZE - cameraPos.x, block.y*TILE_SIZE - cameraPos.y, 1*TILE_SIZE, 1*TILE_SIZE);
    // })
    // entitiesCollision(p);
    requestAnimationFrame(animate);
}

ENEMY_SPAWN_BLOCKS.forEach(block=>{
    new Entity('Biker', {x: block.x*TILE_SIZE, y: block.y*TILE_SIZE-DRAWN_SIZE}, '1')
})

function updateCameraPos(){
    let pBox = p.getBox();
    if(pBox.x2 - cameraPos.x > canvas.width*0.65){
        cameraPos.x = pBox.x2 - canvas.width*0.65;
    }
    if(pBox.x - cameraPos.x < canvas.width*0.35){
        cameraPos.x = pBox.x - canvas.width*0.35;
    }
    if(pBox.y - cameraPos.y < canvas.height * 0.3){
        cameraPos.y = pBox.y - canvas.height * 0.3;
    }
    if(pBox.y2 - cameraPos.y > canvas.height * 0.8)
        cameraPos.y = pBox.y2 - canvas.height * 0.8;
}

function drawCrosshair(size = 50 * GLOBAS_SCALE){
    c.drawImage(crosshair, 0, 0, crosshair.width, crosshair.height, mouse.x - size/2, mouse.y - size/2, size, size);
}

function setMouse(event){
    event =event || window.event;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

window.onmousemove = setMouse;

function updatePlayerDir(){
    let angle = Math.atan((mouse.y + cameraPos.y- (p.pos.y + DRAWN_SIZE /2 ))/(mouse.x + cameraPos.x - (p.pos.x + DRAWN_SIZE/2)));
    p.handleAngle = angle - Math.PI/2;
    if(mouse.x + cameraPos.x> p.pos.x + DRAWN_SIZE / 2){
        p.setDirection('right');
    }
    if(mouse.x + cameraPos.x< p.pos.x + DRAWN_SIZE / 2){
        p.setDirection('left');
        p.handleAngle += Math.PI;
    }
}

document.onkeydown = key_down;
document.onkeyup = key_up;
var keys_pressed = [], up = 0;

document.addEventListener('click', ()=>{
    if(GAME_STATE.end) return
    if(p.dir === Directions.right)
        bullets.push(new Bullet('3', {x: p.pos.x+DRAWN_SIZE/2 + 18*DRAWN_SIZE/SPRITE_SIZE, y: p.pos.y + 26*DRAWN_SIZE/SPRITE_SIZE}, {x: mouse.x + cameraPos.x, y: mouse.y + cameraPos.y}, 1));
    if(p.dir === Directions.left)
        bullets.push(new Bullet('3', {x: p.pos.x + (SPRITE_SIZE-36)*DRAWN_SIZE/SPRITE_SIZE + 18*DRAWN_SIZE/SPRITE_SIZE, y: p.pos.y + 26*DRAWN_SIZE/SPRITE_SIZE}, {x: mouse.x + cameraPos.x, y: mouse.y + cameraPos.y}, 1));
})

function key_down(e) {
    var evtobj = window.event ? event : e;
    keys_pressed[evtobj.keyCode] = 1;
}

function key_up(e) {
    var evtobj = window.event ? event : e;
    delete(keys_pressed[evtobj.keyCode]);
    switch(evtobj.keyCode){
        case 65:
        case 68:
            p.isMove=0
            break
    }
}

function key_pressed(keycode) {
    switch(keycode){
        case '65':
            p.move(-1);
            break
        case '68':
            p.move(1);
            break
        case '32':
            p.jump();
            break
    }
}

setInterval(()=> {
    for (var keycode in keys_pressed) {
        key_pressed(keycode);
    }
}, 20);