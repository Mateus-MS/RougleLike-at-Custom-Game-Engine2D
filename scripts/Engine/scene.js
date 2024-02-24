import { Engine } from "./engine.js";
import { Draw } from "../Utils/draw.js";
import { Player } from "../Entity/player.js";
import { Vector2 } from "../Utils/Vector2.js";
import { Entity } from "../Entity/entity.js";
import { Calc } from "../Utils/calc.js";

export class Scene extends Engine{

    constructor(){
        super()

        this.entities = [];
        this.Draw = new Draw(this);
        this.setup();

    }

    setup(){
        this.player = new Player(Vector2.zero());
        this.entities.push(new Entity(Vector2.randomScreenPosition(this), 20, 'green'))
        this.entities.push(new Entity(Vector2.randomScreenPosition(this), 20, 'green'))
        this.entities.push(new Entity(Vector2.randomScreenPosition(this), 20, 'green'))
        this.entities.push(new Entity(Vector2.randomScreenPosition(this), 20, 'green'))
        this.entities.push(new Entity(Vector2.randomScreenPosition(this), 20, 'green'))
    }

    update(){

        this.player.move();
        this.player.render(this.c);

        this.entities.forEach(entity => {
            entity.render(this.c)
        })

    }

}