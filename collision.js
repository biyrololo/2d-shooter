const OFFSET = {
    top: 14,
    left: 28,
    right: -1,
    leftDir: 3
}

const collisionEntities = [];

/**
 * Check bullet collision to entities
 * Проверяет столкновение bullet с entity
 * @param {Bullet} bullet bullet object; объект bullet
 * @returns {Boolean} is there a collision with entities; есть ли колизия с entity
 */
function pointCollision(bullet){
    let point = bullet.pos;
    let res = false;
    collisionEntities.forEach(
        /**
         * 
         * @param {Entity} colEntity 
         * @param {number} i 
         */
        (colEntity, i)=>{
            // c.beginPath();
            // if(colEntity.dir === Directions.right){
            //     c.moveTo(colEntity.pos.x + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            //     c.lineTo(colEntity.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            //     c.lineTo(colEntity.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
            //     c.lineTo(colEntity.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
            //     c.lineTo(colEntity.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            // }
            // else{
            //     c.moveTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            //     c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            //     c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
            //     c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
            //     c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            // }
            // // c.stroke();
            // c.closePath();
            
            let eBox = colEntity.getBox();
            let collisionY = isInInterval(eBox.y, point.y, eBox.y2);
            let collisionX = isInInterval(eBox.x, point.x, eBox.x2);
            if(collisionX && collisionY && colEntity.team !== bullet.team){
                if(colEntity.team === 1 && PLAYER_BOOTS.shieldTime.cur > 0){
                    PLAYER_BOOTS.shieldTime.cur -= 20;
                    colEntity.shieldHitAnimFrams.isActive = true;
                    colEntity.shieldHitAnimFrams.value = colEntity.shieldHitAnimFrams.max;
                    if(PLAYER_BOOTS.shieldTime.cur <= 0) {
                        PLAYER_BOOTS.shieldTime.cur = 0;
                        p.shieldAnim.isActive = false;
                    }
                } else if(colEntity.team === 2 && colEntity.health > colEntity.maxHealth) {
                    colEntity.health-= bullet.damage;
                    colEntity.shieldHitAnimFrams.isActive = true;
                    colEntity.shieldHitAnimFrams.value = colEntity.shieldHitAnimFrams.max;
                    if(colEntity.health <= colEntity.maxHealth) colEntity.shieldAnim.isActive = false;
                } else {
                    colEntity.health -= bullet.damage;
                    new Blood(point);
                }
                colEntity.attacked = true;
                if(colEntity.health <= 0){
                    colEntity.destroy();
                }
                res = true;
            }
    })
    if(!res){
        COLLISION_BLOCKS.forEach(tile=>{
            //block.x*TILE_SIZE - cameraPos.x, block.y*TILE_SIZE - MAP_DRAWN_WIDTH/3
            let collisionX = isInInterval(tile.x*TILE_SIZE, point.x, (tile.x + 1)*TILE_SIZE);
            let collisionY = isInInterval(tile.y*TILE_SIZE, point.y, (tile.y + 1)*TILE_SIZE);
            if(collisionX && collisionY){
                res = true;
            }
        })
    }
    return res;

}

/**
 * Check a<=val<=b
 * Проверяет a<=val<=b
 * @param {number} a lower val; меньшее значение
 * @param {number} val check value; проверяемое значение
 * @param {number} b upper val; верхнее значение
 * @returns {Boolean} 
 */
function isInInterval(a, val, b){
    return val>=a && val <= b;
}

/**
 * 
 * @param {Entity} ent 
 * @returns {Boolean}
 */
function entitiesCollision(ent){
    let res = false;
    let entBox = ent.getBox();
    collisionEntities.filter(e=>(e.pos.x !== ent.pos.x || e.pos.y !== ent.pos.y)).forEach(
        /**
         * 
         * @param {Entity} colEntity 
         * @param {number} i 
         */
        (colEntity, i)=>{
                let eBox = colEntity.getBox();
                let collisionY = isInInterval(eBox.y, entBox.y, eBox.y2) || isInInterval(eBox.y, entBox.y2, eBox.y2);
                let collisionX = isInInterval(eBox.x, entBox.x, eBox.x2) || isInInterval(eBox.x, entBox.x2, eBox.x2);
                if(collisionX && collisionY){
                    res = true;
                }
        }
    )
    return res;
}

/**
 * 
 * @param {{x: number, y: number, x2: number, y2: number}} area 
 * @param {Entity} ent
 * @returns {{res: Boolean, dir: 'right' | 'left', dist: number}}
 */
function entitiesInAreaAI(area, ent){
    let res = undefined;
    let eBox = p.getBox();
    let collisionY = isInInterval(area.y, eBox.y, area.y2) || isInInterval(area.y, eBox.y2, area.y2);
    let collisionX = isInInterval(area.x, eBox.x, area.x2) || isInInterval(area.x, eBox.x2, area.x2);
    if(collisionX && collisionY){
        res = true;
    }
    return {
        res: res,
        dir: p.pos.x > ent.pos.x? 'right' : 'left',
        dist: Math.abs(p.pos.x - ent.pos.x)
    };
}

/**
 * Проверяет колизию ног с картой
 * @param {Entity} ent 
 * @returns {{res: Boolean, y: number}}
 */
function bottomCollisionWithMap(ent){
    let res = {res: false, y: 0};
    let box = ent.getBox();
    COLLISION_BLOCKS.forEach(tile=>{
        //block.x*TILE_SIZE - cameraPos.x, block.y*TILE_SIZE - MAP_DRAWN_WIDTH/3
        let collisionX = isInInterval(tile.x*TILE_SIZE, box.x, (tile.x + 1)*TILE_SIZE) || isInInterval(tile.x*TILE_SIZE, box.x2, (tile.x + 1)*TILE_SIZE);
        let collisionY = isInInterval(tile.y*TILE_SIZE, box.y2, (tile.y + 1)*TILE_SIZE);
        if(collisionX && collisionY){
            res.res = true;
            res.y = tile.y * TILE_SIZE;
        }

    })
    return res;
}

/**
 * Проверяет колизию ног с картой
 * @param {Entity} ent 
 * @returns {Boolean}
 */
function fullCollWithMap(ent){
    let box = ent.getBox();
    let res = false;
    COLLISION_BLOCKS.forEach(tile=>{
        //block.x*TILE_SIZE - cameraPos.x, block.y*TILE_SIZE - MAP_DRAWN_WIDTH/3
        let collisionX = isInInterval(tile.x*TILE_SIZE, box.x, (tile.x + 1)*TILE_SIZE) || isInInterval(tile.x*TILE_SIZE, box.x2, (tile.x + 1)*TILE_SIZE);
        let collisionY = isInInterval(tile.y*TILE_SIZE, box.y, (tile.y + 1)*TILE_SIZE) || isInInterval(tile.y*TILE_SIZE, box.y2 - DRAWN_SIZE*0.1, (tile.y + 1)*TILE_SIZE);
        if(collisionX && collisionY){
            res = true;
        }
    })
    return res;
}

/**
 * Проверяет колизию ног со смертельными зонами
 * @param {Entity} ent 
 * @returns {Boolean}
 */
function dieBlocksCollision(ent){
    let box = ent.getBox();
    let res = false;
    DIE_ENTITY_BLOCKS.forEach(tile=>{
        //block.x*TILE_SIZE - cameraPos.x, block.y*TILE_SIZE - MAP_DRAWN_WIDTH/3
        let collisionX = isInInterval(tile.x*TILE_SIZE, box.x, (tile.x + 1)*TILE_SIZE) || isInInterval(tile.x*TILE_SIZE, box.x2, (tile.x + 1)*TILE_SIZE);
        let collisionY = isInInterval(tile.y*TILE_SIZE, box.y, (tile.y + 1)*TILE_SIZE) || isInInterval(tile.y*TILE_SIZE, box.y2, (tile.y + 1)*TILE_SIZE);
        if(collisionX && collisionY){
            res = true;
        }
    })
    if(res){
        ent.destroy();
    }
    return res;
}