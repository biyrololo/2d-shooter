const BULLET_SIZE = 10 * GLOBAS_SCALE,
MAX_DIST = 800 * GLOBAS_SCALE;

/**
 * Bullet
 * Пуля
 */
class Bullet{
    /**
     * 
     * @param {String} name bullet image name; название изображения пули
     * @param {number} speed скорость пули
     * @param {number} damage дамаг пули
     * @param {{x: number, y: number}} start_point start pos; начальная позиция
     * @param {{x: number, y: number}} end_point end pos; конечная позиция
     * @param {number} angle angle угол
     * @param {number} team team: 1 - player, 2 - enemies; команда: 1 - игрок, 2 - противники
     * @param {Boolean} HD HD текстуры
     * @param {number} maxDistScale макс расстояние полета пули
     */
    constructor(name, speed, damage, start_point, end_point, team, angle = undefined, HD = false, size = 1, maxDistScale = 1){
        let hd = HD?'HD':'';
        this.damage = damage;
        this.basicSpeed = speed * GLOBAS_SCALE;
        this.img = new Image();
        this.img.src = `images/5 Bullets/${name}${hd}.png`;
        if(angle == undefined){
            this.angle = Math.atan((end_point.y - start_point.y)/(end_point.x - start_point.x));
            if(!p.isOnFloor){
                let randomShift = (Math.random()-0.5)*2;
                this.angle+=randomShift*Math.PI/15;
            }
        } else this.angle = angle;
        if(end_point.x < start_point.x)
            this.angle+=Math.PI;
        this.pos = {...start_point};
        this.linearSpeed = {
            x: this.basicSpeed*Math.cos(this.angle),
            y: this.basicSpeed*Math.sin(this.angle)
        };
        this.dist = 0;
        this.team = team;
        this.size = BULLET_SIZE*size;
        this.maxDistScale = maxDistScale;
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
 * @param {number} deltaTime delta time
 * Handles bullet logic
 * Обрабатывает логику пуль
 */
function updateBullets(deltaTime){
    bullets.forEach(
        /**
         * 
         * @param {Bullet} b bullet
         * @param {number} i index
         */
        (b, i)=>{
        b.pos.x+=b.linearSpeed.x*deltaTime*60;
        b.pos.y+=b.linearSpeed.y*deltaTime*60;
        b.dist+=b.basicSpeed;
        let collision = pointCollision(b);
        if(b.dist >= MAX_DIST*b.maxDistScale || collision){
            bullets.splice(i, 1);
        }
        else{
            c.drawImage(b.img, 0, 0, b.img.width, b.img.height, b.pos.x-b.size/2 - cameraPos.x, b.pos.y-b.size/2 - cameraPos.y, b.size, b.size);
        }
    })
}