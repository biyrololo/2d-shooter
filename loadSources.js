const sourcesCommon = [
    'start.png', 
    'maxHealth.png', 
    'health.png',
    'disk.png',
    'CrosshairJump.png',
    'Crosshair.png',
    'BG.png',
    '5_100x100px.png',
    '4_100x100px.png',
    '3_100x100px.png',
    '2_100x100px.png',
    '1_100x100px.png',
    'UI/HBfilled.png',
    'UI/HBempty.png',
    '4 Shoot_effects/1_1.png',
    '4 Shoot_effects/2_1.png',
    '4 Shoot_effects/3_1.png',
    '4 Shoot_effects/4_1.png',
    '4 Shoot_effects/5_1.png',
]

const sourcesNonHd = [
    "1 Characters/Biker/Hand.png",
    "1 Characters/Biker/HandRight.png",
    "1 Characters/Biker/Idle1.png",
    "1 Characters/Biker/Idle1Left.png",
    "1 Characters/Biker/Idle2.png",
    "1 Characters/Biker/Jump1.png",
    "1 Characters/Biker/Jump1Left.png",
    "1 Characters/Biker/Jump2.png",
    "1 Characters/Biker/Run1.png",
    "1 Characters/Biker/Run1Left.png",
    "1 Characters/Biker/Run2.png",
    "1 Characters/Biker/Sitdown1.png",
    "1 Characters/Biker/Sitdown2.png",
    "1 Characters/Biker/Walk1.png",
    "1 Characters/Biker/Walk1Left.png",
    "1 Characters/Biker/Walk2.png",
    "1 Characters/Cyborg/Hand.png",
    "1 Characters/Cyborg/HandRight.png",
    "1 Characters/Cyborg/Idle1.png",
    "1 Characters/Cyborg/Idle1Left.png",
    "1 Characters/Cyborg/Idle2.png",
    "1 Characters/Cyborg/Jump1.png",
    "1 Characters/Cyborg/Jump1Left.png",
    "1 Characters/Cyborg/Jump2.png",
    "1 Characters/Cyborg/Run1.png",
    "1 Characters/Cyborg/Run2.png",
    "1 Characters/Cyborg/Sitdown1.png",
    "1 Characters/Cyborg/Sitdown2.png",
    "1 Characters/Cyborg/Walk1.png",
    "1 Characters/Cyborg/Walk1Left.png",
    "1 Characters/Cyborg/Walk2.png",
    "1 Characters/Punk/Hand.png",
    "1 Characters/Punk/HandRight.png",
    "1 Characters/Punk/Idle1.png",
    "1 Characters/Punk/Idle1Left.png",
    "1 Characters/Punk/Idle2.png",
    "1 Characters/Punk/Jump1.png",
    "1 Characters/Punk/Jump1Left.png",
    "1 Characters/Punk/Jump2.png",
    "1 Characters/Punk/Run1.png",
    "1 Characters/Punk/Run1Left.png",
    "1 Characters/Punk/Run2.png",
    "1 Characters/Punk/Sitdown1.png",
    "1 Characters/Punk/Sitdown2.png",
    "1 Characters/Punk/Walk1.png",
    "1 Characters/Punk/Walk1Left.png",
    "1 Characters/Punk/Walk2.png",
    "2 Guns/10_1.png",
    "2 Guns/10_1Left.png",
    "2 Guns/10_2.png",
    "2 Guns/1_1.png",
    "2 Guns/1_1Left.png",
    "2 Guns/1_2.png",
    "2 Guns/2_1.png",
    "2 Guns/2_1Left.png",
    "2 Guns/2_2.png",
    "2 Guns/3_1.png",
    "2 Guns/3_1Left.png",
    "2 Guns/3_2.png",
    "2 Guns/4_1.png",
    "2 Guns/4_1Left.png",
    "2 Guns/4_2.png",
    "2 Guns/5_1.png",
    "2 Guns/5_1Left.png",
    "2 Guns/5_2.png",
    "2 Guns/6_1.png",
    "2 Guns/6_1Left.png",
    "2 Guns/6_2.png",
    "2 Guns/7_1.png",
    "2 Guns/7_1Left.png",
    "2 Guns/7_2.png",
    "2 Guns/8_1.png",
    "2 Guns/8_1Left.png",
    "2 Guns/8_2.png",
    "2 Guns/9_1.png",
    "2 Guns/9_1Left.png",
    "2 Guns/9_2.png",
    "5 Bullets/1.png",
    "5 Bullets/10.png",
    "5 Bullets/2.png",
    "5 Bullets/3.png",
    "5 Bullets/4.png",
    "5 Bullets/4_1.png",
    "5 Bullets/4_2.png",
    "5 Bullets/5_1.png",
    "5 Bullets/5_2.png",
    "5 Bullets/6.png",
    "5 Bullets/7_1.png",
    "5 Bullets/7_2.png",
    "5 Bullets/8.png",
    "5 Bullets/9.png",
    ]

const sourcesHD = [
    "1 Characters/Punk/HandHD.png",
    "1 Characters/Punk/HandRightHD.png",
    "1 Characters/Punk/Idle1HD.png",
    "1 Characters/Punk/Idle1LeftHD.png",
    "1 Characters/Punk/Jump1HD.png",
    "1 Characters/Punk/Jump1LeftHD.png",
    "1 Characters/Punk/Run1HD.png",
    "1 Characters/Punk/Run1LeftHD.png",
    "1 Characters/Punk/Walk1HD.png",
    "1 Characters/Punk/Walk1LeftHD.png",
    "1 Characters/Cyborg/HandHD.png",
    "1 Characters/Cyborg/HandRightHD.png",
    "1 Characters/Cyborg/Idle1HD.png",
    "1 Characters/Cyborg/Idle1LeftHD.png",
    "1 Characters/Cyborg/Jump1HD.png",
    "1 Characters/Cyborg/Jump1LeftHD.png",
    "1 Characters/Cyborg/Walk1HD.png",
    "1 Characters/Cyborg/Walk1LeftHD.png",
    "1 Characters/Biker/HandHD.png",
    "1 Characters/Biker/HandRightHD.png",
    "1 Characters/Biker/Idle1HD.png",
    "1 Characters/Biker/Idle1LeftHD.png",
    "1 Characters/Biker/Jump1HD.png",
    "1 Characters/Biker/Jump1LeftHD.png",
    "1 Characters/Biker/Walk1HD.png",
    "1 Characters/Biker/Walk1LeftHD.png",
    "2 Guns/10_1HD.png",
    "2 Guns/10_1LeftHD.png",
    "2 Guns/1_1HD.png",
    "2 Guns/1_1LeftHD.png",
    "2 Guns/2_1HD.png",
    "2 Guns/2_1LeftHD.png",
    "2 Guns/3_1HD.png",
    "2 Guns/3_1LeftHD.png",
    "2 Guns/4_1HD.png",
    "2 Guns/4_1LeftHD.png",
    "2 Guns/5_1HD.png",
    "2 Guns/5_1LeftHD.png",
    "2 Guns/6_1HD.png",
    "2 Guns/6_1LeftHD.png",
    "2 Guns/7_1HD.png",
    "2 Guns/7_1LeftHD.png",
    "2 Guns/8_1HD.png",
    "2 Guns/8_1LeftHD.png",
    "2 Guns/9_1HD.png",
    "2 Guns/9_1LeftHD.png",
    "5 Bullets/10HD.png",
    "5 Bullets/1HD.png",
    "5 Bullets/2HD.png",
    "5 Bullets/3HD.png",
    "5 Bullets/4HD.png",
    "5 Bullets/5HD.png",
    "5 Bullets/6HD.png",
    "5 Bullets/7_2HD.png",
    "5 Bullets/8HD.png",
    "5 Bullets/9HD.png",
]