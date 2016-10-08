'use strict'; //ES5 строгий режим
var canvas = document.getElementById('game').getContext('2d');
var CELL_SIZE = 8; //размер клетки
var cells:Boolean = [ [], [] ]; //многомерный костыль JS

//grid
function Grid() {
    this.width = canvas.width;
    this.height = canvas.height;
    
    //grid functions
    this.size = function (width, height) {
        this.size.x = Math.floor(width / CELL_SIZE); //округляем к наименьшему (оптимизировать)
        this.size.y = Math.floor(height / CELL_SIZE);
    };
    
    this.fill = function () {
        //cell верхяя левая и нижняя левая границы
        var i, j;
        for (i = 0; i < this.width; i += CELL_SIZE) {
            for (j = 0; j < this.height; j += CELL_SIZE) {
                cells[i, j] = false; //false - нет жизни, true есть
            }
        }
    };
    
    this.draw = function () {
         
    };
}