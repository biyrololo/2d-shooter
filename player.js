const mouse = {x: 0, y: 0};
const PLAYER_BOOSTS = {
    speed: 1.2,
    damage: 1.4,
    speedTime: {cur: 20, max: 200},
    damageTime: {cur: 20, max: 200},
    shieldTime: {cur: 0, max: 400},
    speedColors: {color: '#59B635', bg: 'rgba(89, 182, 53, .5)'},
    damageColors: {color: '#B63597', bg: 'rgba(182, 53, 151, .5)'},
    shieldColors: {color: '#00A7FF', bg: 'rgba(0, 55, 255, .5)'},
    allBoosts: ['damage', 'speed', 'shield']
};

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

let firstStartDid = false;

function firstStart(){
    if(firstStartDid) return
    firstStartDid = true;
    document.body.style.cursor = 'none';
    // startGame();
    document.querySelector('#loading').setAttribute('data-show', 'true');
    sourcesCommon.forEach((s, i)=>{
        let img = new Image();
        img.onload = ()=>{
            document.querySelector('#loading > div').style=`--s: ${Math.floor(i*100/sourcesCommon.length/3)}%`;
            document.querySelector('#loading > a').textContent = `images/${s}`;
        }
        img.src = `images/${s}`;
    })
    if(isHdTextures){
        sourcesHD.forEach((s, i)=>{
            let img = new Image();
            
            img.onload = ()=>{
                document.querySelector('#loading > div').style=`--s: ${Math.floor(i*100/sourcesHD.length/2+100/3)}%`;
                document.querySelector('#loading > a').textContent = `images/${s}`;
            }
            img.src = `images/${s}`;
        })
    }
    if(!isHdTextures){
        sourcesNonHd.forEach((s, i)=>{
            let img = new Image();
            
            img.onload = ()=>{
                document.querySelector('#loading > div').style=`--s: ${Math.floor(i*100/sourcesNonHd.length/2+100/3)}%`;
                document.querySelector('#loading > a').textContent = `images/${s}`;
            }
            img.src = `images/${s}`;
        })
    }
    document.querySelector('#loading > a').textContent = `images/mapNew${isHdTextures?'':'Low'}.png`;
    map.src = `images/map${isHdTextures?'2x':'1x'}.png`;
    map.onload = () => {
        document.querySelector('#loading > div').style=`--s: 100%`;
        MAP_DRAWN_WIDTH = map.width / 96 * DRAWN_SIZE/5 * 1.5 * 1.5 * (isHdTextures?2:4);
        GAME_STATE = GAME_STATES.game;
        startGame();
        animate();
        document.querySelector('#menu').setAttribute('data-hide', 'true');
    };
    if (map.complete && map.naturalWidth !== 0) {
        // Карта уже была загружена до установки onload
        map.onload();
    }
}

function startGame(){
    // openFullscreen(canvas);
    p.health = p.maxHealth;
    BLOOD_EFFECTS.splice(0, BLOOD_EFFECTS.length);
    collisionEntities.splice(0, collisionEntities.length);
    p.setPos(SPAWN_POINT);
    collisionEntities.push(p);
    spawnEnemies();
    drops.splice(0, drops.length);
    DROP_BLOCKS.forEach(d=>{
        if(d.dropType === 'gun')
            new Drop({x: d.x * TILE_SIZE, y: d.y * TILE_SIZE}, 'gun', String(d.type === 1? 2: (d.type*2 + Math.floor(Math.random()*2))));
        if(d.dropType === 'speed')
            new Drop({x: d.x * TILE_SIZE, y: d.y * TILE_SIZE}, 'speed');
        if(d.dropType === 'damage')
            new Drop({x: d.x * TILE_SIZE, y: d.y * TILE_SIZE}, 'damage');
    })
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
    if(GAME_STATE.end || collisionEntities.indexOf(p) === -1 || p.reload !== 0 || isMobile) return
    let handPos;
    if(p.dir === Directions.right){
        let translatePos = {
            x: p.pos.x + HAND_POSES[p.charName].x*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE/2,
            y: p.pos.y + (HAND_POSES[p.charName].y-2)*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*p.gunObj.offset
        };
        handPos = {x: translatePos.x + (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.sin(Math.PI+p.handleAngle), y: translatePos.y + (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.cos(p.handleAngle)};
    }
    if(p.dir === Directions.left){
        let translatePos = {
            x: p.pos.x + (SPRITE_SIZE-HAND_POSES[p.charName].x)*DRAWN_SIZE/SPRITE_SIZE,
            y: p.pos.y + (HAND_POSES[p.charName].y-2)*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*p.gunObj.offset,
        }
        handPos = {x: translatePos.x - (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.sin(p.handleAngle), y: translatePos.y + (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.cos(p.handleAngle)};
    }
    bullets.push(new Bullet(p.gunObj.bullet, p.gunObj.bulletSpeed, p.gunObj.baseDamage * PLAYER_BOOSTS.damage, handPos, {x: mouse.x + cameraPos.x, y: mouse.y + cameraPos.y}, 1, undefined, true, (p.gunObj.bulletSize || 1), p.gunObj.maxDistScale || 1));
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