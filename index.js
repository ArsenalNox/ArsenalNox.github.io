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
  enrty = false;
monsterCount = 0;

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
// v = p/m
var enemyposx = [],
  enemyposy = []
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
  '1111111111111111111111111111111111111111111111111111111111111111',
  '1000000000000000000000000000000011111111111111111111110000021111',
  '1000000000000000000010000000000000010000000000000000000001111001',
  '1005000000000000001001000000000000010000000000000000000000000001',
  '1111000000001000000000100000001000000000000001000000000100000001',
  '1001030000000000010000000000000000100000000000000100000100000001',
  '1001111110000000000000000000000000100000000000000100000100000001',
  '1000000000000000100000000000000100100000001000000110011100000001',
  '1000000000000300000000000000001000010000000000000010010000000001',
  '1000000000111110000000000000000000010010000000000010010000000001',
  '1000200000000200000000000000000000010000000000000010010000000001',
  '1000110000000100100100100100100100010000100000000010010000000001',
  '1000100000000000003000000000000000010000000000000010010000000001',
  '1000000000000011111111110010010000010000000000000010010000000001',
  '1000000300020000000000000030000000010000000100000010010000000001',
  '1111111111111111110011111111111100010000000000000010010000000001',
  '1000200000000000000000030000000000010000000000000010010000000001',
  '1001111111111111111111111111100000010000000000100010010000000001',
  '1000002000000030000000000000000000000000000000000010010000000001',
  '1011111111111111111111110001100000000000001000000010010000000001',
  '1000000030002000000000000000000000000000000000000010010000000001',
  '1011111111111111111111110001100000000000000000000010010000000001',
  '1000000000000000003000000020000000010010000000000014410000000001',
  '1011111111111111111111111111100000010000000000000010010000000001',
  '1001000000000000000000000000000000010000000000000010010000000001',
  '1001000000000000000000000000000000010000100000000010010000000001',
  '1001000000000000000000000000000000010000000000000010010000000001',
  '1000000000000000000000000000000000010000000000000010010000000001',
  '1001000000000000000000000000000000010000000010000010010000000001',
  '1001000000000000000000000000000000000000000000000000000000000001',
  '1000000000000000003000000000000000000000003000000000000000000001',
  '1111111111111111111111111111111111111111111111111111111111111111 ',
]

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
  //Отрисовка уровня, игрок не рисуется этой функцией, за игрока отвечает updatePlayer()
  for (let i = 0; i < level.length; i++) {
    for (let j = 0; j < level[1].length; j++) {
      switch (level[i][j]) {
        case '0':
          //пустота
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(j * 16, i * 16, 16, 16)
          break;
        case '1':
          //стена
          ctx.fillStyle = '#000000'
          ctx.fillRect(j * 16, i * 16, 16, 16)
          break;
        case '2':
          //сокровище
          ctx.fillStyle = '#00cc00'
          ctx.fillRect(j * 16, i * 16, 16, 16)
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
    if (!(player.velocityx - accel < -maxvelx)) {
      player.velocityx -= accel;
    } else {
      player.velocityx = -maxvelx
    }
    //Проверка коллизии при двежении вправо
    if (
      level[Math.round(player.y)][Math.floor(player.x - 0.05 + player.velocityx)] == 1 ||
      level[Math.round(player.y - 0.5)][Math.floor(player.x - 0.05 + player.velocityx)] == 1
    ) {
      player.x += 0.01
      player.velocityx = 0
    }
  }
  if (player.right) {
    if (!(player.velocityx + accel > maxvelx)) {
      player.velocityx += accel;
    } else {
      player.velocityx = maxvelx
    }
    //Проверка коллизии при двежении влево
    if (
      level[Math.round(player.y)][Math.floor(player.x + 1 + player.velocityx)] == 1 ||
      level[Math.round(player.y - 0.5)][Math.floor(player.x + 1 + player.velocityx)] == 1
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
        level[Math.floor((player.y - player.velocityy))][Math.floor(player.x)] == 1
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
        level[Math.floor((player.y - player.velocityy))][Math.round(player.x)] == 1
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
        if (player.lives <= 0) {
          killPlayer()
        }
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
  if (player.invun == true) {
    ctx.fillStyle = 'orange';
  } else {
    ctx.fillStyle = 'blue';
  }
  ctx.fillRect(player.x * 16, player.y * 16, 16, 16)
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
            level[Math.round(enemyposy[i])][Math.round(enemyposx[i] + enemyvel[i]) + 1] == '1'
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
            level[Math.round(enemyposy[i])][Math.round(enemyposx[i] + enemyvel[i]) - 1] == '1'
          ) {
            enemydirection[i] = 'right'
          }
      }
      enemyposx[i] = parseFloat((enemyposx[i] + enemyvel[i]).toFixed(2))
      ctx.fillStyle = 'red'
      ctx.fillRect(enemyposx[i] * 16, enemyposy[i] * 16, 16, 16)
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
  if (!player.dead) {
    DrawLevel(level0_0)
    updatePlayer()
    updateMonster()
    checkTreasure()
  }

}

function killPlayer() {
  player.dead = true
  let deathscreen = document.createElement('div')
  deathscreen.className = 'deathscreen'
  deathscreen.id = 'dth1'
  deathscreen.innerHTML = ' <h2> Вы умерли! </h2> <p>Страница перезагрузится через 5 секунд</p>'
  document.getElementById('cv').append(deathscreen)
  setTimeout(reload, 5000)
}

function win() {
  let winscreen = document.createElement('div')
  winscreen.className = 'winscreen'
  winscreen.id = 'dth1'
  winscreen.innerHTML = ' <h2> Вы выйграли! </h2> <p>Страница перезагрузится через 5 секунд</p>'
  document.getElementById('cv').append(winscreen)
  setTimeout(reload, 5000)
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
  var maingame = setInterval(update, 17)
  var mainstat = setInterval(status, 100)
  var gametimer = setInterval(timer, 1000)
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
