class Boat {
    constructor(x, y, width, height, boatPos, boatAnimation) {
        this.width = width;
        this.height = height;
        this.boatPosition = boatPos;
        this.animation = boatAnimation;
        this.body = Bodies.rectangle(x, y, width, height);
        this.speed = 0.05;
        this.isBroken = false;
        World.add(world, this.body);
    }

    animate() {
        this.speed += 0.05;
    }

    display() {
        var angle = this.body.angle;
        var position = this.body.position;
        var index = floor(this.speed % this.animation.length);

        push();
        translate(position.x, position.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPosition, this.width, this.height);
        pop();
    }

    remove(index) {
        this.animation = brokenBoatAnimation;
        this.speed = 0.05;
        this.width = 300;
        this.height = 300;
        this.isBroken = true;
        setTimeout (() => {
            Matter.World.remove(world, boats[index].body);
            delete boats[index];
        }, 2000);
    }
}