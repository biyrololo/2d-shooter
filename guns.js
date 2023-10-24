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
        bulletSpeed: 15,
        offset: 0,
        maxDistScale: .7
    },
    '2':{
        src:{
            right: '2_1.png',
            left: '2_1Left.png'
        },
        srcHD:{
            right: '2_1HD.png',
            left: '2_1LeftHD.png',
        },
        reloadMax: .65 * 60,
        baseDamage: 42,
        bullet: '2',
        shotEffect: '1_1',
        bulletSpeed: 20,
        offset: 0,
        maxDistScale: .9
    },
    '3':{
        src:{
            right: '3_1.png',
            left: '3_1Left.png'
        },
        srcHD:{
            right: '3_1HD.png',
            left: '3_1LeftHD.png',
        },
        reloadMax: .85 * 60,
        baseDamage: 70,
        bullet: '3',
        shotEffect: '2_1',
        bulletSpeed: 12,
        offset: .2,
        bulletSize: 2,
        maxDistScale: .6
    },
    '4':{
        src:{
            right: '4_1.png',
            left: '4_1Left.png'
        },
        srcHD:{
            right: '4_1HD.png',
            left: '4_1LeftHD.png',
        },
        reloadMax: .43 * 60,
        baseDamage: 40,
        bullet: '4',
        shotEffect: '2_1',
        bulletSpeed: 25,
        offset: .1
    },
    '5':{
        src:{
            right: '5_1.png',
            left: '5_1Left.png'
        },
        srcHD:{
            right: '5_1HD.png',
            left: '5_1LeftHD.png',
        },
        reloadMax: .67 * 60,
        baseDamage: 100,
        bullet: '5',
        shotEffect: '3_1',
        bulletSpeed: 18,
        offset: 0,
        maxDistScale: .8
    },
    '6':{
        src:{
            right: '6_1.png',
            left: '6_1Left.png'
        },
        srcHD:{
            right: '6_1HD.png',
            left: '6_1LeftHD.png',
        },
        reloadMax: .58 * 60,
        baseDamage: 100,
        bullet: '6',
        shotEffect: '3_1',
        bulletSpeed: 22,
        offset: -0.1
    },
    '7':{
        src:{
            right: '7_1.png',
            left: '7_1Left.png'
        },
        srcHD:{
            right: '7_1HD.png',
            left: '7_1LeftHD.png',
        },
        reloadMax: .8 * 60,
        baseDamage: 130,
        bullet: '7_2',
        shotEffect: '4_1',
        bulletSpeed: 14,
        offset: 0.15,
        maxDistScale: .7
    },
    '8':{
        src:{
            right: '8_1.png',
            left: '8_1Left.png'
        },
        srcHD:{
            right: '8_1HD.png',
            left: '8_1LeftHD.png',
        },
        reloadMax: .75 * 60,
        baseDamage: 250,
        bullet: '8',
        shotEffect: '4_1',
        bulletSpeed: 20,
        offset: 0.1,
        bulletSize: 1.5,
        maxDistScale: .3
    },
    '9':{
        src:{
            right: '9_1.png',
            left: '9_1Left.png'
        },
        srcHD:{
            right: '9_1HD.png',
            left: '9_1LeftHD.png',
        },
        reloadMax: 1 * 60,
        baseDamage: 240,
        bullet: '9',
        shotEffect: '5_1',
        bulletSpeed: 10,
        offset: 0.1,
        bulletSize: 2,
        maxDistScale: .7
    },
    '10':{
        src:{
            right: '10_1.png',
            left: '10_1Left.png'
        },
        srcHD:{
            right: '10_1HD.png',
            left: '10_1LeftHD.png',
        },
        reloadMax: .3 * 60,
        baseDamage: 70,
        bullet: '10',
        shotEffect: '5_1',
        bulletSpeed: 26,
        offset: 0.1,
        maxDistScale: 2
    }
};

/**
 * 
 * @param {'1' | '2'} gun 
 * @returns {{src: {right: string, left: string}, srcHD: {right: string, left: string}, reloadMax: number, baseDamage: number, bullet: string, shotEffect: string, bulletSpeed: number, offset: number, maxDistScale?: number, bulletSize?: number}}
 */
function getGun(gun){
    if(Object.keys(GUNS).indexOf(gun) === -1) throw new Error('Некорректное название оружия')
    return GUNS[gun];
}

/**
 * 
 * @returns {'1' | '2'}
 */
function getRandomGun(){
    return Object.keys(GUNS)[Math.floor(Math.random() * Object.keys(GUNS).length)]
}