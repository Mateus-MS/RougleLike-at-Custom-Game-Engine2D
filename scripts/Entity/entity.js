import { Draw } from "../Utils/draw.js";

/**
* @param {Vector2} position - Vector2 
* @param {Number}  size     - Number 
* @param {String}  color    - String 
*/
export class Entity{

    constructor(position, size, color){

        this.position = position;
        this.size     = size;
        this.color    = color;

    }

    render(context){

        Draw.circle({
            color:    this.color,
            position: this.position,
            size:     this.size
        }, context)

    }

}