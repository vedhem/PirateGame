class CannonBall {
    constructor(x, y) {
        this.r = 30;
        var options = {
            isStatic: true
        }
        this.body = Bodies.circle(x, y, this.r, options);
        this.image = loadImage("assets/cannonball.png");
        this.animation = [this.image];
        this.trajectory = [];
        this.isSink = false;
        this.speed = 0.05;
        World.add(world, this.body);
    }

    animate() {
        this.speed += 0.05;
    }

    display() {
        var angle = this.body.angle;
        var pose = this.body.position;
        var index = floor(this.speed % this.animation.length);
        push();
        translate(pose.x, pose.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.animation[index], 0, 0, this.r, this.r);
        pop();
        if (this.body.velocity.x > 0 && this.body.position.x > 300 && !this.isSink) {
            var position = [this.body.position.x, this.body.position.y];
            this.trajectory.push(position);
        }
        for (var i = 0; i < this.trajectory.length; i++) {
            image(this.image, this.trajectory[i][0], this.trajectory[i][1], 5, 5);
        }
    }

    shoot() {
        var newAngle = cannon.angle-28;
        newAngle = newAngle * (3.14/180);
        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        Matter.Body.setStatic(this.body, false);
        Matter.Body.setVelocity(this.body, {
            x: velocity.x * (180/3.14),
            y: velocity.y * (180/3.14)
        })
    }

    remove (index) {
        this.isSink = true;
        Matter.Body.setVelocity(this.body, {x : 0, y : 0});
        this.animation = waterSplashAnimation;
        this.speed = 0.05;
        this.r = 150;

        setTimeout (() => {
            Matter.World.remove(world, this.body);
            delete balls[index];
        }, 1000);
    }

}