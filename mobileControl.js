const JOYSTICK_BOX = {
    x: canvas.width*0.05,
    y: canvas.height*0.6,
    w: canvas.width*.3,
    h: canvas.height*0.4
}, JOYSTICK_POS = {x: (JOYSTICK_BOX.x*2+JOYSTICK_BOX.w)/2};
let isJoystickActive = false;

const JUMP_BTN_BOX = {
    x: canvas.width*0.75,
    y: canvas.height*0.7,
    w: canvas.width*.2,
    h: canvas.height*0.2

}

canvas.addEventListener('touchmove', (event)=>{
    if(!isMobile) return
    for(touch of event.touches){
        if(isInInterval(JOYSTICK_BOX.x, touch.clientX, JOYSTICK_BOX.x+JOYSTICK_BOX.w) && isInInterval(JOYSTICK_BOX.y, touch.clientY, JOYSTICK_BOX.y+JOYSTICK_BOX.h)) {
            JOYSTICK_POS.x = touch.clientX;
            isJoystickActive=true;
        }
    }
    }
)

canvas.addEventListener('touchstart', 
    (event) => {
        if(!isMobile) return
        for(touch of event.touches){
            if((isInInterval(JOYSTICK_BOX.x, touch.clientX, JOYSTICK_BOX.x+JOYSTICK_BOX.w) && isInInterval(JOYSTICK_BOX.y, touch.clientY, JOYSTICK_BOX.y+JOYSTICK_BOX.h))){
                isJoystickActive=true;
                JOYSTICK_POS.x = touch.clientX;
            }
            if((isInInterval(JUMP_BTN_BOX.x, touch.clientX, JUMP_BTN_BOX.x+JUMP_BTN_BOX.w) && isInInterval(JUMP_BTN_BOX.y, touch.clientY, JUMP_BTN_BOX.y+JUMP_BTN_BOX.h))){
                p.jump();
            }
        }
    }
)

document.addEventListener('touchend', (event) => {
    console.log(event.changedTouches)
    for(touch of event.changedTouches){
        if((isInInterval(JOYSTICK_BOX.x, touch.clientX, JOYSTICK_BOX.x+JOYSTICK_BOX.w) && isInInterval(JOYSTICK_BOX.y, touch.clientY, JOYSTICK_BOX.y+JOYSTICK_BOX.h))){
            JOYSTICK_POS.x = (JOYSTICK_BOX.x*2+JOYSTICK_BOX.w)/2;
            p.isMove = false;
            isJoystickActive=false;
        }
    }
    // Сбросить значения направления движения
});

function drawJoystick(){
    c.fillStyle='rgba(0,0,0,.5)'
    c.fillRect(JOYSTICK_BOX.x, JOYSTICK_BOX.y, JOYSTICK_BOX.w, JOYSTICK_BOX.h);
    c.fillStyle='rgba(100,100,100,.5)';
    c.fillRect(JOYSTICK_POS.x - JOYSTICK_BOX.w/16 + (JOYSTICK_POS.x - JOYSTICK_BOX.w/16 < JOYSTICK_BOX.x ? JOYSTICK_BOX.w/16: (JOYSTICK_POS.x > JOYSTICK_BOX.w - JOYSTICK_BOX.w/16? -JOYSTICK_BOX.w/16: 0)), JOYSTICK_BOX.y+JOYSTICK_BOX.h*0.1, JOYSTICK_BOX.w/8, JOYSTICK_BOX.h*0.8);
    if(isJoystickActive)
    p.move((JOYSTICK_POS.x-(JOYSTICK_BOX.x*2+JOYSTICK_BOX.w)/2)/JOYSTICK_BOX.w*2);
}

function drawJumpBtn(){
    c.fillStyle='rgba(0,0,0,.5)'
    c.fillRect(JUMP_BTN_BOX.x, JUMP_BTN_BOX.y, JUMP_BTN_BOX.w, JUMP_BTN_BOX.h);
    
}

function drawMobileControl(){
    drawJumpBtn();
    drawJoystick();
}