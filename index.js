//Основные переменные
var canvas = document.getElementById('canvas'),
  datapar = document.getElementById('data'),
  ctx = canvas.getContext('2d'),
  gravity = 0.01,
  tile = 32, //32 на 32 пикселя
  maxvelx = 0.16,
  maxvely = 0.46,
  accel = 0.04,
  impulse = 0.8,
  friction = 0.04,
  pointreqiured = 6,
  seconds = 0,
  minutes = 0,
  enrty = false,
  imagestandingR = document.getElementById('mario_standing_R'),
  imagedamaged = document.getElementById('mario_damaged'),
  imagestandingL = document.getElementById('mario_standing_L'),
  imagejumpindR = document.getElementById('mario_jumpng_R'),
  imagejumpindL = document.getElementById('mario_jumpng_L'),
  imagewalking1R = document.getElementById('mario_walk_1_R'),
  imagewalking1L = document.getElementById('mario_walk_1_L'),
  imagewalking2R = document.getElementById('mario_walk_2_R'),
  imagewalking2L = document.getElementById('mario_walk_2_L'),
  imagewalking3R = document.getElementById('mario_walk_3_R'),
  imagewalking3L = document.getElementById('mario_walk_3_L'),
  imagebrick = document.getElementById('mario_brick'),
  imagebackbrick = document.getElementById('mario_backbrick'),
  grib = document.getElementById('grib'),
  coin = document.getElementById('coin'),
  walkFrame = 0,
  monsterCount = 0;
var maingame, mainstat, gametimer, walkTimer;
var player = {},
  monsters = [],
  treasures = [],
  cells = [];
player.velocityx = 0;
player.velocityy = 0;
player.x = 2;
player.y = 14;
player.mass = 3;
player.points = 0;
player.lives = 100;
player.invun = false;
player.spawnpointx = 0;
player.spawnpointy = 0;
player.dead = false
//ReadyToJump, IsJumpimg, Descending
player.jumpstate = 'ReadyToJump';
var portalcnt = true
var portal = {}
portal.x = []
portal.y = []
portal.opened = false
player.lastDirection = 'right'
// v = p/m
var enemyposx = [],
  enemyposy = [],
  enemyvel = [],
  enemydirection = [],
  enemywalked = [];
var enemyHandler = {
  enemyvel,
  enemyposx,
  enemyposy,
  enemydirection,
  enemywalked
}
//Карта уровня. 0 - пустота, 1-тайл, 2-сокровище, 3-враг.
var level0_0 = [
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  'b00000000000000000000000000000001111111111111111111111000002111b',
  'b00000000000000000001000000000000001000000000000000000000111100b',
  'b00500000000000000100100000000000001000000000000000000000000000b',
  'b11100000000100000000010000000100000000000000100000000010000000b',
  'b00103000000000001000000000000000000000000000000010000010000000b',
  'b00111111000000000000000000000000000000000000000010000010000000b',
  'b00000000000000010000000000000010010000000100000011001110000000b',
  'b00000000000030000000000000000100001000000000000001001000000000b',
  'b00000000011111000000000000000000001001000000000001001000000000b',
  'b00020000000020000000000000000000001000000000000001001000000000b',
  'b00011000000010000000000000000000001000010000000001001000000000b',
  'b00010000000000000300000000000000001000000000000001001000000000b',
  'b00000000000000011111111001001000001000000000000001001000000000b',
  'b00000000002000000000000000000000001000000010000001001000000000b',
  'b00000000000000000000000000000000001000000000000001001000000000b',
  'b00020000000000000000003000000000001000000000000001001000000000b',
  'b00111111111111111111111111110000001000000000010001001000000000b',
  'b00000000000000000000000000000000000000000000000001001000000000b',
  'b00000000000000000000000002000000000000000100000001001000000000b',
  'b00000003000200000000001111110000000000000000000001001000000000b',
  'b01111111111111100000000000000000000000000000000001001000000000b',
  'b00000000000000000300000002000000001001000000000001441000000000b',
  'b01111111111111111111111111110000001000000000000001001000000000b',
  'b00100000000000000000000000000000001000000000000001001000000000b',
  'b00100000000000000000000000000000001000010000000001001000000000b',
  'b00100000000000000000000000000000001000000000000001001000000000b',
  'b00000000000000000000000000000000001000000000000001001000000000b',
  'b00100000000000000000000000000000001000000001000001001000000000b',
  'b00100000000000000000000000000000000000000000000000000000000000b',
  'b00000000000000000300000000000003330000000300000000000000000000b',
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb ',
]
var level0_1 = [
  '1111111111111111111111111111111111111111111111111111111111111111',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000100000000000000000',
  '0000000000000000000000000000000000000000000000400000000000000000',
  '0000000000000000000000000000000000000000000000400000000000000000',
  '0000000000000000000000000000000000000000000000400000000000000000',
  '1000000000000000000000000000000010000010000000100000000000000000',
  '1000000000000000000000000100000000000000000000000000000000000000',
  '1000000000000000000000000000000000000000000000000000000000000000',
  '1000000000000000001000000000000000000000000000000000000000000000',
  '1000000000000000000000000000000000000000000000011000000000000000',
  '1000000000000100000000000000000000000000000000000000000000000000',
  '1000500200000000000000000000000030000000000000300000000000000000',
  '1001111110000000000001110000000111111111111111110000000000000000',
  '1000000000000000000000000000000000000000000000000000000000000000',
  '1030300300300300300300300300300300300000000000000000000030030001',
  '1111111111111111111111111111111111111111111111111111111111111111 ',
]

var level0_2 = [
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000100000000000000000',
  '0000000000000000000000000000000000000000000000400000000000000000',
  '0000000000000000000000000000000000000000000000400000000000000000',
  'b0000000000000000000000000000000000000000000000400000000000000000',
  'b000000000000000000000000000000010000010000000100000000000000000',
  'b000000000000000000000000100000000000000000000000000000000000000',
  'b000000000000000000000000000000000000000000000000000000000000000',
  'b000000000000000001000000000000000000000000000000000000000000000',
  'b000000000000000000000000000000000000000000000011000000000000000',
  'b000000000000100000000000000000000000000000000000000000000000000',
  'b000500200000000000000000000000000000000000000000000000000000000',
  'b001111110000000000001110000000000000000000000000000000000000000',
  'b000000000000000000000000000000000000000000000000000000000000000',
  'b030300300300300300300300300300300300000000000000000000030030001',
  'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb ',

]
var levels = [level0_0, level0_1, level0_2]
var level = createMatrix(level0_0)

function createMatrix(tocopy) {
  array = []
  for (let i = 0; i < tocopy.length; i++) {
    secondaryArray = []
    for (let k = 0; k < tocopy[0].length; k++) {
      secondaryArray.push(tocopy[i][k])
    }
    array.push(secondaryArray)
  }
  return array
}

function DrawLevel(todraw) {
  ctx.fillStyle = '#FFFFFF'
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  //Отрисовка уровня
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[1].length; j++) {
      switch (level[i][j]) {
        case '0':
          //пустота
          ctx.fillStyle = '#7ec0ee'
          ctx.fillRect(j * 16, i * 16, 16, 16)
          break;
        case '1':
          //стена
          ctx.drawImage(imagebrick, j * 16, i * 16, 16, 16)
          break;
        case '2':
          //сокровище
          ctx.drawImage(coin, j * 16, i * 16, 16, 16)
          break;
        case '3':
          //враг
          console.log('A');
          enemyposx.push(j);
          enemyposy.push(i);
          enemyvel.push(0);
          enemydirection.push('right')
          enemywalked.push(0)
          monsterCount++
          level[i][j] = '0'
          ctx.fillStyle = 'red'
          ctx.fillRect(j * 16, i * 16, 16, 16)
          break;
        case '4':
          //Выход
          if (portalcnt) {
            portal.x.push(j)
            portal.y.push(i)
          }
          if (portal.opened) {
            ctx.fillStyle = '#AA00AA'
            ctx.fillRect(j * 16, i * 16, 16, 16)
          } else {
            ctx.fillStyle = '#7ec0ee'
            ctx.fillRect(j * 16, i * 16, 16, 16)
          }
          break;
        case '5':
          //игрок
          if (!enrty) {
            player.x = j
            player.y = i
            player.spawnpointx = j
            player.spawnpointy = i
            level[i][j] = '0'
            ctx.fillStyle = 'red'
            ctx.fillRect(j * 16, i * 16, 16, 16)
          }
          break;
        case 'b':
          ctx.drawImage(imagebackbrick, j * 16, i * 16, 16, 16)
          break;
      }
    }
  }
  portalcnt = false
}

function onkey(e) {
  //обработка нажатий
  switch (e.key) {
    case 'ArrowLeft':
      if (e.type == 'keydown') {
        player.left = true
      } else {
        player.left = false;
      }
      break;
    case 'ArrowRight':
      if (e.type == 'keydown') {
        player.right = true
      } else {
        player.right = false;
      }
      e.preventDefault();
      break;
    case 'ArrowUp':
      if (e.type == 'keydown') {
        player.jump = true
      } else {
        player.jump = false;
      }
      e.preventDefault();
      break;
  }
}

function updatePlayer() {
  if (player.lives <= 0) {
    killPlayer()
  }
  //Перемещение и коллизия игрока
  if ((!player.left) & (!player.right)) {
    //если кнопки горизонтального движения не нажаты, трение уменьшает скорость
    if (player.velocityx > 0) {
      player.velocityx -= friction
    } else {
      player.velocityx += friction
    }
    if ((player.velocityx < 0.05) && (player.velocityx > -0.05)) {
      //если скорость достаточно мала - округлить до нуля
      player.velocityx = 0
    }
  }
  //ускорение в соответствующую сторону, при условии что текущая скорость не превышает максимальную
  if (player.left) {
    player.lastDirection = 'left'
    if (!(player.velocityx - accel < -maxvelx)) {
      player.velocityx -= accel;
    } else {
      player.velocityx = -maxvelx
    }
    //Проверка коллизии при двежении вправо
    if (
      level[Math.round(player.y)][Math.floor(player.x - 0.05 + player.velocityx)] == 1 ||
      level[Math.round(player.y - 0.5)][Math.floor(player.x - 0.05 + player.velocityx)] == 1 ||
      level[Math.round(player.y)][Math.floor(player.x - 0.05 + player.velocityx)] == 'b' ||
      level[Math.round(player.y - 0.5)][Math.floor(player.x - 0.05 + player.velocityx)] == 'b'
    ) {
      player.x += 0.01
      player.velocityx = 0
    }
  }
  if (player.right) {
    player.lastDirection = 'right'
    if (!(player.velocityx + accel > maxvelx)) {
      player.velocityx += accel;
    } else {
      player.velocityx = maxvelx
    }
    //Проверка коллизии при двежении влево
    if (
      level[Math.round(player.y)][Math.floor(player.x + 1 + player.velocityx)] == 1 ||
      level[Math.round(player.y - 0.5)][Math.floor(player.x + 1 + player.velocityx)] == 1 ||
      level[Math.round(player.y)][Math.floor(player.x + 1 + player.velocityx)] == 'b' ||
      level[Math.round(player.y - 0.5)][Math.floor(player.x + 1 + player.velocityx)] == 'b'
    ) {
      player.x -= 0.005
      player.velocityx = 0
    }
  }
  //Прыжок
  if (player.jump) {
    //Проверка состояния фазы прыжка
    if (player.jumpstate == 'ReadyToJump') {
      player.velocityy = parseFloat((impulse / player.mass).toFixed(3))
      player.jumpstate = 'IsJumpimg'
    }
  }

  switch (player.jumpstate) {
    case 'IsJumpimg':
      //Проверка столкновенияя при движении вверх
      player.velocityy -= gravity
      if (
        level[Math.ceil((player.y - player.velocityy))][Math.ceil(player.x)] == 1 ||
        level[Math.ceil((player.y - 0.5 - player.velocityy))][Math.ceil(player.x)] == 1 ||
        level[Math.floor((player.y - player.velocityy))][Math.floor(player.x)] == 1 ||
        level[Math.floor((player.y - player.velocityy))][Math.floor(player.x)] == 1 ||
        level[Math.ceil((player.y - player.velocityy))][Math.ceil(player.x)] == 'b' ||
        level[Math.ceil((player.y - 0.5 - player.velocityy))][Math.ceil(player.x)] == 'b' ||
        level[Math.floor((player.y - player.velocityy))][Math.floor(player.x)] == 'b' ||
        level[Math.floor((player.y - player.velocityy))][Math.floor(player.x)] == 'b'
      ) {
        player.velocityy = 0
        player.jumpstate = 'Descending'
      }
      if (player.velocityy < 0) {
        player.jumpstate = 'Descending'
      }
      break;
    case 'Descending':
      //При движениив вниз
      if (
        level[Math.round((player.y - player.velocityy))][Math.round(player.x + 0.4)] == 1 ||
        level[Math.floor((player.y + 0.7 - player.velocityy))][Math.round(player.x + 0.4)] == 1 ||
        level[Math.round((player.y + 0.7 - player.velocityy))][Math.floor(player.x)] == 1 ||
        level[Math.floor((player.y - player.velocityy))][Math.round(player.x)] == 1 ||
        level[Math.round((player.y - player.velocityy))][Math.round(player.x + 0.4)] == 'b' ||
        level[Math.floor((player.y + 0.7 - player.velocityy))][Math.round(player.x + 0.4)] == 'b' ||
        level[Math.round((player.y + 0.7 - player.velocityy))][Math.floor(player.x)] == 'b' ||
        level[Math.floor((player.y - player.velocityy))][Math.round(player.x)] == 'b'
      ) {
        player.velocityy = 0;
        player.jumpstate = 'ReadyToJump'
        player.y = Math.round(player.y)
      } else {
        player.velocityy -= gravity
      }
      break;
  }
  if (player.jumpstate == 'ReadyToJump') {
    if (
      level[Math.round((player.y + 0.6))][Math.round(player.x + 0.4)] == 0 &&
      level[Math.round((player.y + 0.6))][Math.round(player.x)] == 0
    ) {
      player.jumpstate = 'Descending'
    }
  }
  //проверка коллизии с врагами
  //Проверяет 5 точек - 4 вершины и середину игрока
  for (let i = 0; i < monsterCount; i++) {
    if (
      ((player.x > enemyposx[i]) && (player.x < enemyposx[i] + 1)) && ((player.y > enemyposy[i] - 1) && (player.y < enemyposy[i])) ||
      ((player.x + 1 > enemyposx[i]) && (player.x + 1 < enemyposx[i] + 1)) && ((player.y > enemyposy[i] - 1) && (player.y < enemyposy[i])) ||
      ((player.x + 1 > enemyposx[i]) && (player.x + 1 < enemyposx[i] + 1)) && ((player.y - 1 > enemyposy[i] - 1) && (player.y - 1 < enemyposy[i])) ||
      ((player.x > enemyposx[i]) && (player.x < enemyposx[i] + 1)) && ((player.y > enemyposy[i] - 1) && (player.y < enemyposy[i])) ||
      ((player.x + 0.5 > enemyposx[i]) && (player.x + 0.5 < enemyposx[i] + 1)) && ((player.y - 0.5 > enemyposy[i] - 1) && (player.y - 0.5 < enemyposy[i]))
    ) {
      if (player.invun == false) {
        player.lives -= 15;
        setTimeout(damagedplayer, 500);
        player.invun = true;
        player.velocityx = -player.velocityx
        player.velocityy = -player.velocityy
      } else {
        player.velocityx = -player.velocityx
        player.velocityy = -player.velocityy
      }
    }
  }
  //проверка столкновения с порталом
  if (portal.opened) {
    for (let i = 0; i < portal.x.length; i++) {
      if (
        ((player.x > portal.x[i]) && (player.x < portal.x[i] + 1)) && ((player.y > portal.y[i]) && (player.y < portal.y[i])) ||
        ((player.x + 1 > portal.x[i]) && (player.x + 1 < portal.x[i] + 1)) && ((player.y > portal.y[i] - 1) && (player.y < portal.y[i])) ||
        ((player.x + 1 > portal.x[i]) && (player.x + 1 < portal.x[i] + 1)) && ((player.y - 1 > portal.y[i] - 1) && (player.y - 1 < portal.y[i])) ||
        ((player.x > portal.x[i]) && (player.x < portal.x[i] + 1)) && ((player.y > portal.y[i] - 1) && (player.y < portal.y[i])) ||
        ((player.x + 0.5 > portal.x[i]) && (player.x + 0.5 < portal.x[i] + 1)) && ((player.y - 0.5 > portal.y[i] - 1) && (player.y - 0.5 < portal.y[i]))
      ) {
        win()
      }
    }
  }
  //окргуление значений для облечения дальнейших вычислений...
  player.velocityx = parseFloat(player.velocityx.toFixed(2))
  player.velocityy = parseFloat(player.velocityy.toFixed(2))
  player.x = parseFloat((player.x + player.velocityx).toFixed(2))
  player.y = parseFloat((player.y - player.velocityy).toFixed(2))
  //  ctx.fillRect(player.x * 16, player.y * 16, 16, 16)
  //Отрисовка соответсвующего спрайта *марио*

  if (player.invun) {
    //При получении урона
    walkFrame = 0;
    ctx.drawImage(imagedamaged, player.x * 16, player.y * 16 - 16, 25, 25)
  } else if (player.jumpstate != 'ReadyToJump') {
    //В прыжке
    walkFrame = 0;
    switch (player.lastDirection) {
      case 'left':
        ctx.drawImage(imagejumpindL, player.x * 16, player.y * 16 - 16, 16, 32)
        break;
      case 'right':
        ctx.drawImage(imagejumpindR, player.x * 16, player.y * 16 - 16, 16, 32)
        break;
    }
  } else if (player.right || player.left) {
    if (walkFrame == 0) {
      walkFrame = 1
    }
    //При движении вправо влево
    switch (walkFrame) {
      case 1:
        if (player.right) {
          ctx.drawImage(imagewalking1R, player.x * 16, player.y * 16 - 16, 16, 32)
        }
        if (player.left) {
          ctx.drawImage(imagewalking1L, player.x * 16, player.y * 16 - 16, 16, 32)
        }
        break;
      case 2:
        if (player.right) {
          ctx.drawImage(imagewalking2R, player.x * 16, player.y * 16 - 16, 16, 32)
        }
        if (player.left) {
          ctx.drawImage(imagewalking2L, player.x * 16, player.y * 16 - 16, 16, 32)
        }
        break;
      case 3:
        if (player.right) {
          ctx.drawImage(imagewalking3R, player.x * 16, player.y * 16 - 16, 16, 32)
        }
        if (player.left) {
          ctx.drawImage(imagewalking3L, player.x * 16, player.y * 16 - 16, 16, 32)
        }
        break;

    }
  } else {
    walkFrame = 0;
    //Если стоит
    switch (player.lastDirection) {
      case 'left':
        ctx.drawImage(imagestandingL, player.x * 16, player.y * 16 - 16, 16, 32)
        break;
      case 'right':
        ctx.drawImage(imagestandingR, player.x * 16, player.y * 16 - 16, 16, 32)
        break;
    }
  }
}

function updateMonster() {
  if (monsterCount > 0) {
    //Монстр ходит по платформам вправо-влево до тех пор, пока в след. тайле не окажется платформы или он не пройдёт заранее органиченную для него обасть перемещения
    for (let i = 0; i < monsterCount; i++) {
      switch (enemydirection[i]) {
        case 'right':
          if (!(enemyvel[i] + accel > maxvelx)) {
            enemyvel[i] += accel
          }
          if (
            level[Math.round(enemyposy[i]) + 1][Math.round(enemyposx[i] + enemyvel[i]) + 1] == '0' ||
            level[Math.round(enemyposy[i])][Math.round(enemyposx[i] + enemyvel[i]) + 1] == '1' ||
            level[Math.round(enemyposy[i])][Math.round(enemyposx[i] + enemyvel[i]) + 1] == 'b'
          ) {
            enemydirection[i] = 'left'
          }
          break;
        case 'left':
          if (!(enemyvel[i] - accel < -maxvelx)) {
            enemyvel[i] -= accel
          }
          if (
            level[Math.round(enemyposy[i]) + 1][Math.round(enemyposx[i] + enemyvel[i]) - 1] == '0' ||
            level[Math.round(enemyposy[i])][Math.round(enemyposx[i] + enemyvel[i]) - 1] == '1' ||
            level[Math.round(enemyposy[i])][Math.round(enemyposx[i] + enemyvel[i]) - 1] == 'b'
          ) {
            enemydirection[i] = 'right'
          }
      }
      enemyposx[i] = parseFloat((enemyposx[i] + enemyvel[i]).toFixed(2))
      // ctx.fillStyle = 'red'
      // ctx.fillRect(enemyposx[i] * 16, enemyposy[i] * 16, 16, 16)
      ctx.drawImage(grib, enemyposx[i] * 16, enemyposy[i] * 16, 20, 17)
    }
  }
}

function checkTreasure() {
  //коллизия с сокровищем
  for (let i = 0; i < 8; i++) {
    if (level[Math.round(player.y)][Math.round(player.x)] == '2') {
      level[Math.round(player.y)][Math.round(player.x)] = '0';
      player.points++
      if (player.lives + 15 >= 100) {
        player.lives = 100
      } else {
        player.lives += 15
      }
    }
  }
  if (player.points >= pointreqiured) {
    portal.opened = true
  }
}

function damagedplayer() {
  player.invun = false;
  player.x = player.spawnpointx;
  player.y = player.spawnpointy;
}

function update() {
  DrawLevel(level0_0)
  updatePlayer()
  updateMonster()
  checkTreasure()
}

function killPlayer() {
  player.dead = true
  let deathscreen = document.createElement('div')
  deathscreen.className = 'deathscreen'
  deathscreen.id = 'dth1'
  deathscreen.innerHTML = ' <h2> Вы умерли! </h2> <p>Страница перезагрузится через 5 секунд</p>'
  document.getElementById('cv').append(deathscreen)
  setTimeout(reload, 5000)
  clearInterval(maingame)
  clearInterval(mainstat)
  clearInterval(timer)
}

function win() {
  let winscreen = document.createElement('div')
  winscreen.className = 'winscreen'
  winscreen.id = 'dth1'
  winscreen.innerHTML = ' <h2> Вы выйграли! </h2> <p>Страница перезагрузится через 5 секунд</p>'
  document.getElementById('cv').append(winscreen)
  setTimeout(reload, 5000)
  clearInterval(maingame)
  clearInterval(mainstat)
  clearInterval(timer)
}

function reload() {
  window.location.reload(true)
}

function status() {
  datapar.innerText = 'Жизни: ' + player.lives + '  Очки: ' + player.points + '\n' + 'Время: ' + minutes + ':' + seconds
}

function GameStart() {
  document.getElementById('btn-start').remove()
  document.getElementById('cv').style.display = 'grid'
  maingame = setInterval(update, 17)
  mainstat = setInterval(status, 100)
  gametimer = setInterval(timer, 1000)
  walkTimer = setInterval(updateWalk, 200)
}

function updateWalk() {
  walkFrame += 1
  if (walkFrame > 3) {
    walkFrame = 1
  }
  console.log('FRAME ' + walkFrame);
}

function timer() {
  seconds++
  player.lives--
  if (seconds == 60) {
    minutes++
    seconds = 0
  }
}

document.addEventListener('keydown', onkey)
document.addEventListener('keyup', onkey)
