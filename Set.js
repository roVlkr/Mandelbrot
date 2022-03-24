"use strict";

const canvas = document.getElementById("canvas");
const g = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();

const w = canvas.width;
const h = canvas.height;
var translated = [3 * w / 4, h / 2];
var zoom = 3.5 / w;

const max_iter = 500;


/**
 * If the norm of the point is <= 2 after max_iter iterations, it will be
 * added to the mandelbrot set.
 */
function mandelbrot(x0, y0) {
    var x = x0, y = y0;
    for (var i = 0; i < max_iter; i++) {
        if (x*x + y*y > 4)
            return false;
        
        var temp = x*x - y*y + x0;
        y = 2*x*y + y0;
        x = temp;
    }

    return true;
}


/**
 * Moves and scales of the whole Picture. (midX, midY) is the
 * position of the mouse click. This point will then be the new midpoint.
 */
function moveFrame(midX, midY, factor) {
    translated[0] = w / 2 - (midX - translated[0]) * factor;
    translated[1] = h / 2 - (midY - translated[1]) * factor;
}


/**
 * Translate a pixel coordinate into a coordinate in
 * the model interval in the set of complex numbers.
 */
function translate(x, y, ratio) {
    return [(x - translated[0]) * ratio, (y - translated[1]) * ratio];
}

/**
 * Each number gets a color (currently all black).
 */
function coloring(iter) {
    /*var ratio = 1 - iter / 5;
    var v = Math.floor(ratio * 255);
    var v_str = v.toString(16);
    
    return "#" + v_str + v_str + v_str;*/
    return "black";
}

/**
 * Assigns a complex number to each pixel. Then it will be decided wether
 * it lies in the Mandelbrot set or not and gets colored.
 */
function draw() {
    g.fillStyle = "white";
    g.fillRect(0, 0, w, h);

    for (var x = 0; x < w; x += 1) {
        for (var y = 0; y < h; y += 1) {
            var z = translate(x, y, zoom);
            var iter = mandelbrot(z[0], z[1]);

            g.fillStyle = coloring(iter);
            if (iter)
                g.fillRect(x, y, 1, 1);
        }
    }
}


/**
 * Zoom by a factor of 2.
 */
canvas.onclick = (e) => {
    var factor = 2;
    zoom /= factor;
    moveFrame(e.clientX - rect.left, e.clientY - rect.top, factor);
    draw();
};


/**
 * Draw initial picture to give some orientation for clicking.
 */
draw();
