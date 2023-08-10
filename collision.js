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
            c.beginPath();
            if(colEntity.dir === Directions.right){
                c.moveTo(colEntity.pos.x + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
                c.lineTo(colEntity.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
                c.lineTo(colEntity.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
                c.lineTo(colEntity.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
                c.lineTo(colEntity.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            }
            else{
                c.moveTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
                c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
                c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
                c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE);
                c.lineTo(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
            }
            // c.stroke();
            c.closePath();
            if(c.isPointInPath(point.x, point.y) && colEntity.team !== bullet.team){
                console.log('попал')
                colEntity.health -= 20;
                if(colEntity.health <= 0){
                    collisionEntities.splice(i, 1);
                }
                res = true;
            }
    })
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
 */
function entitiesCollision(ent){
    let res = false;
    let entBox = ent.getBox();
    // c.beginPath();
    // if(ent.dir === Directions.right){
    //     c.moveTo(ent.pos.x + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
    //     c.lineTo(ent.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
    //     c.lineTo(ent.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y+ DRAWN_SIZE);
    //     c.lineTo(ent.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y+ DRAWN_SIZE);
    //     c.lineTo(ent.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
    // }
    // else{
    //     c.moveTo(ent.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
    //     c.lineTo(ent.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
    //     c.lineTo(ent.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y+ DRAWN_SIZE);
    //     c.lineTo(ent.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y+ DRAWN_SIZE);
    //     c.lineTo(ent.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, ent.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE);
    // }
    // // c.stroke();
    // c.closePath();
    //93 236
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

            // if(colEntity.dir === Directions.right){
            //     if(
            //     c.isPointInPath(colEntity.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE) ||
            //     c.isPointInPath(colEntity.pos.x + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE) ||
            //     c.isPointInPath(colEntity.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE) ||
            //     c.isPointInPath(colEntity.pos.x+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE)
            //     ){
            //         console.log('Collision 1')
            //         return true;
            //     }
            // }
            // else{
            //     c.fillStyle = 'red';
            //     c.fillRect(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE, 10, 10);
            //     if(
            //     c.isPointInPath(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE) ||
            //     c.isPointInPath(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE + DRAWN_SIZE + OFFSET.right*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE) ||
            //     c.isPointInPath(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y+ DRAWN_SIZE) ||
            //     c.isPointInPath(colEntity.pos.x - OFFSET.leftDir*DRAWN_SIZE/SPRITE_SIZE+ OFFSET.left*DRAWN_SIZE/SPRITE_SIZE, colEntity.pos.y + OFFSET.top*DRAWN_SIZE/SPRITE_SIZE)
            //     )
            //     {
            //         console.log('Colliison 2')
            //         return true;
            //     }
            // }
    })
    return res;
}