const JOYSTICK_BOX = {
    x: canvas.width*0.05,
    y: canvas.height*0.6,
    w: canvas.width*.3,
    h: canvas.height*0.4
}, JOYSTICK_POS = {x: (JOYSTICK_BOX.x*2+JOYSTICK_BOX.w)/2};
let isJoystickActive = false;

const JUMP_BTN_BOX = {
    x: canvas.width*0.1,
    y: canvas.height*0.35,
    w: canvas.width*.2,
    h: canvas.height*0.2
}

const ATTACK_JOYSTICK_BOX = {
    x: canvas.width*0.95 - canvas.height*0.5,
    y: canvas.height*0.45,
    w: canvas.height*0.5,
    h: canvas.height*0.5
}, A_J_POS = {
    x: ATTACK_JOYSTICK_BOX.w/2,
    y: ATTACK_JOYSTICK_BOX.h/2
}

let A_J_SIZE = canvas.height * 0.1, isAjActive = false;

window.onresize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    JOYSTICK_BOX.x= canvas.width*0.05,
    JOYSTICK_BOX.y= canvas.height*0.7,
    JOYSTICK_BOX.w= canvas.width*.3,
    JOYSTICK_BOX.h= canvas.height*0.2;
    JUMP_BTN_BOX.x = canvas.width*0.1;
    JUMP_BTN_BOX.y  =canvas.height*0.35;
    JUMP_BTN_BOX.w  =canvas.width*.2;
    JUMP_BTN_BOX.h  =canvas.height*0.2;
    ATTACK_JOYSTICK_BOX.x= canvas.width*0.95 - canvas.height*0.5;
    ATTACK_JOYSTICK_BOX.y= canvas.height*0.45;
    ATTACK_JOYSTICK_BOX.w= canvas.height*0.5;
    ATTACK_JOYSTICK_BOX.h= canvas.height*0.5;
    A_J_SIZE = canvas.height * 0.1;
}

/**
 * 
 * @param {{x: number, y: number, w: number, h: number}} control 
 * @param {{x: number, y: number}} point 
 * @returns {Boolean}
 */
function checkControlCollision(control, point){
    return isInInterval(control.x, point.x, control.x+control.w) && isInInterval(control.y, point.y, control.y+control.h);
}

function updatePlayerDirMobile(){
    let angle = Math.atan2((A_J_POS.x- ATTACK_JOYSTICK_BOX.w/2),((A_J_POS.y - ATTACK_JOYSTICK_BOX.h/2) || 1));
    p.handleAngle = -angle;
    if(A_J_POS.x> ATTACK_JOYSTICK_BOX.w/2){
        p.setDirection('right');
    }
    if(A_J_POS.x< ATTACK_JOYSTICK_BOX.w/2){
        p.setDirection('left');
    }
    if(p.reload===0){
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
        bullets.push(new Bullet(p.gunObj.bullet, p.gunObj.bulletSpeed, p.gunObj.baseDamage, handPos, handPos, 1, -angle + Math.PI/2, true, (p.gunObj.bulletSize || 1), p.gunObj.maxDistScale || 1));
        p.reload = p.gunObj.reloadMax;
        p.playShotEffect();
    }
}

canvas.addEventListener('touchmove', (event)=>{
    if(!isMobile) return
    isJoystickActive=false;
    for(touch of event.touches){
        let point = {x: touch.clientX, y: touch.clientY};
        if(checkControlCollision(JOYSTICK_BOX, point)) {
            JOYSTICK_POS.x = touch.clientX;
            isJoystickActive=true;
        }
        if(checkControlCollision(ATTACK_JOYSTICK_BOX, point)){
            A_J_POS.x = touch.clientX - ATTACK_JOYSTICK_BOX.x;
            A_J_POS.y = touch.clientY - ATTACK_JOYSTICK_BOX.y;
            isAjActive=true;
        }
    }
    if(!isJoystickActive){
        JOYSTICK_POS.x = JOYSTICK_BOX.x + JOYSTICK_BOX.w/2
    }

    }
)

canvas.addEventListener('touchstart', 
    (event) => {
        if(!isMobile) return
        for(touch of event.touches){
            let point = {x: touch.clientX, y: touch.clientY};
            if(checkControlCollision(JOYSTICK_BOX, point)){
                isJoystickActive=true;
                JOYSTICK_POS.x = touch.clientX;
            }
            if(checkControlCollision(JUMP_BTN_BOX, point)){
                p.jump();
            }
            if(checkControlCollision(ATTACK_JOYSTICK_BOX, point)){
                A_J_POS.x = touch.clientX - ATTACK_JOYSTICK_BOX.x;
                A_J_POS.y = touch.clientY - ATTACK_JOYSTICK_BOX.y;
                isAjActive=true;
            }
        }
    }
)

document.addEventListener('touchend', (event) => {
    console.log(event.changedTouches)
    for(touch of event.changedTouches){
        let point = {x: touch.clientX, y: touch.clientY};
        if(checkControlCollision(JOYSTICK_BOX, point)){
            JOYSTICK_POS.x = (JOYSTICK_BOX.x*2+JOYSTICK_BOX.w)/2;
            p.isMove = false;
            isJoystickActive=false;
        }
    }
    // Сбросить значения направления движения
});

function drawAttackJoistick(){
    c.fillStyle='rgba(0,0,0,.5)'
    c.fillRect(ATTACK_JOYSTICK_BOX.x, ATTACK_JOYSTICK_BOX.y, ATTACK_JOYSTICK_BOX.w, ATTACK_JOYSTICK_BOX.h);
    c.fillStyle='rgba(100,100,100,.5)';
    c.fillRect(
        A_J_POS.x + ATTACK_JOYSTICK_BOX.x - A_J_SIZE/2, 
        A_J_POS.y + ATTACK_JOYSTICK_BOX.y - A_J_SIZE/2, 
        A_J_SIZE, 
        A_J_SIZE);
}

function drawJoystick(){
    c.fillStyle='rgba(0,0,0,.5)'
    c.fillRect(JOYSTICK_BOX.x, JOYSTICK_BOX.y, JOYSTICK_BOX.w, JOYSTICK_BOX.h);
    c.fillStyle='rgba(100,100,100,.5)';
    c.fillRect(JOYSTICK_POS.x - JOYSTICK_BOX.w/16 + (JOYSTICK_POS.x - JOYSTICK_BOX.w/16 < JOYSTICK_BOX.x ? JOYSTICK_BOX.w/16: (JOYSTICK_POS.x > JOYSTICK_BOX.w - JOYSTICK_BOX.w/16? -JOYSTICK_BOX.w/16: 0)), JOYSTICK_BOX.y+JOYSTICK_BOX.h*0.1, JOYSTICK_BOX.w/8, JOYSTICK_BOX.h*0.8);
    if(isJoystickActive){
        let scale = (JOYSTICK_POS.x-(JOYSTICK_BOX.x*2+JOYSTICK_BOX.w)/2)/JOYSTICK_BOX.w*4;
        if(scale > 1) scale=1;
        if(scale < -1) scale=-1;
        p.move(scale);
    }
}

function drawJumpBtn(){
    c.fillStyle='rgba(0,0,0,.5)'
    c.fillRect(JUMP_BTN_BOX.x, JUMP_BTN_BOX.y, JUMP_BTN_BOX.w, JUMP_BTN_BOX.h);
    
}

function drawMobileControl(){
    drawJumpBtn();
    drawJoystick();
    drawAttackJoistick();
}