/**
 * @type {Array<Drop>}
 */
const drops = [];

class Drop{
    /**
     * 
     * @param {{x: number, y: number}} pos
     * @param  {()=>void} onPlayerCollision 
     */
    constructor(pos, onPlayerCollision){
        this.size = TILE_SIZE;
        this.pos = pos;
        this.customOnPlayerCollision = onPlayerCollision;
        drops.push(this);
    }

    update(){
        this._draw();
        this._checkPlayerCollision();
    }

    _draw(){
        c.fillStyle = 'green';
        c.fillRect(this.pos.x - cameraPos.x, this.pos.y - cameraPos.y, this.size, this.size);
    }

    _onPlayerCollision(){
        this.customOnPlayerCollision();
        this._destroy();
    }

    _destroy(){
        drops.splice(drops.indexOf(this), 1);
    }

    _checkPlayerCollision(){
        let pBox = p.getBox();
        let collisionX = isInInterval(pBox.x, this.pos.x, pBox.x2) || isInInterval(pBox.x, this.pos.x2, pBox.x2); 
        let collisionY = isInInterval(pBox.y, this.pos.y, pBox.y2) || isInInterval(pBox.y, this.pos.y2, pBox.y2); 
        if(collisionX && collisionY){
            this._onPlayerCollision();
        }
    }
}