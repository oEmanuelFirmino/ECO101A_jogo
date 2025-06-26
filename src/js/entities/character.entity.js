export class Character {
  constructor(x, y, width, height, speed, sprite) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.sprite = sprite;
  }

  draw(ctx) {
    if (ctx && this.sprite && this.sprite.complete && this.sprite.naturalWidth !== 0 && !isNaN(this.x) && !isNaN(this.y)) {
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
  }
}