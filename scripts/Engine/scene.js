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

        //Debug options

        //Camera movement
        this.showCenter = false;
        this.outerCircleSize = 220;
        this.innerCircleSize = 140;

        this.seekingPlayer = false;
        this.offSet = Vector2.zero();
        this.speed = Vector2.zero();

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

        //Debug

        //Camera
        if(this.showCenter){
            this.Draw.circle({
                position: Vector2.zero(),
                color: 'yellow',
                size: this.outerCircleSize
            })
            this.Draw.circle({
                position: Vector2.zero(),
                color: 'green',
                size: this.innerCircleSize
            })
        }
        this.moveCamera();

        this.player.move();
        this.player.render(this.c);

        this.entities.forEach(entity => {
            entity.render(this.c)
        })

    }

    moveCamera(){

        //Se ainda não estiver procurando o player
        if(this.seekingPlayer === false){
            //Se o player estiver fora do centro da tela
            if(this.player.position.distance(this.offSet) >= this.outerCircleSize){
                //Começa a ir em direção ao player
                this.seekingPlayer = true
            }
        } else {

            //Calcula a direção e velocidade até o player
            let desire = this.player.position.sub(this.offSet);
            desire.setMagnitude(5);
            let steering = desire.sub(this.speed);

            //Move na direção oposta todas as outras entidades
            this.player.position = this.player.position.sub(steering)
            this.entities.forEach(entity => {
                entity.position = entity.position.sub(steering);
            })

            //Quando o player estiver dentro do circulo interior
            if(this.player.position.distance(this.offSet) <= this.innerCircleSize){
                //Para de seguir o player
                this.seekingPlayer = false;
            }

        }

    }

}