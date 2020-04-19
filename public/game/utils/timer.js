import {Invalidate}  from './drawing.js';
import * as progBar from './progressBar.js';
export class Timer {
    constructor(duration,  bar = null, callback = null){
        this.isActive = false;
        this.startTime = 0;
        this.duration = duration;
        this.progress = 0;
        this.callback = callback;
        this.bar = bar;
    }
    checkTime() {
        if (this.isActive == true) {
            let currentTime = performance.now(),
                elapsedTime = currentTime - this.startTime;
                this.progress =(elapsedTime / (this.duration * 1000)) * 100;
            console.log(this.progress);
            
            Invalidate();
            
            
            if (this.progress >= 100) {
              
                this.isActive = false;
                this.startTime = 0;
                this.progress = 0;
                if (this.callback != null) {
                    this.callback();
                }
                
                
                
            }
        }
    }
    startTimer() {
        this.isActive = true;
        this.progress = 0;
        this.startTime = performance.now();
    }
    updateDuration(newDuration) {
        this.duration = newDuration;
    }
    drawProgress() {
        if (this.isActive){
            progBar.drawColorProgressbar(this.progress, this.bar, true);
        }
        
    }
}
