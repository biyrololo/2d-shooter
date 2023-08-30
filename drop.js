/**
 * @type {Array<Drop>}
 */
const drops = [];

class Drop{
    /**
     * 
     * @param {{x: number, y: number}} pos
     * @param  {'health' | 'gun' | 'maxHealth'} type
     * @param {'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'} gun 
     */
    constructor(pos, type, gun = null){
        this.size = TILE_SIZE;
        this.pos = pos;
        this.type = type;
        if(type === 'gun' && gun){
            this.gunName = gun;
            this.gun = getGun(gun);
            this.gunImg = new Image();
            this.gunImg.src = `images/2 Guns/${this.gun.srcHD.right}`;
        }
        drops.push(this);
    }

    update(){
        this._draw();
        this._checkPlayerCollision();
    }

    _draw(){
        switch (this.type){
            case 'health':
                c.fillStyle = 'pink';
                c.fillRect(this.pos.x - cameraPos.x, this.pos.y - cameraPos.y, this.size, this.size);
                break;
            case 'gun':
                c.drawImage(this.gunImg, 0, 0, this.gunImg.width, this.gunImg.height, this.pos.x - cameraPos.x, this.pos.y - cameraPos.y, this.size, this.size);
                break;
            case 'maxHealth':
                c.fillStyle = 'red';
                c.fillRect(this.pos.x - cameraPos.x, this.pos.y - cameraPos.y, this.size, this.size);
            
        }
        
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