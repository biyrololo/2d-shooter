const BLOOD_EFFECTS = [];

class Blood{
    /**
     * 
     * @param {{x: number, y: number}} pos 
     */
    constructor(pos){
        this.pos = structuredClone(pos);
        this.image = new Image();
        this.image.src = `images/${Math.floor(Math.random()*5) + 1}_100x100px.png`;
        this.width = 6;
        this.frame = {
            cur: 0,
            max: 28
        }
        this.frameSize = 100;
        BLOOD_EFFECTS.push(this);
    }
    draw(){
        this._updateFrame();
        c.drawImage(this.image, (this.frame.cur % this.width)*this.frameSize, Math.floor(this.frame.cur / this.width)*this.frameSize, this.frameSize, this.frameSize,
        this.pos.x - cameraPos.x - TILE_SIZE, this.pos.y - cameraPos.y - TILE_SIZE, TILE_SIZE*2, TILE_SIZE*2);
    }

    _updateFrame(){
        this.frame.cur++;
        if(this.frame.cur === this.frame.max){
            BLOOD_EFFECTS.splice(BLOOD_EFFECTS.indexOf(this), 1);

        }
    }
}