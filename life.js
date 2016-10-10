'use strict'; //ES5 строгий режим
var console;

var CELL_SIZE = 8; //размер клетки
//var cells = [ [], [] ]; //многомерный костыль JS
var cells = [];
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
        
        this.size.x = Math.floor(canvas.width / CELL_SIZE); //округляем к наименьшему (оптимизировать)
        this.size.y = Math.floor(canvas.height / CELL_SIZE);
        
        /* заполняем массив cells */
        this.fill = function () {
            //cell верхяя левая и нижняя левая границы
            //cells = [ [this.size.x], [this.size.y] ];
            var i, j;
            for (i = 0; i <= this.size.x; i += 1) {
                cells[i] = [];
                for (j = 0; j <= this.size.y; j += 1) {
                    cells[i][j] = false; //false - нет жизни, true есть
                }
            }
        };
        
        /* рисуем сетку */
        this.draw = function () {
            var i;
            
            console.log(this.size.x);
            
            canvas.translate(0.5, 0.5);
            canvas.beginPath();
            for (i = 0; i <= this.size.y; i += 1) {
                
                canvas.moveTo(0, i * CELL_SIZE);
                canvas.lineWidth = 1;
                canvas.lineTo(this.width, i * CELL_SIZE);
               
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
        };
        
        /* Заполнить всё поле */
        this.fill = function () {
            var i, j, grid = new Grid(), upd = new Update();
            
            //Очищаем предыдущий кадр
            upd.clear();
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    if (cells[i][j] === true) {
                        upd.fillCell(i, j);
                    }
                }
            }
            
            //Перессчитываем ячейки
            upd.cells();
            
            //Сами себя вызываем
            setTimeout(function () { upd.fill(); }, 5000);
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
        
        /* Проверяем количество живых соседей */
        this.getLivingNeighbors = function (x, y) {
            var grid = new Grid(), count = 0, sx = grid.size.x, sy = grid.size.y;
            //console.log(x, y);
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
                    cells[i][j] = result;
                }
            }
            
        };
        
        /* Создаём юнитов */
        this.newUnit = function (unit) {
            var off_x = 5, off_y = 5, i, j, grid = new Grid();
            
            //очищаем массив по тупому
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    cells[i][j] = false;
                    //console.log(cells[i][j]);
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
    
    //Кнопка юнита: глайдер
    gliderBtn = document.getElementById('glider');
    gliderBtn.onclick = function () {
        gameGrid.fill();
        gameUpd.newUnit('glider');
        gameUpd.fill();
    };
    
}
    
window.onload = init();