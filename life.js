// Крч, нужно сохранять поколения в другой массив и выводить одно, а по другому рассчитывать
//ВООТ! Рассчитываем правила по своему массиву, а записываем результаты поколения в новый массив.
//Затем в новом цикле (до него) записываем второй массив в первый и на основе него решаем какие клетки будут закрашены (в третий массив, либо визуализацией второго)
// Шок, НН мне про жизнь рассказала

'use strict'; //ES5 строгий режим
var console;

var CELL_SIZE = 8; //размер клетки
//var cells = [ [], [] ]; //многомерный костыль JS
var cells = [], buffCells = [];
var timeout = 30; //задержка для автоплея
var canvas, game;

function init() {
    //back-grid
    canvas = document.getElementById('back').getContext('2d');
    canvas.width =  document.getElementById('back').width;
    canvas.height =  document.getElementById('back').height;
    
    //game
    game = document.getElementById('game').getContext('2d');
    
    /* Сетка */
    function Grid() {
        this.size = { x : 0, y : 0 };
        this.width = canvas.width;
        this.height = canvas.height;

        //grid functions
        
        this.size.x = parseInt(canvas.width / CELL_SIZE, 10); //округляем к наименьшему (оптимизировать)
        this.size.y = parseInt(canvas.height / CELL_SIZE, 10);
        
        /* заполняем массив cells */
        this.fill = function () {
            //cell верхяя левая и нижняя левая границы
            //возможно тут ошибка, тк массив не обнуляется
            //cells = [ [this.size.x], [this.size.y] ];
            //cells[this.size.x] = [this.size.y];
            var i, j;
            for (i = 0; i < this.size.x; i += 1) {
                cells[i] = [];
                buffCells[i] = [];
                for (j = 0; j < this.size.y; j += 1) {
                    cells[i][j] = false; //false - нет жизни, true есть
                    buffCells[i][j] = false;
                }
            }
        };
        
        /* рисуем сетку */
        this.draw = function () {
            var i;
            
            canvas.translate(0.5, 0.5);
            canvas.beginPath();
            for (i = 0; i <= this.size.x; i += 1) {
                canvas.moveTo(0, i * CELL_SIZE);
                canvas.lineWidth = 1;
                canvas.lineTo(this.width, i * CELL_SIZE);
                canvas.strokeStyle = "#000"; // цвет линии
            }
            
            for (i = 0; i <= this.size.x; i += 1) {
                canvas.lineWidth = 1;
                canvas.moveTo(i * CELL_SIZE, 0);
                canvas.lineTo(i * CELL_SIZE, canvas.height);
                canvas.strokeStyle = "#000"; // цвет линии
            }
            
            canvas.stroke();
        };
    }
        
    /* обновляем отрисовку */
    function Update() {
        //var upd = new Update();
        
        /* Очистка ячеек */
        this.clear = function () {
            game.clearRect(0, 0, canvas.width, canvas.height);
        };
        
        /* Заполнить конкретную ячейку */
        this.fillCell = function (x, y) {
            game.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE + 1, CELL_SIZE + 1);
            
            // Для рисования круга
//            game.beginPath();
//            game.arc(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE / 2, 0, 2 * Math.PI, false);
//            game.fillStyle = 'red';
//            game.fill();
//            game.lineWidth = 1;
//            game.strokeStyle = 'red';
//            game.stroke();
        };
        
        /* Заполнить всё поле */
        this.fill = function () {
            var i, j, grid = new Grid(), upd = new Update();
            
            //Очищаем предыдущий кадр
            upd.clear();
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    //Тут можно устроить инверсию цвета
                    if (cells[i][j] === true) {
                        upd.fillCell(i, j);
                    }
                }
            }
            
            //Перессчитываем ячейки
            upd.cells();
        };
        
        /* рандомная заливка для тестов */
        this.randomFill = function () {
            var i, j, fill, fillRnd, grid = new Grid(), upd = new Update();
            //очищаем предыдущий рисунок
            upd.clear();
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    //рандомизация boolean
                    fill = [true, false][Math.round(Math.random())];
                    cells[i][j] = Boolean(fill);
                }
            }
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    fill = cells[i][j];
                    if (fill === true) {
                        //заполняем новый рисунок
                        fillRnd = new Update();
                        fillRnd.fillCell(i, j);
                    }
                }
            }
        };
        
        /* АВТОШАГ */
        this.autoplay = function () {
            var upd = new Update();
            upd.fill();
            setTimeout(function () { upd.autoplay(); }, timeout);
        };
        
        /* Проверяем количество живых соседей */
        this.getLivingNeighbors = function (x, y) {
            var grid = new Grid(), count = 0, sx = grid.size.x, sy = grid.size.y;
            //ПРАВИЛА ИГРЫ
            
            //каждый первый if проверяет, что мы не зашли за границы сетки!
            
            //Проверяем верхнюю левую ячейку !
            if (x !== 0 && y !== 0) {
                if (cells[x - 1][y - 1] === true) {
                    count += 1;
                }
            }
            
            //Проверяем верхнюю ячейку !
            if (y !== 0) {
                if (cells[x][y - 1] === true) {
                    count += 1;
                }
            }
            
            //Проверяем верхнюю правую ячейку !
            if (x !== sx - 1 && y !== 0) {
                if (cells[x + 1][y - 1] === true) {
                    count += 1;
                }
            }
            
            //Проверяем левую ячейку !
            if (x !== 0) {
                if (cells[x - 1][y] === true) {
                    count += 1;
                }
            }
            
            //Проверяем правую ячейку !
            if (x !== sx - 1) {
                if (cells[x + 1][y] === true) {
                    count += 1;
                }
            }
            
            //Проверяем нижнюю левую ячейку !
            if (x !== 0 && y !== sy - 1) {
                if (cells[x - 1][y + 1] === true) {
                    count += 1;
                }
            }
            
            //Проверяем нижнюю ячейку !
            if (y !== sy - 1) {
                if (cells[x][y + 1] === true) {
                    count += 1;
                }
            }
            
            //Проверяем нижнюю правую ячейку !
            if (x !== sx - 1 && y !== sy - 1) {
                if (cells[x + 1][y + 1] === true) {
                    count += 1;
                }
            }
            
            return count;
        };
        
        /* Проверяем клетки по правилам игры */
        this.cells = function () {
            var i, j, isAlive, count, result = false, gameUpd = new Update(), grid = new Grid();
            
            //сначала нужно скопировать массив
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    
                    result = false;
                    
                    //Проверяем состояние ячейки
                    isAlive = cells[i][j];
                    
                    //считаем живых соседей
                    count = gameUpd.getLivingNeighbors(i, j);
                    //применяем правила
                    if (isAlive && count < 2) {
                        result = false;
                    }
                    if (isAlive && (count === 2 || count === 3)) {
                        result = true;
                    }
                    if (isAlive && count > 3) {
                        result = false;
                    }
                    if (!isAlive && count === 3) {
                        result = true;
                    }
                    
                    //записываем результат
                    buffCells[i][j] = result;
                }
            }
            
            //копируем массив. Сделаю через цикл, чтобы наверняка))0
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    cells[i][j] = buffCells[i][j];
                }
            }
            
        };
        
        /* Создаём юнитов */
        this.newUnit = function (unit) {
            var i, j, grid = new Grid(), off_x = parseInt(grid.size.x / 2, 10), off_y = parseInt(grid.size.y / 2, 10);
            
            //очищаем массив по тупому
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    cells[i][j] = false;
                }
            }
            
            //заполняем
            switch (unit) {
            case 'glider':
                cells[off_x + 1][off_y + 2] = true;
                cells[off_x + 2][off_y + 3] = true;
                cells[off_x + 3][off_y + 1] = true;
                cells[off_x + 3][off_y + 2] = true;
                cells[off_x + 3][off_y + 3] = true;
                break;
                    
            case 'exploder':
                cells[off_x + 1][off_y + 1] = true;
                cells[off_x + 1][off_y + 2] = true;
                cells[off_x + 1][off_y + 3] = true;
                cells[off_x + 1][off_y + 4] = true;
                cells[off_x + 1][off_y + 5] = true;
                    
                cells[off_x + 3][off_y + 1] = true;
                cells[off_x + 3][off_y + 5] = true;
                    
                cells[off_x + 5][off_y + 1] = true;
                cells[off_x + 5][off_y + 2] = true;
                cells[off_x + 5][off_y + 3] = true;
                cells[off_x + 5][off_y + 4] = true;
                cells[off_x + 5][off_y + 5] = true;
                break;
                    
            case 'gosper':
                cells[off_x + 1][off_y + 5] = true;
                cells[off_x + 1][off_y + 6] = true;
                cells[off_x + 2][off_y + 5] = true;
                cells[off_x + 2][off_y + 6] = true;
                
                cells[off_x + 12][off_y + 5] = true;
                cells[off_x + 12][off_y + 6] = true;
                cells[off_x + 12][off_y + 7] = true;
                    
                cells[off_x + 13][off_y + 4] = true;
                cells[off_x + 13][off_y + 8] = true;
                    
                cells[off_x + 14][off_y + 3] = true;
                cells[off_x + 14][off_y + 9] = true;
                    
                cells[off_x + 15][off_y + 4] = true;
                cells[off_x + 15][off_y + 8] = true;
                    
                cells[off_x + 16][off_y + 5] = true;
                cells[off_x + 16][off_y + 6] = true;
                cells[off_x + 16][off_y + 7] = true;
                    
                cells[off_x + 17][off_y + 5] = true;
                cells[off_x + 17][off_y + 6] = true;
                cells[off_x + 17][off_y + 7] = true;
                    
                cells[off_x + 22][off_y + 3] = true;
                cells[off_x + 22][off_y + 4] = true;
                cells[off_x + 22][off_y + 5] = true;
                    
                cells[off_x + 23][off_y + 2] = true;
                cells[off_x + 23][off_y + 3] = true;
                cells[off_x + 23][off_y + 5] = true;
                cells[off_x + 23][off_y + 6] = true;
                    
                cells[off_x + 24][off_y + 2] = true;
                cells[off_x + 24][off_y + 3] = true;
                cells[off_x + 24][off_y + 5] = true;
                cells[off_x + 24][off_y + 6] = true;
                    
                cells[off_x + 25][off_y + 2] = true;
                cells[off_x + 25][off_y + 3] = true;
                cells[off_x + 25][off_y + 4] = true;
                cells[off_x + 25][off_y + 5] = true;
                cells[off_x + 25][off_y + 6] = true;
                    
                cells[off_x + 26][off_y + 1] = true;
                cells[off_x + 26][off_y + 2] = true;
                cells[off_x + 26][off_y + 6] = true;
                cells[off_x + 26][off_y + 7] = true;
         
                cells[off_x + 35][off_y + 3] = true;
                cells[off_x + 35][off_y + 4] = true;
                    
                cells[off_x + 36][off_y + 3] = true;
                cells[off_x + 36][off_y + 4] = true;
                break;
                    
            case 'lidka':
                cells[off_x + 1][off_y + 2] = true;
                    
                cells[off_x + 2][off_y + 1] = true;
                cells[off_x + 2][off_y + 3] = true;
                
                cells[off_x + 3][off_y + 2] = true;
                
                cells[off_x + 5][off_y + 15] = true;
                    
                cells[off_x + 6][off_y + 13] = true;
                cells[off_x + 6][off_y + 15] = true;
                
                cells[off_x + 7][off_y + 12] = true;
                cells[off_x + 7][off_y + 13] = true;
                cells[off_x + 7][off_y + 15] = true;
                    
                cells[off_x + 9][off_y + 11] = true;
                cells[off_x + 9][off_y + 12] = true;
                cells[off_x + 9][off_y + 13] = true;
                break;
            case 'kek':
                cells[off_x + 1][off_y + 1] = true;
                cells[off_x + 1][off_y + 2] = true;
                cells[off_x + 1][off_y + 3] = true;
                cells[off_x + 1][off_y + 4] = true;
                cells[off_x + 1][off_y + 5] = true;
                    
                cells[off_x + 2][off_y + 3] = true;
                
                cells[off_x + 3][off_y + 2] = true;
                cells[off_x + 3][off_y + 4] = true;
                    
                cells[off_x + 4][off_y + 1] = true;
                cells[off_x + 4][off_y + 5] = true;
                    
                    
                cells[off_x + 6][off_y + 1] = true;
                cells[off_x + 6][off_y + 2] = true;
                cells[off_x + 6][off_y + 3] = true;
                cells[off_x + 6][off_y + 4] = true;
                cells[off_x + 6][off_y + 5] = true;
                
                cells[off_x + 7][off_y + 1] = true;
                cells[off_x + 7][off_y + 3] = true;
                cells[off_x + 7][off_y + 5] = true;
                    
                cells[off_x + 8][off_y + 1] = true;
                cells[off_x + 8][off_y + 3] = true;
                cells[off_x + 8][off_y + 5] = true;
                    
                
                cells[off_x + 10][off_y + 1] = true;
                cells[off_x + 10][off_y + 2] = true;
                cells[off_x + 10][off_y + 3] = true;
                cells[off_x + 10][off_y + 4] = true;
                cells[off_x + 10][off_y + 5] = true;
                    
                cells[off_x + 11][off_y + 3] = true;
                
                cells[off_x + 12][off_y + 2] = true;
                cells[off_x + 12][off_y + 4] = true;
                    
                cells[off_x + 13][off_y + 1] = true;
                cells[off_x + 13][off_y + 5] = true;
                break;
            }
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    console.log(cells[i][j]);
                }
            }
            
            
        };
    }

    var gameGrid = new Grid(), gameUpd = new Update(), clearBtn, randBtn, stepBtn, gliderBtn;
    gameGrid.draw();
    gameGrid.fill();
    //gameUpd.fillCell(10, 10);
    
    //Кнопка очистки
    clearBtn = document.getElementById('clear');
    clearBtn.onclick = function () { gameUpd.clear(); };
    
    //Кнопка рандомизации
    randBtn = document.getElementById('rand');
    randBtn.onclick = function () { gameUpd.randomFill(); };
    
    //Кнопка шага
    stepBtn = document.getElementById('step');
    stepBtn.onclick = function () { gameUpd.fill(); };
    
    //Кнопка autoplay
    stepBtn = document.getElementById('autoplay');
    stepBtn.onclick = function () {
        //Сами себя вызываем
        var upd = new Update();
        upd.autoplay();
    };
    
    //Кнопка юнита: глайдер
    gliderBtn = document.getElementById('glider');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('glider');
        gameUpd.fill();
    };
    
    //Кнопка юнита: эксподер
    gliderBtn = document.getElementById('exploder');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('exploder');
        gameUpd.fill();
    };
    
    //Кнопка юнита: gosper
    gliderBtn = document.getElementById('gosper');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('gosper');
        gameUpd.fill();
    };
    
    //Кнопка юнита: lidka
    gliderBtn = document.getElementById('lidka');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('lidka');
        gameUpd.fill();
    };
    //kek
    gliderBtn = document.getElementById('kek');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('kek');
        gameUpd.fill();
    };
    
}
    
window.onload = init();