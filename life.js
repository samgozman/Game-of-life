'use strict'; //ES5 строгий режим
var console;

var CELL_SIZE = 16; //размер клетки
var cells = [ [], [] ]; //многомерный костыль JS
var canvas, game;

function init() {
    //back-grid
    canvas = document.getElementById('back').getContext('2d');
    canvas.width =  document.getElementById('back').width;
    canvas.height =  document.getElementById('back').height;
    
    //game
    game = document.getElementById('game').getContext('2d');
    
    //grid
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
            var i, j;
            for (i = 0; i < CELL_SIZE; i += 1) {
                for (j = 0; j < CELL_SIZE; j += 1) {
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
        
        this.clear = function () {
            game.clearRect(0, 0, canvas.width, canvas.height);
        };

        this.fillCell = function (x, y) {
            game.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        };
        
        /* рандомная заливка для тестов */
        this.randomFill = function () {
            var i, j, fill, fillRnd, gameClear, grid = new Grid();
            //очищаем предыдущий рисунок
            gameClear = new Update();
            gameClear.clear();
            
            for (i = 0; i < grid.size.x; i += 1) {
                for (j = 0; j < grid.size.y; j += 1) {
                    //рандомизация boolean
                    fill = [true, false][Math.round(Math.random())];
                    if (fill === true) {
                        //заполняем новый рисунок
                        fillRnd = new Update();
                        fillRnd.fillCell(i, j);
                    }
                }
            }
        };
    }

    var gameGrid = new Grid(), gameUpd = new Update(), clearBtn, randBtn;
    gameGrid.draw();
    //gameUpd.fillCell(10, 10);
    
    //Кнопка очистки
    clearBtn = document.getElementById('clear');
    clearBtn.onclick = function () { gameUpd.clear(); };
    
    //Кнопка рандомизации
    randBtn = document.getElementById('rand');
    randBtn.onclick = function () { gameUpd.randomFill(); };
    
    
}
    
window.onload = init();