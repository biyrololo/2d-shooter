const mouse = {x: 0, y: 0};

function setMouse(event){
    event =event || window.event;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

window.onmousemove = setMouse;

function playerDie(){
    startGame();
}

function ckeckIsPlayerDie(){
    if(collisionEntities.indexOf(p) === -1 || p.health <= 0) playerDie();
}

/**
 * 
 * @param {{x: number, y: number}} point 
 */
function startFromPoint(point){
    collisionEntities.splice(0, collisionEntities.length);
    p.setPos(point);
    collisionEntities.push(p);
    spawnEnemies();
    drops.splice(0, drops.length);
}

function startGame(){
    p.health = p.maxHealth;
    collisionEntities.splice(0, collisionEntities.length);
    p.setPos(SPAWN_POINT);
    collisionEntities.push(p);
    spawnEnemies();
    drops.splice(0, drops.length);
    cameraPos.y = p.pos.y + DRAWN_SIZE - canvas.height * 0.8;
    p.reload = 0;
}

/**
 * Обновляет позицию камеры
 */
function updateCameraPos(){
    // let pBox = p.getBox();
    // if(pBox.x2 - cameraPos.x > canvas.width*0.65){
    //     cameraPos.x = pBox.x2 - canvas.width*0.65;
    // }
    // if(pBox.x - cameraPos.x < canvas.width*0.35){
    //     cameraPos.x = pBox.x - canvas.width*0.35;
    // }
    // if(pBox.y - cameraPos.y < canvas.height * 0.3){
    //     cameraPos.y = pBox.y - canvas.height * 0.3;
    // }
    // if(pBox.y2 - cameraPos.y > canvas.height * 0.8)
    //     cameraPos.y = pBox.y2 - canvas.height * 0.8;
    if(p.pos.x + DRAWN_SIZE - cameraPos.x > canvas.width*0.65){
        cameraPos.x = p.pos.x + DRAWN_SIZE - canvas.width*0.65;
    }
    if(p.pos.x + DRAWN_SIZE/2 - cameraPos.x < canvas.width*0.35){
        cameraPos.x = p.pos.x + DRAWN_SIZE/2 - canvas.width*0.35;
    }
    if(p.pos.y - cameraPos.y < canvas.height * 0.3){
        cameraPos.y = p.pos.y - canvas.height * 0.3;
    }
    if(p.pos.y + DRAWN_SIZE - cameraPos.y > canvas.height * 0.8)
        cameraPos.y = p.pos.y + DRAWN_SIZE - canvas.height * 0.8;
}

/**
 * обновляет направление игрока
 */
function updatePlayerDir(){
    let angle = Math.atan((mouse.y + cameraPos.y- (p.pos.y + DRAWN_SIZE /2 ))/(mouse.x + cameraPos.x - (p.pos.x + DRAWN_SIZE*3/4)));
    p.handleAngle = angle - Math.PI/2;
    if(mouse.x + cameraPos.x> p.pos.x + DRAWN_SIZE * 3 / 4){
        p.setDirection('right');
    }
    if(mouse.x + cameraPos.x< p.pos.x + DRAWN_SIZE * 3 / 4){
        p.setDirection('left');
        p.handleAngle += Math.PI;
    }
}

document.onkeydown = key_down;
document.onkeyup = key_up;
var keys_pressed = [], up = 0;

document.addEventListener('click', ()=>{
    if(GAME_STATE.end || collisionEntities.indexOf(p) === -1 || p.reload !== 0) return
    let handPos;
    if(p.dir === Directions.right){
        let translatePos = {
            x: p.pos.x + 18*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE/2,
            y: p.pos.y + 24*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*p.gunObj.offset
        };
        handPos = {x: translatePos.x + (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.sin(Math.PI+p.handleAngle), y: translatePos.y + (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.cos(p.handleAngle)};
    }
    if(p.dir === Directions.left){
        let translatePos = {
            x: p.pos.x + (SPRITE_SIZE-18)*DRAWN_SIZE/SPRITE_SIZE,
            y: p.pos.y + 24*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*p.gunObj.offset,
        }
        handPos = {x: translatePos.x - (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.sin(p.handleAngle), y: translatePos.y + (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.cos(p.handleAngle)};
    }
    bullets.push(new Bullet(p.gunObj.bullet, p.gunObj.bulletSpeed, p.gunObj.baseDamage, handPos, {x: mouse.x + cameraPos.x, y: mouse.y + cameraPos.y}, 1, undefined, true, (p.gunObj.bulletSize || 1), p.gunObj.maxDistScale || 1));
    p.reload = p.gunObj.reloadMax;
    p.playShotEffect();
})

function key_down(e) {
    var evtobj = window.event ? window.event : e;
    keys_pressed[evtobj.keyCode] = 1;
}

function key_up(e) {
    var evtobj = window.event ? window.event : e;
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