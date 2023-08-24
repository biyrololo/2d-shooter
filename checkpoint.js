class Checkpoint{
    /**
     * 
     * @param {{x: number, y: number}} pos 
     */
    constructor(pos){
        this.pos = {
            x: pos.x * TILE_SIZE,
            y: pos.y * TILE_SIZE
        };
        this.isActivated = false;
        this.size = TILE_SIZE;
    }

    update(){
        this._draw();
        this._checkPlayerCollision();
    }

    _draw(){
        c.fillStyle = this.isActivated?'blue':'green';
        c.fillRect(this.pos.x - cameraPos.x, this.pos.y - cameraPos.y, this.size, this.size);
    }

    _onPlayerCollision(){
        if(!this.isActivated){
            this.isActivated = true;
            SPAWN_POINT.x = this.pos.x - DRAWN_SIZE/2;
            SPAWN_POINT.y = this.pos.y - DRAWN_SIZE;
        }
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