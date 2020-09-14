
var keypressed
var IsJumpning = false;
var IsDescending = false; 
var Lives = 3;
var Points = 0;
var CurrentLevel = 1;
var EnemyCount = 1; 
var MoneyCount = CurrentLevel+EnemyCount+7
var GameSpace = document.getElementById('gs')
var EnemyCoordinates = []
var DefeatedEnemyCount  = 0
var MovementDirection = 'left'
var LenghtWalked = 0
var Counter = 0
var Win = false
// 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fsupermariobrothersx%2Fimages%2Ff%2Ff4%2FGreenkoopa.gif%2Frevision%2Flatest%2Fscale-to-width-down%2F300%3Fcb%3D20180109221036&f=1&nofb=1'
// 'download.gif'

/*
Длина земли в пикселях 
*/
var EarthLength = 5000
document.body.style.width = EarthLength + 10+ 'px'
/* 
GameZone - игровая зона, всё спавнится в этой зоне  
*/
var GameZone = [10, EarthLength]

/*      
JumpFrames - кадр прыжка, определяет время в прыжке
JumpFrameCurrent - Текущий кадр прыжка, определяет изменение 
высоты игрока в данный кадр прыжка
*/
var JumpFrames = 5;
var JumpFrameCurrent = 0;
var PlatformCount = 10; 
var PlatformCoordinates = []
for(let i = 10; i < EarthLength-100; i+=50){
    PlatformCoordinates.push(i)
}
var PossibleMoneyPositions = []
for(let i = 0; i < EarthLength-100; i+=50){
    PossibleMoneyPositions.push([i,20])
}
var MoneyCoordinates = []
/* Отображает кол-во врагов на весь уровень,
 на экране всегда максимум 1 враг */
var EnemyCount = 3;
var StoredPlatformCoordinates = []

//Убийство врага повышает уровень агрессивонсти на 0.5, т.е. 2 убийства - повышение сложности
PlayerPositionHorisontal = 210;
PlayerPositionVertical = 10;
document.getElementById('1-ps').style.left = PlayerPositionHorisontal+'px';
document.getElementById('1-ps').style.bottom = PlayerPositionVertical+'px';
document.getElementById('1-eh').style.width = EarthLength+'px'
VictoryFlag = document.createElement('div')
VictoryFlag.className = 'VicFlag'
document.getElementById('gs').append(VictoryFlag)
document.addEventListener('keypress',KeyHandler);
GeneratePlatforms()

GenerateEnemy()

PlayerStatusManagment()
var GameTimer =  setInterval(TimedHandler, 200)