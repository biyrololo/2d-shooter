const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const p = new Entity('Biker', {x: 50, y: 200}, '1', 1);
const ent = new Entity('Biker')
ent.dir = Directions.left;

const crosshair = new Image();
crosshair.src = `images/Crosshair.png`

const mouse = {x: 0, y: 0};

function animate(){
    requestAnimationFrame(animate);
    c.fillStyle='gray';
    c.fillRect(0, 0, canvas.width, canvas.height);
    updatePlayerDir();
    updateBullets();
    collisionEntities.forEach(e=>e.update())
    drawCrosshair();
    // entitiesCollision(p);
}

animate();

function drawCrosshair(size = 50){
    c.drawImage(crosshair, 0, 0, crosshair.width, crosshair.height, mouse.x - size/2, mouse.y - size/2, size, size);
}

function setMouse(event){
    event =event || window.event;
    mouse.x = event.clientX;
    mouse.y = event.clientY;

}

window.onmousemove = setMouse;

function updatePlayerDir(){
    let angle = Math.atan((mouse.y - (p.pos.y + DRAWN_SIZE /2))/(mouse.x - (p.pos.x + DRAWN_SIZE/2)));
    p.handleAngle = angle - Math.PI/2;
    if(mouse.x > p.pos.x + DRAWN_SIZE / 2){
        p.dir = Directions.right;
    }
    if(mouse.x < p.pos.x + DRAWN_SIZE / 2){
        p.dir = Directions.left;
        p.handleAngle += Math.PI;
    }
}

document.onkeydown = key_down;
document.onkeyup = key_up;
var keys_pressed = [], up = 0;

document.addEventListener('click', ()=>{
    if(p.dir === Directions.right)
        bullets.push(new Bullet('3', {x: p.pos.x+DRAWN_SIZE/2 + 18*DRAWN_SIZE/SPRITE_SIZE, y: p.pos.y + 26*DRAWN_SIZE/SPRITE_SIZE}, mouse, 1));
    if(p.dir === Directions.left)
        bullets.push(new Bullet('3', {x: p.pos.x + (SPRITE_SIZE-26)*DRAWN_SIZE/SPRITE_SIZE + 18*DRAWN_SIZE/SPRITE_SIZE, y: p.pos.y + 26*DRAWN_SIZE/SPRITE_SIZE}, mouse, 1));
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