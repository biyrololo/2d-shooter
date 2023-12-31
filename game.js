const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
document.querySelector('button').onclick=firstStart;
var isPause = false;
window.addEventListener('blur', () => {
  isPause = true;
})
window.addEventListener('focus', () => {
  isPause = false;
})

const setHdButton = document.querySelector('#set-hd');

setHdButton.addEventListener('click', ()=>{
  isHdTextures = !isHdTextures;
  setHdButton.setAttribute('data-hd', isHdTextures?'true':'false')
})

function openFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Для Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Для Chrome, Safari и Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // Для Internet Explorer и Edge
      element.msRequestFullscreen();
    }
  }

canvas.addEventListener('click', () => {
openFullscreen(canvas);
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const p = new Entity('Punk', SPAWN_POINT, '1', 1, true, 200);
p.showReload = true;
// const ent = new Entity('Biker', {x: 1000, y: 200})
// ent.setDirection('left');

const crosshair = new Image(), crosshairJump = new Image();
crosshair.src = `images/Crosshair.png`;
crosshairJump.src = `images/CrosshairJump.png`;

const background = new Image();
background.src = `images/BG.png`;

const distantBg = new Image();
distantBg.src = `images/distantBg.png`;

const veryDistantBg = new Image();
veryDistantBg.src = `images/veryDistantBg.png`;

const backgroundFog = new Image();
backgroundFog.src = `images/Frontal Fog.png`;

const sunImg = new Image();
sunImg.src = `images/sun.png`;

let prevTime = -1;

function animate(){
  if(prevTime === -1) {prevTime = performance.now() - 0.01; isPause = true}
  else isPause = false;
  const currentTime = performance.now();
  const deltaTime = (currentTime - prevTime)/1000;
  if(GAME_STATE === GAME_STATES.game && !isPause) renderGame(deltaTime);
  prevTime = currentTime;
  requestAnimationFrame(animate);
}

/**
 * Проверяет, попадает ли объект в камере по позиции
 * @param {{x: number, y: number}} pos
 * @returns 
 */
function isInScreen(pos = {x: 0, y: 0}){
  return Math.pow(pos.x - p.pos.x, 2) + Math.pow(pos.y - p.pos.y, 2) <= canvas.width*canvas.width
}

function renderGame(deltaTime){
  c.fillStyle='gray';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
  c.drawImage(veryDistantBg, 0, 0, veryDistantBg.width, veryDistantBg.height, -cameraPos.x/20,-cameraPos.y/20-canvas.height/3, MAP_DRAWN_WIDTH/3, veryDistantBg.height / veryDistantBg.width * MAP_DRAWN_WIDTH/3);
  c.drawImage(sunImg, 0, 0, sunImg.width, sunImg.height, cameraPos.x/15 + MAP_DRAWN_WIDTH/2 - cameraPos.x, cameraPos.y/15 - cameraPos.y, MAP_DRAWN_WIDTH/30, sunImg.height / sunImg.width * MAP_DRAWN_WIDTH/30);
  c.drawImage(distantBg, 0, 0, distantBg.width, distantBg.height, -cameraPos.x/4,-cameraPos.y/4, MAP_DRAWN_WIDTH, distantBg.height / distantBg.width * MAP_DRAWN_WIDTH)
  c.drawImage(backgroundFog, 0, 0, backgroundFog.width, backgroundFog.height, 0, canvas.height*0.7, canvas.width, canvas.height*0.3);
  updateCameraPos();
  c.drawImage(map, 0, 0, map.width, map.height, -cameraPos.x, -cameraPos.y - 48 * TILE_SIZE, MAP_DRAWN_WIDTH, map.height / map.width * MAP_DRAWN_WIDTH);

  CHECKPOINTS_BLOCKS.forEach(checkpoint=>{
    if(isInScreen(checkpoint.pos))
      checkpoint.update();
  })
  drops.forEach(d=>{
  if(isInScreen(d.pos))
      d.update();
  })
  // c.fillStyle = 'green';
  // c.fillRect(canvas.width*0.35, canvas.height*0.3, canvas.width*0.3, canvas.height*0.5)
  if(isMobile) updatePlayerDirMobile();
  else updatePlayerDir();
  updateBullets(deltaTime);
  // let box = p.getBox();
  // c.fillStyle = 'green';
  // c.fillRect(box.x - cameraPos.x ,box.y - cameraPos.y, box.x2-box.x, box.y2 - box.y);
  collisionEntities.forEach(e=>{if(isInScreen(e.pos)) 
    {
      e.update(deltaTime);
    }
  })
  BLOOD_EFFECTS.forEach(e=>e.draw(deltaTime))
  if(isMobile) drawMobileControl();
  else drawCrosshair();
  ckeckIsPlayerDie();
  // let translatePos = {
  //     x: p.pos.x + (SPRITE_SIZE-18)*DRAWN_SIZE/SPRITE_SIZE,
  //     y: p.pos.y + 24*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*p.gunObj.offset,
  // };
  // let handPos = {x: translatePos.x - (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.sin(p.handleAngle), y: translatePos.y + (p.hand.height / p.hand.width * HAND_SIZE+p.gun.height / p.gun.width * HAND_SIZE - HAND_SIZE)*Math.cos(p.handleAngle)};
  // c.fillStyle = 'green';
  // c.fillRect(handPos.x - cameraPos.x - 5, handPos.y - cameraPos.y - 5, 10, 10)
  // c.fillStyle = 'green';
  // c.fillRect(-cameraPos.x + p.pos.x + DRAWN_SIZE*3/4, -cameraPos.y + p.pos.y, 10, 200)
  // if(p.compateDirection('left')){
  //     let handPos = {x: p.pos.x + (SPRITE_SIZE-36)*DRAWN_SIZE/SPRITE_SIZE + 18*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*3*Math.sin(Math.PI+p.handleAngle), y: p.pos.y + 24*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*3*Math.cos(p.handleAngle)};
  //     c.fillRect(handPos.x - 5 - cameraPos.x,handPos.y - cameraPos.y - 5, 10, 10)
  // }
  // c.fillStyle = 'red'
  // COLLISION_BLOCKS.forEach(block=>{
  //     c.fillRect(block.x*TILE_SIZE - cameraPos.x, block.y*TILE_SIZE - cameraPos.y, 1*TILE_SIZE, 1*TILE_SIZE);
  // })
  // entitiesCollision(p);
}

// animate();
// startGame();

function spawnEnemies(){
    ENEMY_SPAWN_BLOCKS.forEach(block=>{
        let gun = Object.keys(GUNS)[block.type * 2 + (Math.random()>=0.5?1:0)];
        let skin = 'Biker';
        if(Math.random() > 0.5) skin='Cyborg';
        let shield = false;
        if(block.type >= 3 && Math.random() > 0.7) shield = true;
        // console.log(gun, block.type)
        new Entity(
            skin,  //sprite name
            {x: block.x*TILE_SIZE - DRAWN_SIZE/2, y: block.y*TILE_SIZE-DRAWN_SIZE}, //spawn pos
            gun, //gun name
            2, //team
            isHdTextures, //hd 
            70+50*block.type, //макс хп
            shield //щит
        )
    })
    FOLLOWING_ENEMIES_SPAWN_BLOCKS.forEach(block=>{
      let gun = Object.keys(GUNS)[block.type * 2 + (Math.random()>=0.5?1:0)];
      let skin = 'Biker';
      if(Math.random() > 0.5) skin='Cyborg';
      let shield = false;
      if(block.type >= 3 && Math.random() > 0.7) shield = true;
      // console.log(gun, block.type)
      new Entity(
          skin,  //sprite name
          {x: block.x*TILE_SIZE - DRAWN_SIZE/2, y: block.y*TILE_SIZE-DRAWN_SIZE}, //spawn pos
          gun, //gun name
          2, //team
          isHdTextures, //hd 
          70+50*block.type, //макс хп
          shield, //щит,
          true
      )
  })
}

function drawCrosshair(size = 50 * GLOBAS_SCALE){
    c.drawImage(p.isOnFloor?crosshair:crosshairJump, 0, 0, crosshair.width, crosshair.height, mouse.x - size/2, mouse.y - size/2, size, size);
}
