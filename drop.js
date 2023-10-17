/**
 * @type {Array<Drop>}
 */
const drops = [];

class Drop{
    /**
     * 
     * @param {{x: number, y: number}} pos
     * @param  {'health' | 'gun' | 'maxHealth' | 'speed' | 'damage' | 'shield'} type
     * @param {'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'} gun 
     */
    constructor(pos, type, gun = null){
        this.size = TILE_SIZE;
        this.pos = pos;
        this.type = type;
        this.image = new Image();
        if(type === 'gun' && gun){
            this.gunName = gun;
            this.gun = getGun(gun);
            this.image.src = `images/2 Guns/${this.gun.srcHD.right}`;
        } else if(type === 'health'){
            this.image.src = 'images/health.png';
        } else if(type === 'maxHealth'){
            this.image.src = 'images/maxHealth.png';
        } else if(type === 'speed'){
            this.image.src = 'images/speed.png';
        } else if(type === 'damage'){
            this.image.src = 'images/damage.png';
        } else if(type === 'shield'){
            this.image.src = 'images/shieldDrop.png';
        }
        drops.push(this);
    }

    /**
     * обновляет состояние + отрисовка
     */
    update(){
        this._draw();
        this._checkPlayerCollision();
    }

    _draw(){
        c.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.pos.x - cameraPos.x, this.pos.y - cameraPos.y - (this.image.height/this.image.width - 1) * this.size, this.size, this.size*this.image.height/this.image.width)
    }

    _onPlayerCollision(){
        switch (this.type){
            case 'health':
                p.addHealth(Math.floor(p.maxHealth*0.35));
                break;
            case 'gun':
                p.setGun(this.gunName);
                break;
            case 'maxHealth':
                p.maxHealth+=50;
                p.health = p.maxHealth;
                break;
            case 'speed':
                PLAYER_BOOTS.speed=1.2;
                PLAYER_BOOTS.speedTime.cur = PLAYER_BOOTS.speedTime.max;
                break;
            case 'damage':
                PLAYER_BOOTS.damage=1.5;
                PLAYER_BOOTS.damageTime.cur = PLAYER_BOOTS.damageTime.max;
                break;
            case 'shield':
                p.shieldAnim.isActive = true;
                PLAYER_BOOTS.shieldTime.cur = PLAYER_BOOTS.shieldTime.max;
                break;
        }
        this._destroy();
    }

    _destroy(){
        drops.splice(drops.indexOf(this), 1);
    }

    _checkPlayerCollision(){
        let pBox = p.getBox();
        let collisionX = isInInterval(pBox.x, this.pos.x, pBox.x2) || isInInterval(pBox.x, this.pos.x + this.size, pBox.x2); 
        let collisionY = isInInterval(pBox.y, this.pos.y, pBox.y2) || isInInterval(pBox.y, this.pos.y + this.size, pBox.y2); 
        if(collisionX && collisionY){
            this._onPlayerCollision();
        }
    }
}