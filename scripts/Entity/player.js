import { Vector2 } from "../Utils/Vector2.js";
import { Draw } from "../Utils/draw.js";
import { Mob }  from "./mob.js";

export class Player extends Mob{

    constructor(position){
        super(position, 20, "red");

        this.movement = {
            left:  false,
            right: false,
            up:    false,
            down:  false,
        }
        this.speed = 5;
        this.addEventListeners();

    }

    render(context){

        Draw.square({
            position: this.position.sub(new Vector2(this.size / 2)),
            color   : this.color,
            size    : this.size,
        }, context)

    }

    move(){

        if(this.movement.left){
            this.position.x -= this.speed;
        } else if (this.movement.right){
            this.position.x += this.speed;
        }

        if(this.movement.up){
            this.position.y -= this.speed;
        } else if (this.movement.down){
            this.position.y += this.speed;
        }

    }

    addEventListeners(){

        document.addEventListener('keydown', (e)=>{
            if(e.key === 'a'){
                this.movement.left = true;
            } else if (e.key === 'd'){
                this.movement.right = true;
            }

            if(e.key === 'w'){
                this.movement.up = true;
            } else if (e.key === 's'){
                this.movement.down = true;
            }
        })

        document.addEventListener('keyup', (e)=>{
            if(e.key === 'a'){
                this.movement.left = false;
            } else if (e.key === 'd'){
                this.movement.right = false;
            }

            if(e.key === 'w'){
                this.movement.up = false;
            } else if (e.key === 's'){
                this.movement.down = false;
            }
        })

    }

}