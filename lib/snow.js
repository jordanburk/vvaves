const Color = require('./color');
const SnowPoint = require('./snow_point');
const Environment = require('./environment');

function Snow(wave, ctx, ratio){
  this.wave = wave;
  this.ctx = ctx;
  this.ratio = ratio;
  this.displacement = Math.random() * 25 * ratio;

  this.point = new SnowPoint(this.ratio);
  this.falling = true;

  this.radius = 3 + Math.random() * 2;
}

Snow.prototype.move = function (delta) {
  if(this.point.oldX < 0){
    this.point.oldX = window.innerWidth;
  } else if(this.point.oldX > window.innerWidth){
    this.point.oldX = 0;
  }

  if(this.falling && this.point.y < this.wave.y){
    this.point.move(delta);
  } else {
    for(let i = 0; i < this.wave.points.length; i++){
      const point = this.wave.points[i];
      if(point.x > this.point.x){
        const prevPoint = this.wave.points[i-1];

        const total = Math.abs(point.x - prevPoint.x)
        const left = Math.abs(this.point.x - prevPoint.x);
        const right = Math.abs(this.point.x - point.x);
        const leftWeight = right / total; // opposite on purpose
        const rightWeight = left / total; // closer should mean bigger, not smaller

        const waveY = (prevPoint.y * leftWeight + point.y * rightWeight);

        if(this.falling && this.point.y < waveY - 2){
          this.point.move(delta);
        } else {
          this.falling = false;
          this.radius -= Environment.snowing ? 0.002 : 0.005;
          this.point.y = waveY;
          const heightWidthRatio = (point.y - prevPoint.y) / (point.x - prevPoint.x);

          // maybe make use of the tide variable when determining x movement
          this.point.x += 1 * this.ratio * heightWidthRatio * (leftWeight < rightWeight ? leftWeight : rightWeight);
        }
        break
      }
    }
  }
};


Snow.prototype.render = function () {
  const ratio = this.ratio;
  this.ctx.fillStyle = Color.snow();

  this.ctx.save();

  this.ctx.beginPath();
  const begin = .2 + this.tilt;
  const end = Math.PI-.2 + this.tilt;
  this.ctx.arc(this.point.x, this.point.y + this.displacement, this.radius * ratio, 0, Math.PI * 2);
  this.ctx.fill();
  this.ctx.closePath();

  this.ctx.restore();
};


module.exports = Snow;
