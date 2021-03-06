'use strict'
import * as garage from '/src/garage.js'; // Гараж
import * as speakWithBoss from '/src/speakWithBoss'; //диалог с Боссом
import * as carShop from '/src/buyCar' // Покупка машины (массив со всеми машинами)


let load = document.querySelector('.load');
  window.addEventListener('load', () => {
    load.classList.add('hidden');
  })


 export const score = document.querySelector('.score'), // очки
  start = document.querySelector('.start'), // кнопка старта
  gameArea = document.querySelector('.gameArea'), // игровое поле
  car = document.createElement('div'), //авто игрока 
  rec = document.querySelector('.record'), //авто противников 
  complexity = document.querySelector('.complexity'), //поле выбора сложности
  bgArea = document.querySelector('.backgroundArea'), //фон с домиками
  compRange = document.querySelector('#complexityRange'), //Range выбора сложности 
  garageBtn = document.querySelector('.btnGarage'), //Кнопка "Открыть гараж"
  btnGarageClose = document.querySelector('.btnGarageClose'), //Кнопка "Закрыть гараж"
  garageWrap = document.querySelector('.garage'), //Гараж (модалка)
  garageWrapCar = document.querySelector('.garage__wrap'); //Гараж (обёртка для машин)

// ID функции - прорисовщика
  let myReq, secondMyReq;
// Массив с рекордами
  let record = [];

  // Открытие / Закрытие гаража
  garageBtn.addEventListener('click', () => garage.openGarage(garageWrap));
  btnGarageClose.addEventListener('click', () => garage.closeGarage(garageWrap));

 
// Фоновая песня (Пока что просто объект Audio)
let audio = new Audio();

car.classList.add('car');

// Начало по нажатии на Enter 
export function enterGame(e) {
  if (e.code === 'Enter') {
    startGame();
  }
}

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 3
};

// Разговор с боссом

  speakWithBoss.firstSpeakWithAngry();



carShop.buyCarCar(Object.values(carShop.carArray[0]));
carShop.buyCarCar(Object.values(carShop.carArray[1]));


// Фоновая музыка


// function playSound() {
//   audio.src = '/src/audio/1.mp3'; // Указываем путь к звуку "клика"
//   audio.autoplay = true; // Автоматически запускаем
// }

function stopSound() {
  audio.pause();
  audio.currentTime = 0.0;
}

function startGame() {

  // playSound()
  // Скрываем сложность и "Нажатие на старт"
  complexity.classList.add('hide');
  start.classList.add('hide');
  // Убираем нажатие на Enter 
  document.removeEventListener('keydown', enterGame);
  // Скорость = выбранная сложность
  setting.speed = +compRange.value;

  setting.start = true;
  // Очищаем игровое поле перед стартом игры
  gameArea.innerHTML = '';
  bgArea.innerHTML = '';

  car.style.left = 125 + 'px';
  car.style.top = 80 + '%';

  // Полосы(имитация дороги)
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    // Позиции каждой черты(не путать с движением. Это просто расположение)
    line.style.top = i * 80 + 'px';
    // .y понадобится для движения дороги
    line.y = i * 82;
    gameArea.appendChild(line);
  }

  // Фон
  for (let i = 0; i < 5; i++) {
    const house = document.createElement('div');
    house.classList.add('house');
    house.style.backgroundImage = 'url("./src/image/kaktus.png")';
    // Позиции каждой черты(не путать с движением. Это просто расположение)
    house.style.top = (i * 82) * -1 + 'px';
    let ans = Math.random() * (bgArea.offsetWidth - 100);
    if (ans > 900 || ans < 400) {
      house.style.left = ans + 'px';
    }
    // .y понадобится для движения дороги
    house.y = i * 120;
    bgArea.appendChild(house);
  }


  // Движение машин
  for (let i = 1; i < 4; i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.top = (i * 100) + 'px';
    // Больше значение трафика - дольше друг от друга машины
    enemy.y = -1 * 100 * setting.traffic * i + 1;
    console.log(enemy.y)
    enemy.style.top = enemy.y + 'px';
    // По оси Х рандомное расположение 
    enemy.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    gameArea.appendChild(enemy);
  }
  // Сброс очков 
  setting.score = 0;
  // Добавление авто
  gameArea.appendChild(car);
  // Фиксирование позиции авто 
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  playGame();
}

function playGame() {
  if (setting.start) {
    
    setting.score += setting.speed;
    score.textContent = setting.score;
    moveRoad();
    moveEnemy();
    moveBg();
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= carShop.carPlayerSpeed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += carShop.carPlayerSpeed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= carShop.carPlayerSpeed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += carShop.carPlayerSpeed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    // Функция повторяет прорисовку самой себя
    myReq = requestAnimationFrame(playGame);
  }
  if(setting.score > 1998 && setting.score < 2005){
    stopGame();
    speakWithBoss.firstSpeakWithAngry();
    setting.score +=15;
  }
}





// Если нажата кнопка - её значение в массиве становится true 
// и срабатывает обработчик по движению в опр. сторону
function startRun(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function stopRun(e) {
  keys[e.key] = false;
}




function moveRoad() {
  // Получаем все линии по тегу line
  let lines = document.querySelectorAll('.line');
  for (let key of lines) {
    // Каждой линии прибавляем скорость движения и пробрасываем в стили через .у
    key.y += setting.speed;
    key.style.top = key.y + 'px';
    // Если отступ линии сверзу больше, чем игровое поле - линия уходит наверх
    if (parseInt(key.style.top) > (gameArea.offsetHeight)) {
      key.y = -82;
    }
  }
}
// Движение фона 
 function moveBg() {
  // Получаем все линии по тегу house
  let houses = document.querySelectorAll('.house');
  for (let key of houses) {
    // Каждой линии прибавляем скорость движения и пробрасываем в стили через .у
    key.y += setting.speed;
    key.style.top = key.y + 'px';
    // Если отступ линии сверзу больше, чем игровое поле - линия уходит наверх
    if (parseInt(key.style.top) > (gameArea.offsetHeight)) {
      key.y = -120;
      // Положение по X  - полная ширина минус ширина элемента
      let ans = Math.random() * (bgArea.offsetWidth - 100);
      if (ans > 900 || ans < 400) {
        key.style.left = ans + 'px';
      }
    }
  }
}

function moveEnemy() {
  let enemys = document.querySelectorAll('.enemy');
  // Получение позиции авто и противников
  for (let key of enemys) {
    // Получаем позицию авто игрока и противников 
    let carRect = car.getBoundingClientRect();
    let enemyRect = key.getBoundingClientRect();
    // Если координаты перескаются - событие окончания игры
    if (carRect.top < enemyRect.bottom && carRect.right > enemyRect.left &&
      carRect.left < enemyRect.right && carRect.bottom > enemyRect.top) {
      setting.start = false;
      start.classList.remove('hide');
      complexity.classList.remove('hide');
      // Останавливаем песню
      stopSound();
      // Добавляем рекорд в массив и выводим в div
      record.push(setting.score);
      rec.innerHTML = 'Рекорд = ' + Math.max(...record);
      // Возвращаем нажатие на Enter
      document.addEventListener('keydown', enterGame);
    }
    // Прибавляем каждой машине скорость и пробрасываем в стили с помощью .y
    key.y += setting.speed;
    key.style.top = key.y + 'px';
    // Если мащина ушла вниз - пробрасываем наверх с изменением позиции по X 
    if (key.y > document.documentElement.clientHeight) {
      key.y = -100 * setting.traffic;
      key.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
      let im = Math.round(Math.random() * 3) + 1;
      key.style.background = `url('/src/srcimage/enemy/${im}.webp') center / cover no-repeat`;
    }
  }
}

// Остановка движения

function stopGame(e = 'Space') {
  if (e.code === 'Space' || e == 'Space'){
    // Отменяем анимацию
    window.cancelAnimationFrame(myReq);
    // Убираем паузу
    document.removeEventListener('keydown', stopGame);
    // Добавляем продолжение игры
    document.addEventListener('keydown', continueGame);
  }
}


// Продолжение движения

function continueGame(e = 'Space') {
  if (e.code === 'Space' || e == 'Space'){
    // Добавляем старт игры
    myReq = window.requestAnimationFrame(playGame);
    // Добавляем паузу
    document.addEventListener('keydown', stopGame);
    // Убираем продолжение (потому что ты только что продолжил, йобана) 
    document.removeEventListener('keydown', continueGame);
    document.removeEventListener('keydown', enterGame);
  }
}

document.addEventListener('keydown', stopGame);
