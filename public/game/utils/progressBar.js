// particle_no = 25;

import { Invalidate } from "./drawing.js";

//modified from https://www.html5canvastutorials.com/advanced/html5-canvas-animated-progress-bar/
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");


function reset(bar) {
    ctx.fillStyle = "#272822";
    ctx.fillRect(bar.x, bar.y , bar.w, bar.h);

    ctx.fillStyle = "#171814";
    ctx.fillRect(bar.x, bar.y , bar.w, bar.h);
}

export class progressbar {
    constructor(x, y, w, h) {
        this.widths = 0;
        this.hue = 0;
        this.w = w;
        this.x = x;
        this.y = y;
        this.h = h;
        this.draw = function (progress) {
            ctx.fillStyle = "gray";
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 40%, 1)';
            ctx.fillRect(this.x, this.y, this.w * progress, this.h);
            var grad = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
            grad.addColorStop(0, "Red");
            grad.addColorStop(.5, "Yellow");
            grad.addColorStop(1, "Green");
            ctx.fillStyle = grad;
            ctx.fillRect(this.x, this.y, this.w * progress, this.h);
        };
        
    }
}


// bar = new progressbar();

export function drawColorProgressbar(progress, bar, inverse) {
    Invalidate();
    if (inverse) {
        progress = progress/100;
        progress = 1-progress;
    }
    else {
        progress = progress/100;
        
    }
    // bar.hue += progress;

  
    if (progress> 1) {
    } 

    else {
        bar.draw(progress);
    }
}

// function update() {
//   for (var i = 0; i < particles.length; i++) {
//     var p = particles[i];
//     p.x -= p.vx;
//     if (p.down == true) {
//       p.g += 0.1;
//       p.y += p.g;
//     } else {
//       if (p.g < 0) {
//         p.down = true;
//         p.g += 0.1;
//         p.y += p.g;
//       } else {
//         p.y -= p.g;
//         p.g -= 0.1;
//       }
//     }
//     p.draw();
//   }
// }
