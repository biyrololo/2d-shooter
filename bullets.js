const BULLET_SIZE = 10 * GLOBAS_SCALE,
BULLET_SPEED = 15 * GLOBAS_SCALE,
MAX_DIST = 800 * GLOBAS_SCALE;

/**
 * Bullet
 * Пуля
 */
class Bullet{
    /**
     * 
     * @param {String} name bullet image name; название изображения пули
     * @param {{x: number, y: number}} start_point start pos; начальная позиция
     * @param {{x: number, y: number}} end_point end pos; конечная позиция
     * @param {number} angle angle угол
     * @param {number} team team: 1 - player, 2 - enemies; команда: 1 - игрок, 2 - противники
     */
    constructor(name, start_point, end_point, team, angle = undefined){
        this.img = new Image();
        this.img.src = `images/5 Bullets/${name}.png`;
        if(angle == undefined)
        this.angle = Math.atan((end_point.y - start_point.y)/(end_point.x - start_point.x));
        else this.angle = angle;
        if(end_point.x < start_point.x)
            this.angle+=Math.PI;
        this.pos = {...start_point};
        this.linearSpeed = {
            x: BULLET_SPEED*Math.cos(this.angle),
            y: BULLET_SPEED*Math.sin(this.angle)
        };
        this.dist = 0;
        this.team = team;
    }
}

const bullets = [];

/**
 * 
 * @param {{x: number, y: number}} point1 
 * @param {{x: number, y: number}} point2 
 * @returns {number} dist between points
 */
function distBetween2Points(point1, point2){
    return Math.sqrt(Math.pow(point1.x - point2.x, 2)+Math.pow(point1.y - point2.y, 2));
}

/**
 * Handles bullet logic
 * Обрабатывает логику пуль
 */
function updateBullets(){
    bullets.forEach(
        /**
         * 
         * @param {Bullet} b bullet
         * @param {number} i index
         */
        (b, i)=>{
        b.pos.x+=b.linearSpeed.x;
        b.pos.y+=b.linearSpeed.y;
        b.dist+=BULLET_SPEED;
        let collision = pointCollision(b);
        if(b.dist >= MAX_DIST || collision){
            bullets.splice(i, 1);
        }
        else{
            c.drawImage(b.img, 0, 0, b.img.width, b.img.height, b.pos.x-BULLET_SIZE/2 - cameraPos.x, b.pos.y-BULLET_SIZE/2 - cameraPos.y, BULLET_SIZE, BULLET_SIZE);
        }
    })
}