'use strict'; //ES5 строгий режим
var canvas = document.getElementById('game').getContext('2d');
var CELL_SIZE = 8; //размер клетки
var cells = [ [], [] ]; //многомерный костыль JS

//grid
function Grid() {
    this.width = canvas.width;
    this.height = canvas.height;
    
    //grid functions
    this.size = function (width, height) {
        this.x = Math.floor(width / CELL_SIZE); //округляем к наименьшему (оптимизировать)
        this.y = Math.floor(height / CELL_SIZE);
    };
    
    this.fill = function () {
        
    };
}