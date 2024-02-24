import { Engine } from "./engine.js";
import { Draw } from "../Utils/draw.js";
import { Player } from "../Entity/player.js";
import { Vector2 } from "../Utils/Vector2.js";
import { Mob } from "../Entity/mob.js";

export class Scene extends Engine{

    constructor(){
        super()

        this.entities = [];
        this.Draw = new Draw(this);
        this.setup();

        //Debug options
        this.showCenter = false;

        //Camera movement
        this.outerCircleSize = 200;
        this.innerCircleSize = 50;
        this.seekingPlayer = false;
        this.offSet = Vector2.zero();

    }

    setup(){
        this.player = new Player(Vector2.zero());
        this.entities.push(this.player)
        for(let i = 0; i < 50; i++){
            this.entities.push(new Mob(Vector2.randomScreenPosition(this), 20, 'green'))
        }
    }

    update(){

        //Debug camera
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

        this.preventOverLap();

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
            desire.setMagnitude(3.5);
            let steering = desire.sub(Vector2.zero());

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

    preventOverLap(){

        //Itera sob todos as entidades
        for(let i = 0; i < this.entities.length; i++){
            for(let j = 0; j < this.entities.length; j++){
                //impede que teste com ele mesmo
                if(i !== j){

                    let distance = this.entities[i].position.distance(this.entities[j].position); 
                    let sum_radi = this.entities[i].size + this.entities[j].size;
                    
                    //Se as duas entidades estiverem sobrepostas
                    if(distance <= sum_radi){
                        
                        if(this.entities[i].onCollision) this.entities[i].onCollision();
                        if(this.entities[j].onCollision) this.entities[j].onCollision();
                        
                        //Se ambas forem Mobs
                        if(this.entities[i] instanceof Mob && this.entities[j] instanceof Mob){
                            
                            let overlap = .5 * (distance - this.entities[i].size - this.entities[j].size);
                            
                            this.entities[i].position.x -= overlap * (this.entities[i].position.x - this.entities[j].position.x) / distance;
                            this.entities[i].position.y -= overlap * (this.entities[i].position.y - this.entities[j].position.y) / distance;
                            
                            this.entities[j].position.x += overlap * (this.entities[i].position.x - this.entities[j].position.x) / distance;
                            this.entities[j].position.y += overlap * (this.entities[i].position.y - this.entities[j].position.y) / distance;

                        }
                    }
                }   
            } 
        }

    }

}