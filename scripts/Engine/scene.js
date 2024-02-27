import { Engine } from "./engine.js";
import { Draw } from "../Utils/draw.js";
import { Player } from "../Entity/player.js";
import { Vector2 } from "../Utils/Vector2.js";
import { Mob } from "../Entity/mob.js";

import { CircleRange, QuadTree } from "./physics/quadTree.js";
import { RectangleRange } from "./physics/quadTree.js";

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
        for(let i = 0; i < 100; i++){ 
            this.entities.push(new Mob(Vector2.randomScreenPosition(this), 15, 'green'))
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
            entity.render(this.c, 'green')
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

        //Cria uma nova QuadTree
        let quad = new QuadTree(
            //QuadTree area
            new RectangleRange(
                new Vector2(-this.screen.half_w, -this.screen.half_h),
                new Vector2(this.screen.w, this.screen.h)
            ),
            //Capacidade maxima de cada galho
            5
        )

        //TO_DO_BETTER
        this.entities.forEach(entity => {
            quad.insert(entity)
        })

        //Itera sob todos as entidades
        for(let i = 0; i < this.entities.length; i++){

            //Cria uma area ao redor desta entidade com o dobro do raio dela
            let area = new CircleRange(this.entities[i].position, this.entities[i].size * 2);
            //Procura qualquer outra entidade que exista nesta area
            let closest_entities = quad.query(area);

            //Itera sob qualquer entidade que exista nessa area
            for(let j = 0; j < closest_entities.length; j++){

                //impede que teste com ele mesmo
                //TO_DO_BETTER
                if(this.entities[i] !== closest_entities[j]){

                    let distance = this.entities[i].position.distance(closest_entities[j].position); 
                    let sum_radi = this.entities[i].size + closest_entities[j].size;
                    
                    //Se as duas entidades estiverem sobrepostas
                    if(distance <= sum_radi){
                        
                        //Chama a função de colisão de cada entidade
                        if(this.entities[i].onCollision) this.entities[i].onCollision();
                        if(closest_entities[j].onCollision) closest_entities[j].onCollision();
                        
                        //Se ambas forem Mobs
                        if(this.entities[i] instanceof Mob && closest_entities[j] instanceof Mob){
                            
                            let overlap = .5 * (distance - this.entities[i].size - closest_entities[j].size);
                            
                            this.entities[i].position.x -= overlap * (this.entities[i].position.x - closest_entities[j].position.x) / distance;
                            this.entities[i].position.y -= overlap * (this.entities[i].position.y - closest_entities[j].position.y) / distance;
                            
                            closest_entities[j].position.x += overlap * (this.entities[i].position.x - closest_entities[j].position.x) / distance;
                            closest_entities[j].position.y += overlap * (this.entities[i].position.y - closest_entities[j].position.y) / distance;

                        }
                    }
                }   
            } 
        }

    }

}