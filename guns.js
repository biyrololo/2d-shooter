const GUNS = {
    '1':{
        src:{
            right: '1_1.png',
            left: '1_1Left.png'
        },
        srcHD:{
            right: '1_1HD.png',
            left: '1_1LeftHD.png',
        },
        reloadMax: .5 * 60,
        baseDamage: 20,
        bullet: '1',
        shotEffect: '1_1',
        bulletSpeed: 15
    }
}


/**
 * 
 * @param {'1'} gun 
 * @returns {{src: {right: string, left: string}, srcHD: {right: string, left: string}, reloadMax: number, baseDamage: number, bullet: string, shotEffect: string, bulletSpeed: number}}
 */
function getGun(gun){
    if(Object.keys(GUNS).indexOf(gun) === -1) throw new Error('Некорректное название оружия')
    return GUNS[gun];
}