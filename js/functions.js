function KeyHandler(e){
    //Обработка нажатий
    keypressed = e.key
    }   

function Jump(){
    //Обработка прыжка игркока
    let velocity 
    switch( JumpFrameCurrent ){
        case 1:
            velocity = 150 
            break
        case 2:
            velocity = 100
            break
        case 3: 
            velocity = 50 
            break
        case 4:
            velocity = 25    
            break
        case 5:
            velocity = 0
            IsJumpning = false
            IsDescending = true
            break
    } 
    //console.log('Current Jump Frame:', JumpFrameCurrent)
    if( !Collision(PlayerPositionVertical, 'vertical', velocity) ){
        PlayerPositionVertical = PlayerPositionVertical+velocity;
        document.getElementById('1-ps').style.bottom = PlayerPositionVertical + "px"
        JumpFrameCurrent+=1;
    } else {
        console.log('Col')
        IsJumpning = false
        PlayerPositionVertical -= 100
        document.getElementById('1-ps').style.bottom = PlayerPositionVertical + 'px'
    }
}

function AssignDirection(){
    switch(keypressed){
        case 'w':
            if((IsJumpning == true) & (IsDescending == true)) {
                //игнорировать нажатие, если в прыжке 
                break
            } else if((IsJumpning == false) & (IsDescending == false)){
                //иначе инициация прыжка
                IsJumpning = true
                JumpFrameCurrent = 1;
                break
            }  
        break

        case 's':
            console.log('Crouch')
        break   
        
        case 'a':
           
            RotatePlayer('l')
            if( !Collision(PlayerPositionHorisontal, 'horisontal', -50)){
                PlayerPositionHorisontal -= 50
                document.getElementById('1-ps').style.left = PlayerPositionHorisontal+'px';
                break
            }
        break
 
        case 'd':
          
            RotatePlayer('r')
            if( !Collision(PlayerPositionHorisontal, 'horisontal', 50) ){
                PlayerPositionHorisontal += 50
                document.getElementById('1-ps').style.left = PlayerPositionHorisontal+'px';
                break
            }
            break
        }
        keypressed = 'none'
}

function Descend(){
    //Обработка падения игрока 
    if(!Collision(PlayerPositionVertical, 'vertical', -50)){
        PlayerPositionVertical -= 50
        if(PlayerPositionVertical <= 35){
            PlayerPositionVertical = 10;
        }
        document.getElementById('1-ps').style.bottom = PlayerPositionVertical + "px"
    } else {
        IsDescending = false
    }
}

function Collision(CurrentPos,Orient,Change){
    //определение направления провеки сталкновения
    //приоритет проверки столкновений земля > окружение > враг 
    if(Orient == 'vertical'){     
        let FVPos = CurrentPos + Change
        let FVPlayerCenter = [PlayerPositionHorisontal+50, FVPos+25]
        for(let j = 0; j < MoneyCoordinates.length; j++){
            if( 
                (FVPlayerCenter[0] > MoneyCoordinates[j][0]) 
                &
                (FVPlayerCenter[0] < MoneyCoordinates[j][0]+80) 
                 ){
                    if(
                        (FVPlayerCenter[1] > MoneyCoordinates[j][1]) 
                        &
                        (FVPlayerCenter[1] < MoneyCoordinates[j][1]+80) 
                         ){
                            console.log('Collected money on coordinates ', MoneyCoordinates[j], 'id - '+j)
                            if( !(document.getElementById(j).style.display == 'none')){
                                document.getElementById(j).style.display = 'none'
                                Points++
                            }
                        }
            }
        }   

        //Обработка столкновений на вертикальной сои 
        //Первая проверка столконения - с землёй
            if( (FVPos == 9) || (FVPos < 10) ){
                return true
            }
        
            //Проверка столкновения с платформой
            for(let j = 0; j < StoredPlatformCoordinates.length; j++){
                if(((
                    PlayerPositionHorisontal >= StoredPlatformCoordinates[j][0][0]) & (PlayerPositionHorisontal <= StoredPlatformCoordinates[j][3][0]-1
                    ))
                    & 
                    ((
                    FVPos >= StoredPlatformCoordinates[j][0][1]-30) & (FVPos <= StoredPlatformCoordinates[j][3][1]+30
                    ))){
                    PlayerPositionVertical = 260
                    JumpFrameCurrent = 0;
                    IsDescending = true;
                    return true
                }
            }

            if( Change < 0 ){
                if(((
                    PlayerPositionHorisontal >= EnemyCoordinates-10) & (PlayerPositionHorisontal <= EnemyCoordinates+50
                    ))
                    & 
                    ((
                    FVPos >= 10) & (FVPos <= 80
                    ))){
                        KillEnemy()
            }}

            return false
    } else {
       
        //Обработка столкновений на горизонтальной оси
        let FHPos = CurrentPos + Change
        let FHPlayerCenter = [FHPos+25 , PlayerPositionVertical+50]

        //Проверка столкновения с монетой
        for(let j = 0; j < MoneyCoordinates.length; j++){
            if( 
                (FHPlayerCenter[0] > MoneyCoordinates[j][0]) 
                &
                (FHPlayerCenter[0] < MoneyCoordinates[j][0]+80) 
                 ){
                    if(
                        (FHPlayerCenter[1] > MoneyCoordinates[j][1]) 
                        &
                        (FHPlayerCenter[1] < MoneyCoordinates[j][1]+80) 
                         ){
                            console.log('Collected money on coordinates ', MoneyCoordinates[j], 'id - '+j)
                            if( !(document.getElementById(j).style.display == 'none')){
                                document.getElementById(j).style.display = 'none'
                                console.log(MoneyCoordinates)
                                Points++
                            }
                        }
            }
        }   

        //Проверка столконения с левой границей
        if( (FHPos == 9) || (FHPos < 10) ){
            return true
        } 

        //Проверка столкновения с платформой
        for(let j = 0; j < StoredPlatformCoordinates.length; j++){
            if(((
                FHPos >= StoredPlatformCoordinates[j][0][0]) & (FHPos <= StoredPlatformCoordinates[j][3][0]-1
                ))
                & 
                ((
                PlayerPositionVertical >= StoredPlatformCoordinates[j][0][1]) & (PlayerPositionVertical <= StoredPlatformCoordinates[j][3][1]
                ))){
                    PlayerPositionVertical = 260;
                    return true
        }}
        return false
    }
}
function KillEnemy(){
    document.getElementById(DefeatedEnemyCount+'em').style.backgroundImage = "url('download.gif')"
    document.getElementById(DefeatedEnemyCount+'em').id = DefeatedEnemyCount + 'deadt'
    DefeatedEnemyCount++
    GenerateEnemy()
}

function PlayerStatusManagment(){
    //Менеджмент состояний игрока
    document.getElementById('points').innerText = " Очки - " + Points + " ";
    document.getElementById('life').innerText = '' + Lives + '' 
}

function TimedHandler(){
    //вызывается через промежутки времени, выполняет активные функции.
    if(IsJumpning == true){
        Jump()
    } 
    if(IsDescending == true){
        Descend()
    }
    AssignDirection()
    PlayerStatusManagment()
    DrawJumpState()
    if( (IsJumpning == false) & (IsDescending == false) ){
        CheckIfAbovePlatform()  
    }

    if(Counter == 3){
        Counter = 0
        ControlEnemy()
    } else {
        Counter += 1
    }

    if(Points >= MoneyCount){
        if(!Win){
            GenerateExit()
        }
    }
}

function GenerateEnemy(){
    //Генерация врага, определеяется тип, цвет, позиция и агрессивность
    //На экране может быть не более 1 врага...
    console.log('Generating enemy...')
    let  Coordinates = GetRandomNumber(5, PlatformCoordinates.length-4)
    EnemyCoordinates = PlatformCoordinates[Coordinates]
    console.log(EnemyCoordinates)
    let TurtleDiv = document.createElement('div')
    TurtleDiv.id = DefeatedEnemyCount+'em'
    TurtleDiv.className = 'turtle'
    TurtleDiv.style.bottom = 10+'px'
    TurtleDiv.style.left = EnemyCoordinates+'px'
    TurtleDiv.style.backgroundImage  = "url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fsupermariobrothersx%2Fimages%2Ff%2Ff4%2FGreenkoopa.gif%2Frevision%2Flatest%2Fscale-to-width-down%2F300%3Fcb%3D20180109221036&f=1&nofb=1')"
    document.getElementById('gs').append(TurtleDiv)
}


function RotatePlayer(direction){
    //изменяет направления спрайта игрока в зависимости от направления движения
    switch(direction){
        case 'r':
            if(PlayerPositionHorisontal <= 210){
                document.getElementById('1-pimg-walk').style.transform = 'scaleX(1)'
                document.getElementById('1-pimg-jump').style.transform = 'scaleX(1)'
                break
            }else{
                GameSpace.scrollLeft += 50
                document.getElementById('1-pimg-walk').style.transform = 'scaleX(1)'
                document.getElementById('1-pimg-jump').style.transform = 'scaleX(1)'
                break
            }
            break
        case 'l':
            if(PlayerPositionHorisontal <= 210){ 
                document.getElementById('1-pimg-walk').style.transform = 'scaleX(-1)'
                document.getElementById('1-pimg-jump').style.transform = 'scaleX(-1)'
            }else{    
                GameSpace.scrollLeft -= 50
                document.getElementById('1-pimg-walk').style.transform = 'scaleX(-1)'
                document.getElementById('1-pimg-jump').style.transform = 'scaleX(-1)'
                break
            }    
            break
    }
}

function DrawJumpState(){
    //Выбирает, какую картинку марио отобразить - в прыжке или стоя 
            if(IsJumpning){
                document.getElementById('1-pimg-walk').style.display = 'none' 
                document.getElementById('1-pimg-jump').style.display = 'inline'
            } else {
                document.getElementById('1-pimg-walk').style.display = 'inline' 
                document.getElementById('1-pimg-jump').style.display = 'none'    
            }
}

function GeneratePlatforms(){
    console.log('Generating platforms...')
    let MoneyCoordinatesSelector
    let PlatformCoordinatesSelector
    let Coordinates 
    //Генерирует на экране платформы и монеты
    for(let i = 0; i < PlatformCount; i++){
        /*
        Выбор позиции для генерируемой платформы из массива со свобдными координатами 
        Выбранна координата удааляется из свободных  
        */
        PlatformCoordinatesSelector = GetRandomNumber(0,PlatformCoordinates.length)
        Coordinates = PlatformCoordinates[PlatformCoordinatesSelector]
        PlatformCoordinates.splice(PlatformCoordinatesSelector,4)
        PossibleMoneyPositions.push([Coordinates+50,280])
        let platform = document.createElement('div')
        platform.className = 'common-platfrom';
        platform.id = 'platform-'+i;
        platform.style.left = Coordinates+'px';
        StoredPlatformCoordinates.push( [
            [Coordinates, 200],
            [Coordinates+150, 200],
            [Coordinates, 250],
            [Coordinates+150, 250] 
        ])
        //Запись 
        document.getElementById('gs').append(platform)
    }
    console.log('Generated ' + PlatformCount + '  platforms')
    //Генерация монет
    for(let i = 0; i < MoneyCount; i++){
        MoneyCoordinatesSelector = GetRandomNumber(0, PossibleMoneyPositions.length)
        Coordinates = [PossibleMoneyPositions[MoneyCoordinatesSelector][ 0], PossibleMoneyPositions[MoneyCoordinatesSelector][1]] 
        let coin = document.createElement('div')
        coin.className = 'coin'
        coin.id = i;
        coin.style.left = Coordinates[0]+'px'
        coin.style.bottom = Coordinates[1]+'px'
        document.getElementById('gs').append(coin)
        MoneyCoordinates.push(Coordinates)
    }   
}

function GetRandomNumber(min,max){
    return Math.floor( Math.random() * (max-min) ) + min
}

function CheckIfAbovePlatform(){
    if(PlayerPositionVertical>10){
        for(let j = 0; j < StoredPlatformCoordinates.length; j++){
            if ((PlayerPositionHorisontal >= StoredPlatformCoordinates[j][0][0]) & (PlayerPositionHorisontal <= StoredPlatformCoordinates[j][1][0])){
                if((PlayerPositionVertical >= StoredPlatformCoordinates[j][0][1]) & (PlayerPositionVertical <= StoredPlatformCoordinates[j][3][1]+60    ) ){
                    PlayerPositionVertical = 285
                }
            }
            else{
                IsDescending = true
            }
            
        }
        }
}

function ScreenScrollLeft(){
    GameSpace.scrollLeft += 50
}


function  ControlEnemy(){
    //Управление движениями врага
    switch(MovementDirection){
        case 'right':
                document.getElementById(DefeatedEnemyCount+'em').style.transform = 'scaleX(-1)'
                EnemyCoordinates += 50
                if( (PlayerPositionHorisontal > EnemyCoordinates-20) & (PlayerPositionHorisontal < EnemyCoordinates+50  ) ){
                    if(PlayerPositionVertical < 100){
                        HitPlayer()
                    }
                }
            break

        case 'left':
                document.getElementById(DefeatedEnemyCount+'em').style.transform = 'scaleX(1)'
                EnemyCoordinates -= 50
                if( (PlayerPositionHorisontal > EnemyCoordinates-20) & (PlayerPositionHorisontal < EnemyCoordinates+50  ) ){
                    if(PlayerPositionVertical < 100){
                        HitPlayer()
                    }
                }
            break
    }
    document.getElementById(DefeatedEnemyCount+'em').style.left = EnemyCoordinates + 'px'
    LenghtWalked += 50
    if(LenghtWalked == 1000){
        if( MovementDirection ==  'left'){
            MovementDirection = 'right'
        } else {
            MovementDirection = 'left'
        }
        LenghtWalked = 0
    }
}

function HitPlayer(direction){
    Lives -= 1
    if(Lives == 0){
        deathscreen()
    }
}

function deathscreen(){
    clearInterval(GameTimer)
    alert('Вы умерли!')
}

function GenerateExit(){
    alert('Уровень пройден!')
    Win = true
}