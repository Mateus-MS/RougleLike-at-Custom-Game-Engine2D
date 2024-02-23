import { Engine } from "./engine.js";
import { Draw } from "../Utils/draw.js";
import { Entity } from "../Entity/entity.js";

export class Scene extends Engine{

    constructor(){
        super()

        this.entities = [];
        this.Draw = new Draw(this);
        this.setup();

    }

    setup(){
        this.entities.push(new Entity({x: 20, y: 30}, 30, "red"))
    }

    update(){
        this.entities.forEach(entity => {
            entity.position.x += 1;
        });
    }

}