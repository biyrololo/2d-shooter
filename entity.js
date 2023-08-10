"use strict"

const 
SPRITE_SIZE = 48,
ANIM_RATE = 4,
IMAGES_SRC = 'images/1 Characters/',
DRAWN_SIZE = 100,
DEGREES2RADIANS = Math.PI/180,
HAND_SIZE = 11.5,
GRAVITY = 10
;
// 16, 23
const States = {
    idle: 'idle',
    run: 'run',
    walk: 'walk',
    jump: 'jump'
},
Directions = {
    right: 1,
    left: -1
}
class Entity{
    /**
     * 
     * @param {String} charName character name; имя entity
     * @param {{x: number, y: number}} startPos start pos; стартовая позиция
     * @param {String} [gun='1'] gun name; название оружия
     * @param {number} [team=2] team: 1 - player, 2 - enemies; команда: 1 - игрок, 2 - противники
     */
    constructor(charName, startPos = {x: 0, y: 200}, gun = '1', team = 2){
        this.weight = 1;
        this.jumpVelocity = 150;
        this.jumpDuration = {cur: 0, max: 12};
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.gun = new Image();
        this.gun.src = `images/2 Guns/${gun}_1.png`;
        this.gunLeft = new Image();
        this.gunLeft.src = `images/2 Guns/${gun}_1Left.png`;
        this.dir = Directions.right;
        this.charName = charName;
        this.images = {};
        this.images.idle = new Image();
        this.images.idle.src = `${IMAGES_SRC}${charName}/Idle1.png`;
        this.images.jump = new Image();
        this.images.jump.src = `${IMAGES_SRC}${charName}/Jump1.png`;
        this.images.run = new Image();
        this.images.run.src = `${IMAGES_SRC}${charName}/Run1.png`;
        this.images.walk = new Image();
        this.images.walk.src = `${IMAGES_SRC}${charName}/Walk1.png`;
        this.imagesLeft = {};
        this.imagesLeft.idle = new Image();
        this.imagesLeft.idle.src = `${IMAGES_SRC}${charName}/Idle1Left.png`;
        this.imagesLeft.jump = new Image();
        this.imagesLeft.jump.src = `${IMAGES_SRC}${charName}/Jump1Left.png`;
        this.imagesLeft.run = new Image();
        this.imagesLeft.run.src = `${IMAGES_SRC}${charName}/Run1Left.png`;
        this.imagesLeft.walk = new Image();
        this.imagesLeft.walk.src = `${IMAGES_SRC}${charName}/Walk1Left.png`;
        this.pos = startPos;
        this.state = States.idle;
        this.curFrame = 0;
        this.counter = {cur: 0, fq: 5};
        this.speed = 4;
        this.impulse = 0;
        this.isMove = false;
        this.handleAngle = 0;
        this.hand = new Image();
        this.hand.src =  `${IMAGES_SRC}${charName}/Hand.png`;
        this.handRight = new Image();
        this.handRight.src =  `${IMAGES_SRC}${charName}/HandRight.png`;
        this.team = team;
        collisionEntities.push(this);
        this.isJump = false;
        this.isOnFloor = true;
    }

    draw(){
        this.state = States.idle;
        if(this.isMove) this.state = States.walk;
        if(this.isJump) this.state = States.jump;
        
        let translatePos = {};
        if(this.dir === Directions.right){
        translatePos = {
            x: this.pos.x + 18*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE/2,
            y: this.pos.y + 26*DRAWN_SIZE/SPRITE_SIZE
        };
    }
        else{
            translatePos = {
                x: this.pos.x + (SPRITE_SIZE-18)*DRAWN_SIZE/SPRITE_SIZE,
                y: this.pos.y + 26*DRAWN_SIZE/SPRITE_SIZE,
            };
            
        }
        // translatePos = {
        //     x: this.pos.x + DRAWN_SIZE/2,
        //     y: this.pos.y + DRAWN_SIZE/2
        // };
        c.translate(translatePos.x ,translatePos.y);
        c.rotate(this.handleAngle);
        c.fillStyle ='red';
        // c.fillRect(-5, 0, 10, 70);
        if(this.dir === Directions.right){
            c.drawImage(this.gun, 0, 0, this.gun.width, this.gun.height, -HAND_SIZE/2 + 2, HAND_SIZE+HAND_SIZE, HAND_SIZE, this.gun.height / this.gun.width * HAND_SIZE);
            c.drawImage(this.hand, 0, 0, this.hand.width, this.hand.height, -HAND_SIZE/2, 0, HAND_SIZE, this.hand.height / this.hand.width * HAND_SIZE);
        }
        else{
            c.drawImage(this.gunLeft, 0, 0, this.gun.width, this.gun.height, -HAND_SIZE/2 - 2, HAND_SIZE+HAND_SIZE, HAND_SIZE, this.gun.height / this.gun.width * HAND_SIZE);
            c.drawImage(this.handRight, 0, 0, this.hand.width, this.hand.height, -HAND_SIZE/2, 0, HAND_SIZE, this.hand.height / this.hand.width * HAND_SIZE);
            
        }
        c.rotate(-this.handleAngle)
        c.translate(-translatePos.x, -translatePos.y);
        c.fillStyle= 'brown';
        c.fillRect(this.pos.x+DRAWN_SIZE/2, this.pos.y, DRAWN_SIZE/2, OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/3);
        c.fillStyle= 'red';
        c.fillRect(this.pos.x+DRAWN_SIZE/2, this.pos.y, DRAWN_SIZE/2 * (this.health > 0?this.health / this.maxHealth : 0), OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/3);
        
        if(this.dir === Directions.right){
            c.drawImage(this.images[this.state], (this.isJump? 0: this.curFrame) * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, this.pos.x + DRAWN_SIZE/2, this.pos.y, DRAWN_SIZE, DRAWN_SIZE);
        }
        else{
            c.drawImage(this.imagesLeft[this.state], (3 - this.curFrame) * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, this.pos.x + DRAWN_SIZE*0/2, this.pos.y, DRAWN_SIZE, DRAWN_SIZE);
        }
    }

    /**
     * Updates the entity (every frame)
     * Обновляет entity (каждый кадр)
     */
    update(){
        if(this.isJump){
            this._doingJump();
        }
        this.gravity();
        this.draw();
        this.updateAnim();
    }

    updateAnim(){
        this.counter.cur++;
        if(this.counter.cur % this.counter.fq === 0){
            this.curFrame++;
            if(this.curFrame > 3) this.curFrame = 0;
        }
    }

    /**
     * Move entity in cur dir on x*speed
     * Двигает entity в текущем направлении на x*speed
     * @param {number} x speed factor; множитель скорости
     */
    move(x = 0){
        this.pos.x+=x*this.speed;
        if(entitiesCollision(this)){
            this.pos.x-=x*this.speed;
        }
        this.isMove = true;
    }

    /**
     * Returns the entiti's current box
     * Вовращает текущий бокс entity
     * @returns {{x: number, y: number, x1: number, y1: number}} x - left, y - top, x1 - right, y1 - bottom of Box
     */
    getBox(){
        let thisBox = {x: 0, y: 0, x2: 0, y2: 0};
        if(this.dir === Directions.right){
            thisBox.x = this.pos.x + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE;
            thisBox.y = this.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE;
            thisBox.x2 = this.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE;
            thisBox.y2 = this.pos.y + DRAWN_SIZE;
        }
        else{
            thisBox.x = this.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE;
            thisBox.y = this.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE;
            thisBox.x2 = this.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE;
            thisBox.y2 = this.pos.y+ DRAWN_SIZE;
        }
        return thisBox;
    }

    /**
     * handles gravity
     * Обрабатывает гравитацию
     */
    gravity(){
        if(this.pos.y < 200){
            this.isOnFloor = false;
            if(!this.isJump)
                this.pos.y+=GRAVITY*this.weight;
            if(this.pos.y > 200){
                this.pos.y = 200;
            }
        }
        else{
            this.isOnFloor=true;
        }
    }

    _doingJump(){
        this.pos.y -= this.jumpVelocity / this.jumpDuration.max;
        this.jumpDuration.cur++;
        if(this.jumpDuration.cur >= this.jumpDuration.max){
            this.isJump = false;
        }
    }

    /**
     * Checks if a jump is possible, and if possible, then jumps
     * Проверяет, возможен ли прыжок, и если возможен, то прыгает
     */
    jump(){
        if(this.isOnFloor){
            // this.pos.y -= 100;
            this.isJump = true;
            this.jumpDuration.cur = 0;
        }
    }
}