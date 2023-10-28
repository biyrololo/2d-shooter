"use strict"

const 
SPRITE_SIZE = 48, //48 - 264
ANIM_RATE = 4,
IMAGES_SRC = 'images/1 Characters/',
DEGREES2RADIANS = Math.PI/180,
HAND_SIZE = 11.5 * GLOBAS_SCALE * 1.5,
GRAVITY = 10 * GLOBAS_SCALE
;
// 16, 23

const HAND_POSES = {
    'Biker':{
        x: 18,
        y: 26
    },
    'Cyborg':{
        x: 16,
        y: 24
    },
    'Punk':{
        x: 16,
        y: 27,
        jumpY: 23
    }
}

const States = {
    idle: 'idle',
    run: 'run',
    walk: 'walk',
    jump: 'jump'
},
AnimFramesPatterns = {
    default: {
        min: 0, max: 4
    },
    jump: {
        min: 0, max: 1
    },
    fall: {
        min: 2, max: 3
    },
    walk: {
        min: 0, max: 5
    }
},
Directions = {
    right: 1,
    left: -1
},
AI_BOX = {
    width: DRAWN_SIZE*5,
    height: DRAWN_SIZE*2
},
AI_WALK_STATES = {
    stay: 1,
    walk: 2
}
,
AI_MIN_DIST = DRAWN_SIZE*2,
AI_MAX_DIST = DRAWN_SIZE * 6;

class Entity{
    /**
     * 
     * @param {'Biker' | 'Cyborg' | 'Punk'} charName character name; имя entity
     * @param {{x: number, y: number}} startPos start pos; стартовая позиция
     * @param {String} [gun='1'] gun name; название оружия
     * @param {1 | 2} [team=2] team: 1 - player, 2 - enemies; команда: 1 - игрок, 2 - противники
     * @param {Boolean} HD HD текстуры
     * @param {number} maxHealth макс хп
     * @param {Boolean} isShield есть ли щит
     */
    constructor(charName, startPos = {x: -500, y: -500}, gun = '1', team = 2, HD = false, maxHealth = 100, isShield = false){
        this.gunName = gun;
        this.baseHealth = maxHealth;
        let hd = HD?'HD':'';
        this.spriteScale = HD ? 5.5: 1;
        this.startPos = structuredClone(startPos);
        this.weight = 1;
        this.jumpVelocity = DRAWN_SIZE * 2;
        this.jumpDuration = {cur: 0, max: 12};
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        if(team === 2 && isShield) {this.health*=1.5;}
        /**
         * щит
         */
        this.shield = new Image();
        this.shield.src = `images/shield.png`;
        /**
         * Анимация щита
         */
        this.shieldAnim = {
            isActive: isShield,
            value: 0,
            max: 50
        }
        /**
         * 
         * @type {{src: {right: string, left: string}, srcHD: {right: string, left: string}, reloadMax: number, baseDamage: number, bullet: string, shotEffect: string, bulletSpeed: number, offset: number, maxDistScale?: number, bulletSize?: number}}
         */
        this.gunObj = structuredClone(getGun(this.gunName));
        this.reload = 0;
        this.gun = new Image();
        this.gun.src = `images/2 Guns/${this.gunObj.srcHD.right}`;
        this.gunLeft = new Image();
        this.gunLeft.src = `images/2 Guns/${this.gunObj.srcHD.left}`;
        this.dir = Directions.right;
        if(team === 2){
            this.dir = Math.random() > 0.5? Directions.right : Directions.left;
            this.gunObj.reloadMax = this.gunObj.reloadMax*2;
        }
        this.charName = charName;
        this.images = {};
        this.images.idle = new Image();
        this.images.idle.src = `${IMAGES_SRC}${charName}/Idle1${hd}.png`;
        this.images.jump = new Image();
        this.images.jump.src = `${IMAGES_SRC}${charName}/Jump1${hd}.png`;
        // this.images.run = new Image();
        // this.images.run.src = `${IMAGES_SRC}${charName}/Run1${hd}.png`;
        this.images.walk = new Image();
        this.images.walk.src = `${IMAGES_SRC}${charName}/Walk1${hd}.png`;
        this.imagesLeft = {};
        this.imagesLeft.idle = new Image();
        this.imagesLeft.idle.src = `${IMAGES_SRC}${charName}/Idle1Left${hd}.png`;
        this.imagesLeft.jump = new Image();
        this.imagesLeft.jump.src = `${IMAGES_SRC}${charName}/Jump1Left${hd}.png`;
        // this.imagesLeft.run = new Image();
        // this.imagesLeft.run.src = `${IMAGES_SRC}${charName}/Run1Left${hd}.png`;
        this.imagesLeft.walk = new Image();
        this.imagesLeft.walk.src = `${IMAGES_SRC}${charName}/Walk1Left${hd}.png`;
        // if(team === 1){
        //     this.images.walk.src = `${IMAGES_SRC}${charName}/Run1${hd}.png`;
        //     this.imagesLeft.walk.src = `${IMAGES_SRC}${charName}/Run1Left${hd}.png`;
        // }
        this.pos = {x: -500, y: -500};
        this.setPos(startPos);
        this.state = States.idle;
        this.curFrame = 0;
        this.counter = {cur: 0, fq: 5};
        this.speed = 10;
        this.impulse = 0;
        this.isMove = false;
        this.animFramesPattern = AnimFramesPatterns.default;
        this.handleAngle = 0;
        this.hand = new Image();
        this.hand.src =  `${IMAGES_SRC}${charName}/Hand${hd}.png`;
        this.handRight = new Image();
        this.handRight.src =  `${IMAGES_SRC}${charName}/HandRight${hd}.png`;
        this.team = team;
        this.isJump = false;
        this.isOnFloor = true;
        this.attacked = false;
        this.AI_WALK = {
            time: {cur: 0, mTime: 200 + Math.floor(Math.random()*50)},
            state: AI_WALK_STATES.walk,
            dir: Directions.left
        }
        collisionEntities.push(this);
        this.shotEffect = new Image();
        this.shotEffect.src = `images/4 Shoot_effects/${this.gunObj.shotEffect}.png`;
        this.shotEffectFrame = {
            curFrame: 0,
            max: Math.floor(this.shotEffect.width/this.shotEffect.height)-1,
            play: false
        }
        this.followPlayer = {
            state: false,
            time: 0,
            step: 5,
        }
        this.showReload = false;
        this.shieldHitAnimFrams = {
            isActive: false,
            max: 10,
            value: 10
        }
    }

    /**
     * 
     * @param {'default' | 'jump' | 'fall' | 'walk'} pattern 
     */
    _setAnimFramesPattern(pattern = "default"){
        this.animFramesPattern = AnimFramesPatterns[pattern] || AnimFramesPatterns.default;
        if(this.curFrame < this.animFramesPattern.min || this.curFrame >= this.animFramesPattern.max) this.curFrame = this.animFramesPattern.min;
    }

    /**
     * Задать позицию
     * @param {{x: number, y: number}} newPos 
     */
    setPos(newPos){
        this.pos = structuredClone(newPos);
    }
    
    draw(){
        this._setAnimFramesPattern();
        this.state = States.idle;
        if(this.isMove) {this.state = States.walk; this._setAnimFramesPattern('walk');}
        if(this.isJump) {
            this.state = States.jump; this._setAnimFramesPattern('jump');
        }
        if(!this.isJump && !this.isOnFloor) {
            this.state = States.jump; this._setAnimFramesPattern('fall');
        }
        
        let translatePos = {}, handY = this.isOnFloor?HAND_POSES[this.charName].y:HAND_POSES[this.charName].jumpY;;
        if(this.dir === Directions.right){
            translatePos = {
                x: this.pos.x + (HAND_POSES[this.charName].x)*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE/2 - cameraPos.x,
                y: this.pos.y + handY*DRAWN_SIZE/SPRITE_SIZE - cameraPos.y
            };
        }
        else{
            translatePos = {
                x: this.pos.x + (SPRITE_SIZE-(HAND_POSES[this.charName].x))*DRAWN_SIZE/SPRITE_SIZE- cameraPos.x + OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE,
                y: this.pos.y + handY*DRAWN_SIZE/SPRITE_SIZE - cameraPos.y,
            };
            
        }
        // translatePos = {
        //     x: this.pos.x + DRAWN_SIZE/2,
        //     y: this.pos.y + DRAWN_SIZE/2
        // };
        translatePos.y = translatePos.y || -500;
        translatePos.x = translatePos.x || -500;
        c.translate(translatePos.x ,translatePos.y);
        c.rotate(this.handleAngle);
        // c.fillStyle ='red';
        // c.fillRect(-5, 0, 10, 70);
        if(this.team === 1) c.filter = `hue-rotate(-${(PLAYER_BOOSTS.damage + PLAYER_BOOSTS.speed - 2)*30}deg)`;
        if(this.dir === Directions.right){
            c.drawImage(this.hand, 0, 0, this.hand.width, this.hand.height, -HAND_SIZE/2, 0, HAND_SIZE, this.hand.height / this.hand.width * HAND_SIZE);
            c.drawImage(this.gun, 0, 0, this.gun.width, this.gun.height, -HAND_SIZE/2 + 2, HAND_SIZE+HAND_SIZE, HAND_SIZE, this.gun.height / this.gun.width * HAND_SIZE);
            if(this.shotEffectFrame.play){
                c.rotate(-Math.PI/2);
                c.drawImage(this.shotEffect, this.shotEffectFrame.curFrame*this.shotEffect.height, 0, this.shotEffect.height, this.shotEffect.height, -HAND_SIZE*3/2 - HAND_SIZE*3.5 - this.gun.height / this.gun.width * HAND_SIZE, -HAND_SIZE*1.1 - HAND_SIZE*this.gunObj.offset, HAND_SIZE*3, HAND_SIZE*3);
                c.rotate(Math.PI/2);
            }
        }
        else{
            c.drawImage(this.handRight, 0, 0, this.hand.width, this.hand.height, -HAND_SIZE/2, 0, HAND_SIZE, this.hand.height / this.hand.width * HAND_SIZE);
            c.drawImage(this.gunLeft, 0, 0, this.gun.width, this.gun.height, -HAND_SIZE/2 - 2, HAND_SIZE+HAND_SIZE, HAND_SIZE, this.gun.height / this.gun.width * HAND_SIZE);
            if(this.shotEffectFrame.play){
                c.rotate(-Math.PI/2);
                c.drawImage(this.shotEffect, this.shotEffectFrame.curFrame*this.shotEffect.height, 0, this.shotEffect.height, this.shotEffect.height, -HAND_SIZE*3/2 - HAND_SIZE*3.5 - this.gun.height / this.gun.width * HAND_SIZE, -HAND_SIZE*1.9 + HAND_SIZE*this.gunObj.offset, HAND_SIZE*3, HAND_SIZE*3);
                c.rotate(Math.PI/2);
            }
            
        }
        c.filter = "none";
        c.rotate(-this.handleAngle)
        c.translate(-translatePos.x, -translatePos.y);
        // let box = this.getBox();
        // c.fillStyle='rgba(255,0,0,.3)';
        // c.fillRect(box.x - cameraPos.x, box.y - cameraPos.y, box.x2 - box.x, box.y2 - box.y)
        if(this.shieldAnim.isActive && this.team === 2){
            let boostName = 'shield';
            let boostColors = PLAYER_BOOSTS[`${boostName}Colors`],
            boostState = PLAYER_BOOSTS[`${boostName}Time`];
            c.fillStyle = 'rgba(0, 0, 0, 1)';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x-1, this.pos.y - cameraPos.y-1, DRAWN_SIZE/2+2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6+2);
            c.fillStyle = boostColors.bg;
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
            c.fillStyle = boostColors.color;
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2 *((this.health-this.maxHealth)/(this.maxHealth/2)), 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
        } else if(this.team === 1 && PLAYER_BOOSTS.shieldTime.cur > 0){
            let boostName = 'shield';
            let boostColors = PLAYER_BOOSTS[`${boostName}Colors`],
            boostState = PLAYER_BOOSTS[`${boostName}Time`];
            c.fillStyle = 'rgba(0, 0, 0, 1)';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x-1, this.pos.y - cameraPos.y-1, DRAWN_SIZE/2+2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6+2);
            c.fillStyle = boostColors.bg;
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
            c.fillStyle = boostColors.color;
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2 *boostState.cur / boostState.max, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
        } else{
            c.fillStyle = 'rgba(0, 0, 0, 1)';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x-1, this.pos.y - cameraPos.y-1, DRAWN_SIZE/2+2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6+2);
            c.fillStyle = 'rgba(104, 32, 32, .6)';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
            c.fillStyle = '#CC3F3F';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2 *(this.health > 0?this.health / this.maxHealth : 0), 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
        }
        // c.drawImage(HEALTH_BAR.empty, 0, 0, HEALTH_BAR.empty.width, HEALTH_BAR.empty.height, this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/3);
        // c.drawImage(HEALTH_BAR.filled, 0, 0, HEALTH_BAR.empty.width*(this.health > 0?this.health / this.maxHealth : 0), HEALTH_BAR.empty.height, this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y, DRAWN_SIZE/2 * (this.health > 0?this.health / this.maxHealth : 0), 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/3);
        if(this.showReload){
            c.fillStyle = 'rgba(0, 0, 0, 1)';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x-1, this.pos.y - cameraPos.y - DRAWN_SIZE/10-1, DRAWN_SIZE/2+2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6+2);
            c.fillStyle= 'rgba(168, 134, 19, .5)';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y - DRAWN_SIZE/10, DRAWN_SIZE/2, 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
            c.fillStyle= '#ffca1c';
            c.fillRect(this.pos.x+DRAWN_SIZE/2 - cameraPos.x, this.pos.y - cameraPos.y - DRAWN_SIZE/10, DRAWN_SIZE/2 * ((this.gunObj.reloadMax - this.reload))/(this.gunObj.reloadMax), 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6);
        }
        if(this.team === 1) {
            /**
             * Рисуем бусты
             */
            PLAYER_BOOSTS.allBoosts.filter(b=>PLAYER_BOOSTS[`${b}Time`].cur > 0 && b !== 'shield').forEach(
                (boostName, index)=>{
                    let boostColors = PLAYER_BOOSTS[`${boostName}Colors`],
                    boostState = PLAYER_BOOSTS[`${boostName}Time`];
                    c.fillStyle = 'rgba(0, 0, 0, 1)';
                    c.fillRect(
                        -1+this.pos.x+DRAWN_SIZE/2 - cameraPos.x, 
                        -1+this.pos.y - cameraPos.y - 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/3 - DRAWN_SIZE/20 +  (- 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6 - DRAWN_SIZE/50)*index, 
                        2+DRAWN_SIZE/2, 
                        2+1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6
                        );
                    c.fillStyle= boostColors.bg;
                    c.fillRect(
                        this.pos.x+DRAWN_SIZE/2 - cameraPos.x, 
                        this.pos.y - cameraPos.y - 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/3 - DRAWN_SIZE/20 +  (- 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6 - DRAWN_SIZE/50)*index, 
                        DRAWN_SIZE/2, 
                        1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6
                        );
                    c.fillStyle= boostColors.color;
                    c.fillRect(
                        this.pos.x+DRAWN_SIZE/2 - cameraPos.x, 
                        this.pos.y - cameraPos.y - 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/3 - DRAWN_SIZE/20 + (- 1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6 - DRAWN_SIZE/50)*index, 
                        DRAWN_SIZE/2 * boostState.cur/boostState.max, 
                        1.5*OFFSET.top*DRAWN_SIZE/SPRITE_SIZE/6
                        );
                }
            )
            c.filter = `hue-rotate(-${(PLAYER_BOOSTS.damage + PLAYER_BOOSTS.speed - 2)*30}deg)`;
        }
        if(this.dir === Directions.right){
            c.drawImage(this.images[this.state], this.curFrame * SPRITE_SIZE*this.spriteScale, 0, SPRITE_SIZE*this.spriteScale, SPRITE_SIZE*this.spriteScale, this.pos.x + DRAWN_SIZE/2- cameraPos.x, this.pos.y- cameraPos.y, DRAWN_SIZE, DRAWN_SIZE);
        }
        else{
            c.drawImage(this.imagesLeft[this.state], ((this.state === States.walk?5 : 3) - this.curFrame) * SPRITE_SIZE*this.spriteScale, 0, SPRITE_SIZE*this.spriteScale, SPRITE_SIZE*this.spriteScale, this.pos.x + DRAWN_SIZE*0/2- cameraPos.x + OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE, this.pos.y- cameraPos.y, DRAWN_SIZE, DRAWN_SIZE);
        }
        if(this.shieldHitAnimFrams.isActive)
            c.filter = `brightness(${100+this.shieldHitAnimFrams.value/this.shieldHitAnimFrams.max*100}%)`;
        c.globalAlpha = 2*Math.abs(this.shieldAnim.max/2 - this.shieldAnim.value)/this.shieldAnim.max*0.4+0.6;
        if(this.shieldAnim.isActive)
        c.drawImage(this.shield, 0, 0, this.shield.width, this.shield.height, this.pos.x + DRAWN_SIZE/4- cameraPos.x, this.pos.y- cameraPos.y + DRAWN_SIZE/10, DRAWN_SIZE, DRAWN_SIZE);
        c.globalAlpha = 1;
        c.filter = "none";
    }

    /**
     * Updates the entity (every frame)
     * Обновляет entity (каждый кадр)
     */
    update(){
        if(this.isJump){
            this._doingJump();
        }
        if(this.team === 2 && !GAME_STATE.end){
            this._updateAi();
        }
        this.gravity();
        this.draw();
        this.updateAnim();
        dieBlocksCollision(this);
    }

    /**
     * Запускат анимацю эффекта выстрела
     */
    playShotEffect(){
        this.shotEffectFrame.play = true;
        this.shotEffectFrame.curFrame = 0;
    }

    updateAnim(){
        this.counter.cur++;
        if(this.counter.cur % this.counter.fq === 0){
            if(this.shieldAnim.isActive){
                this.shieldAnim.value++;
                if(this.shieldAnim.value === this.shieldAnim.max) this.shieldAnim.value = 0;
            }
            if(this.shieldHitAnimFrams.isActive && this.shieldHitAnimFrams.value > 0){
                this.shieldHitAnimFrams.value--;
                if( this.shieldHitAnimFrams.value === 0)  this.shieldHitAnimFrams.isActive = false;
            }
            if(this.team === 1) this._updatePlayerStates();
            this.curFrame++;
            this.shotEffectFrame.curFrame++;
            if(this.shotEffectFrame.curFrame > this.shotEffectFrame.max) this.shotEffectFrame.play = false;
            if(this.curFrame > 3) this.curFrame = 0;
        }
        if(this.reload > 0) {this.reload--; if(this.reload < 0) this.reload = 0;}
    }

    _updatePlayerStates(){
        if(PLAYER_BOOSTS.damageTime.cur > 0) PLAYER_BOOSTS.damageTime.cur--;
        if(PLAYER_BOOSTS.speedTime.cur > 0) PLAYER_BOOSTS.speedTime.cur--;
        if(PLAYER_BOOSTS.shieldTime.cur > 0) {PLAYER_BOOSTS.shieldTime.cur--; if(PLAYER_BOOSTS.shieldTime.cur === 0) this.shieldAnim.isActive = false;}
        if(PLAYER_BOOSTS.damageTime.cur === 0) PLAYER_BOOSTS.damage = 1;
        if(PLAYER_BOOSTS.speedTime.cur === 0) PLAYER_BOOSTS.speed = 1;
    }

    /**
     * Move entity in cur dir on x*speed
     * Двигает entity в текущем направлении на x*speed
     * @param {number} x speed factor; множитель скорости
     * @returns {Boolean} врезался при движении или нет
     */
    move(x = 0){
        let scale = 1;
        if(this.team === 1) scale = PLAYER_BOOSTS.speed;
        let res = false;
        this.pos.x+=x*this.speed*GLOBAS_SCALE*scale;
        if(entitiesCollision(this) || fullCollWithMap(this)){
            this.pos.x-=x*this.speed*GLOBAS_SCALE*scale;
            res = true;
        }
        this.isMove = true;
        return res;
    }

    /**
     * Returns the entiti's current box
     * Вовращает текущий бокс entity
     * @returns {{x: number, y: number, x2: number, y2: number}} x - left, y - top, x2 - right, y2 - bottom of Box
     */
    getBox(){
        let thisBox = {x: 0, y: 0, x2: 0, y2: 0};
        if(this.dir === Directions.right || 1){
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
        let bCres = bottomCollisionWithMap(this);
        this.isOnFloor = bCres.res;
        if(!this.isJump){
            this.pos.y+=GRAVITY*this.weight;
            bCres = bottomCollisionWithMap(this);
            if(entitiesCollision(this) || bCres.res){
                this.isOnFloor = true;
                if(!bCres.res) this.pos.y-=GRAVITY*this.weight;
                else this.pos.y = bCres.y - DRAWN_SIZE; 
            }
        }
        
    }

    _doingJump(){
        this.pos.y -= this.jumpVelocity / this.jumpDuration.max;
        this.jumpDuration.cur++;
        if(this.jumpDuration.cur >= this.jumpDuration.max){
            this.isJump = false;
        }
        else if(fullCollWithMap(this)){
            this.isJump = false;
            // this.pos.y += this.jumpVelocity / this.jumpDuration.max;
        }
        else if(entitiesCollision(this)){
            this.isJump = false;
            this.pos.y += 2 * GLOBAS_SCALE;
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

    /**
     * set dir
     * меняет направление
     * @param {'right' | 'left'} newDir right | left
     */
    setDirection(newDir){
        this.dir = Directions[newDir] || this.dir;
    }

    /**
     * 
     * @param {'right' | 'left'} checkDir dir направление
     * @returns {Boolean}
     */
    compateDirection(checkDir){
        return this.dir === Directions[checkDir];
    }

    _updateEnemyHand(){
        let angle = Math.atan(
            (this.pos.y - p.pos.y)/(this.pos.x - p.pos.x)
        );
        this.handleAngle = angle - Math.PI/2;
        if(this.compateDirection('left')) this.handleAngle += Math.PI;
        if(this.reload === 0){
            this._shot();
            this.reload = this.gunObj.reloadMax;
        }
    }

    _shot(){
        let randomShift = (Math.random()-0.5)*2;
        if(Math.random() > 0.7) randomShift =  0;
        let handPos, handY = this.isOnFloor?HAND_POSES[this.charName].y:HAND_POSES[this.charName].jumpY;
        if(this.compateDirection('right')){
                let translatePos = {
                    x: this.pos.x + (HAND_POSES[this.charName].x)*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE/2,
                    y: this.pos.y + handY*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*this.gunObj.offset
                };
                handPos = {x: translatePos.x + (this.hand.height / this.hand.width * HAND_SIZE+this.gun.height / this.gun.width * HAND_SIZE - HAND_SIZE)*Math.sin(Math.PI+this.handleAngle), y: translatePos.y + (this.hand.height / this.hand.width * HAND_SIZE+this.gun.height / this.gun.width * HAND_SIZE - HAND_SIZE)*Math.cos(this.handleAngle)};
        }
        else{
            let translatePos = {
                x: this.pos.x + (SPRITE_SIZE-(HAND_POSES[this.charName].x))*DRAWN_SIZE/SPRITE_SIZE,
                y: this.pos.y + handY*DRAWN_SIZE/SPRITE_SIZE + HAND_SIZE*this.gunObj.offset,
            }
            handPos = {x: translatePos.x - (this.hand.height / this.hand.width * HAND_SIZE+this.gun.height / this.gun.width * HAND_SIZE - HAND_SIZE)*Math.sin(this.handleAngle), y: translatePos.y + (this.hand.height / this.hand.width * HAND_SIZE+this.gun.height / this.gun.width * HAND_SIZE - HAND_SIZE)*Math.cos(this.handleAngle)};
        }
            bullets.push(new Bullet(this.gunObj.bullet, this.gunObj.bulletSpeed, this.gunObj.baseDamage*0.6, handPos, handPos, 2, this.handleAngle + Math.PI/2+randomShift*Math.PI/20, true, this.gunObj.bulletSize || 1, this.gunObj.maxDistScale || 1));
        this.playShotEffect();
    }

    _updateAi(){
        c.fillStyle='blue';
        let box = this.getBox();
        let AI_area = {
            x: box.x + DRAWN_SIZE-AI_BOX.width,
            x2: box.x + DRAWN_SIZE,
            y: (box.y+box.y2)/2 - AI_BOX.height/2,
            y2: (box.y+box.y2)/2 - AI_BOX.height/2 + AI_BOX.height,
        }
        if(this.compateDirection('right')){
            AI_area = {
                x: box.x - DRAWN_SIZE*0.6,
                x2: box.x - DRAWN_SIZE*0.6 + AI_BOX.width,
                y: (box.y+box.y2)/2 - AI_BOX.height/2,
                y2: (box.y+box.y2)/2 - AI_BOX.height/2 + AI_BOX.height,
            }
        }
        // if(this.attacked.state){
        //     AI_area.x -= DRAWN_SIZE*2;
        //     AI_area.x2 += DRAWN_SIZE*2;
        // }
        // c.fillRect(AI_area.x - cameraPos.x, AI_area.y - cameraPos.y, AI_area.x2 - AI_area.x, AI_area.y2 - AI_area.y)

        let resAI = entitiesInAreaAI(AI_area, this);
        if(resAI.res || this.attacked){
            this.followPlayer.state = true;
            if(this.followPlayer.time < this.AI_WALK.time.mTime*2)
                this.followPlayer.time+=this.followPlayer.step;
                this.attacked = false;
        }
        if(this.followPlayer.state)
            this._aiFollowPlayer(resAI.dist, resAI.dir);
        else
        // let resAI = entitiesInAreaAI(AI_area, this);
        // if(resAI.res){
        //     this._updateEnemyHand();
        //     this.setDirection(resAI.dir);
        //     if(resAI.dist >= AI_MIN_DIST)
        //         this.move(this.dir * 0.8);
        //     else 
        //         this.isMove = false;
        // }
        // else{
        //     this.isMove = false;
        // }
            this._aiNormalMove(0.5);
    }

    /**
     * Обычная ходьба, когда не видно игрока
     * @param {number} x множитель скорости
     */
    _aiNormalMove(x = 0){
        this.handleAngle = Math.PI/8;
        if(this.compateDirection('right')){
            this.handleAngle*=-1;
            this.AI_WALK.dir = Directions.right;
        }
        else this.AI_WALK.dir = Directions.left;
        if(this.AI_WALK.state === AI_WALK_STATES.walk){
            if(this.AI_WALK.time.cur > 0){
                this.pos.x+=this.dir*this.speed*GLOBAS_SCALE*x;
                let bCollRes = bottomCollisionWithMap(this);
                if(entitiesCollision(this) || fullCollWithMap(this) || !bCollRes.res){
                    this.pos.x-=this.dir*this.speed*GLOBAS_SCALE*x;
                    this.dir = -1 * this.dir;
                    bCollRes = bottomCollisionWithMap(this);
                    if(!bCollRes.res){
                        this.pos.x+=this.dir*this.speed*GLOBAS_SCALE*x;
                    }
                    this.AI_WALK.time.cur = this.AI_WALK.time.mTime - this.AI_WALK.time.cur;
                }
                else{
                    this.AI_WALK.time.cur--;
                }
                this.isMove = true;
            }
            else if(this.AI_WALK.time.cur <= 0){
                this.AI_WALK.state = AI_WALK_STATES.stay;
                this.AI_WALK.time.cur = this.AI_WALK.time.mTime + Math.floor(Math.random()*10);
            }
        } else if(this.AI_WALK.state === AI_WALK_STATES.stay){
            this.isMove = false;
            this.AI_WALK.time.cur--;
            if(this.AI_WALK.time.cur <= 0){
                this.AI_WALK.state = AI_WALK_STATES.walk;
                this.AI_WALK.time.cur = this.AI_WALK.time.mTime;
                this.dir = -1 * this.dir;
            }
        }
    }

    /**
     * Следует за игроком
     * @param {number} dist расстояние до игрока
     * @param {number} dir новое направление движения для ентити
     */
    _aiFollowPlayer(dist = 0, dir = 0){
        if(dir !== 0)
            this.setDirection(dir);
        if(Math.pow(p.pos.x - this.pos.x, 2) + Math.pow(p.pos.y-this.pos.y, 2) <= AI_MAX_DIST*AI_MAX_DIST){
            if((dist >= AI_MIN_DIST || dist === 0) && Math.abs(this.startPos.x - this.pos.x) < this.AI_WALK.time.mTime*this.speed*GLOBAS_SCALE*0.5){
                this.isMove = !this.move(this.dir * 0.6);
                if(!bottomCollisionWithMap(this).res){
                    this.move(this.dir * (-0.6));
                    this.isMove = false;
                }
            }
            else 
                this.isMove = false;
        } else{
            this.isMove = false;
            this.followPlayer.time--;
            if(this.followPlayer.time === 0){
                this.followPlayer.state = false;
            }
        }
        this._updateEnemyHand();
    }

    /**
     * Добавляет здоровье
     * @param {number} addedHealth 
     */
    addHealth(addedHealth){
        this.health += addedHealth;
        if(this.health > this.maxHealth) this.health = this.maxHealth;
    }

    /**
     * Сменить оружие
     * @param {keyof GUNS} newGun 
     * @param {Boolean} hd hd текстуры или нет
     */
    setGun(newGun, hd = true){
        console.log(newGun, this.gunName)
        if(parseInt(newGun) <= parseInt(this.gunName)) {this.health = this.maxHealth; return}
        this.gunName = newGun;
        this.gunObj = structuredClone(getGun(newGun));
        this.gun.src = `images/2 Guns/${this.gunObj.srcHD.right}`;
        this.gunLeft.src = `images/2 Guns/${this.gunObj.srcHD.left}`;
        this.shotEffect.src = `images/4 Shoot_effects/${this.gunObj.shotEffect}.png`;
    }

    destroy(){
        let box = this.getBox();
        if(this.team === 2){
            let dropPos = {x: box.x, y: box.y2-TILE_SIZE};
            if(p.health < p.maxHealth*0.3)
                new Drop(dropPos, 'health');
            else
            if(Math.random() > 0.7 && Object.keys(GUNS).indexOf(this.gunName) > Object.keys(GUNS).indexOf(p.gunName))
                    new Drop(dropPos, 'gun', this.gunName);
            else if(Object.keys(GUNS).indexOf(this.gunName)*50+p.baseHealth > p.maxHealth){
                new Drop(dropPos, 'maxHealth'); }
            else if(Math.random() > 0.6)
                new Drop(dropPos, 'damage');
            else if(Math.random() > 0.6)
                new Drop(dropPos, 'speed');
            else if(Math.random() > 0.5)
                new Drop(dropPos, 'shield');
            else if(Math.random() > 0.8)
                new Drop(dropPos, 'health');
        }
        collisionEntities.splice(collisionEntities.indexOf(this), 1);
    }
}