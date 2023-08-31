const DISK = new Image(), MAX_DISK_FRAME = 18, DISK_SIZE = 16;
DISK.src = `images/disk.png`;

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
        this.frame = {
            cur: 0,
            fq: 5,
            t: 0
        }
    }

    update(){
        this._updateTimer();
        this._draw();
        this._checkPlayerCollision();
    }

    _draw(){
        // c.fillStyle = this.isActivated?'blue':'green';
        // c.fillRect(this.pos.x - cameraPos.x, this.pos.y - cameraPos.y, this.size, this.size);
        if(!this.isActivated){
            c.drawImage(DISK, this.frame.cur*DISK_SIZE, 0, DISK_SIZE, DISK_SIZE, this.pos.x - cameraPos.x, this.pos.y - cameraPos.y, this.size, this.size)
        }
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

    _updateFrame(){
        this._updateTimer();
        this.frame.cur++;
        if(this.frame.cur === MAX_DISK_FRAME){
            this.frame.cur = 0;
        }
    }

    _updateTimer(){
        this.frame.t++;
        if(this.frame.t%this.frame.fq === 0 && this.frame.t > 0){
            this.frame.t = 0;
            this._updateFrame();
        }
    }
}