'use strict'; //ES5 строгий режим
var CELL_SIZE = 8; //размер клетки
var cells = [ [], [] ]; //многомерный костыль JS
var canvas;

function init() {
    canvas = document.getElementById('game').getContext('2d');
    canvas.width =  document.getElementById('game').width;
    canvas.height =  document.getElementById('game').height;

    //grid
    function Grid() {
        this.size = { x : 0, y : 0 };
        this.width = canvas.width;
        this.height = canvas.height;
        
        //canvas.fillRect(0, 0, canvas.width, canvas.height);
        

        //grid functions
        
        this.size.x = Math.floor(512 / CELL_SIZE); //округляем к наименьшему (оптимизировать)
        this.size.y = Math.floor(512 / CELL_SIZE);
        

        this.fill = function () {
            //cell верхяя левая и нижняя левая границы
            var i, j;
            for (i = 0; i < this.width; i += CELL_SIZE) {
                for (j = 0; j < this.height; j += CELL_SIZE) {
                    cells[i][j] = false; //false - нет жизни, true есть
                }
            }
        };

        this.draw = function () {
            var i;
            window.alert(this.size.x);
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
    var kek = new Grid();
    kek.draw();
}

window.onload = init();
