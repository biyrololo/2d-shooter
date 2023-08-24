const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const p = new Entity('Biker', SPAWN_POINT, '1', 1, true);
p.showReload = true;
p.health = 300;
p.maxHealth = 300;
// const ent = new Entity('Biker', {x: 1000, y: 200})
// ent.setDirection('left');

const crosshair = new Image();
crosshair.src = `images/Crosshair.png`;

function animate(){
    c.fillStyle='gray';
    c.fillRect(0, 0, canvas.width, canvas.height);
    updateCameraPos();
    c.drawImage(map, 0, 0, map.width, map.height, -cameraPos.x, -cameraPos.y, MAP_DRAWN_WIDTH, map.height / map.width * MAP_DRAWN_WIDTH);
    CHECKPOINTS_BLOCKS.forEach(checkpoint=>{
        checkpoint.update();
    })
    drops.forEach(d=>{
        d.update();
    })
    // c.fillStyle = 'green';
    // c.fillRect(canvas.width*0.35, canvas.height*0.3, canvas.width*0.3, canvas.height*0.5)
    updatePlayerDir();
    updateBullets();
    collisionEntities.forEach(e=>e.update())
    drawCrosshair();
    ckeckIsPlayerDie();
    // c.fillStyle = 'green';
    // c.fillRect(-cameraPos.x + p.pos.x + DRAWN_SIZE*3/4, -cameraPos.y + p.pos.y, 10, 200)
    // if(p.compateDirection('left')){
    //     let handPos = {x: p.pos.x + (SPRITE_SIZE-36)*DRAWN_SIZE/SPRITE_SIZE + 18*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*3*Math.sin(Math.PI+p.handleAngle), y: p.pos.y + 24*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*3*Math.cos(p.handleAngle)};
    //     c.fillRect(handPos.x - 5 - cameraPos.x,handPos.y - cameraPos.y - 5, 10, 10)
    // }
    // // c.fillStyle = 'red'
    // COLLISION_BLOCKS.forEach(block=>{
    //     c.fillRect(block.x*TILE_SIZE - cameraPos.x, block.y*TILE_SIZE - cameraPos.y, 1*TILE_SIZE, 1*TILE_SIZE);
    // })
    // entitiesCollision(p);
    requestAnimationFrame(animate);
}

animate();
startGame();

function spawnEnemies(){
    ENEMY_SPAWN_BLOCKS.forEach(block=>{
        new Entity('Biker', {x: block.x*TILE_SIZE - DRAWN_SIZE/2, y: block.y*TILE_SIZE-DRAWN_SIZE}, '1', 2, true)
    })
}

function drawCrosshair(size = 50 * GLOBAS_SCALE){
    c.drawImage(crosshair, 0, 0, crosshair.width, crosshair.height, mouse.x - size/2, mouse.y - size/2, size, size);
}