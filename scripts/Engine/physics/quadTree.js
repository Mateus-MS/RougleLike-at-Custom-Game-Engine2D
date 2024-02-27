import { Vector2 } from "../../Utils/Vector2.js"
import { Draw } from "../../Utils/draw.js";

/**
* @param {RectangleRange} area - Should be a RectangleRange 
* @param {number} capacity - Number 
*/
export class QuadTree{

    constructor(area, capacity){

        this.area      = area;
        this.capacity  = capacity;
        this.entities  = [];
        this.isDivided = false;

    }

    subdivide(){

        //Seta como já foi dividido
        this.isDivided = true;

        this._topLeft  = new QuadTree(
            new RectangleRange(
                //position
                this.area.position,
                //size
                this.area.size.div(2)
            ),
            this.capacity
        );

        this._topRight = new QuadTree(
            new RectangleRange(
                //position
                new Vector2(
                    //x
                    this.area.position.x + this.area.size.x / 2,
                    //y
                    this.area.position.y
                ),
                //Size
                this.area.size.div(2)
            ),
            this.capacity
        );

        this._botLeft  = new QuadTree(
            new RectangleRange(
                //position
                new Vector2(
                    //x
                    this.area.position.x,
                    //y
                    this.area.position.y + this.area.size.y / 2
                ),
                //Size
                this.area.size.div(2)
            ),
            this.capacity
        );

        this._botRight = new QuadTree(
            new RectangleRange(
                //position
                this.area.position.add(this.area.size.div(2)),
                //size
                this.area.size.div(2)
            ),
            this.capacity
        );

    }

    /**
    * @param {Entity} entity - Entity
    * @returns {boolean} - Retorna true ou false se conseguiu ou não guardar a entidade dentro deste filho
    */
    insert(entity){

        //Se este ponto não estiver na região desta quadTree retorna
        if(!this.area.contains(entity)) return false

        //Enquanto o limite desta quadTree não for atingido, guarda as entidades na mesma
        if(this.entities.length < this.capacity && !this.isDivided){
            this.entities.push(entity)
            return true
        } else {
            
            //Quando o limite for antingido
            //Se ainda não tiver dividido
            if(!this.isDivided){
                //Divide
                this.subdivide();

                //Passa todas as entidades que estiverem guardadas nesta quadTree para seus filhos
                this.entities.forEach(ent => {
                    if(this._topLeft.insert(ent)){
                        return true;
                    } else 
                    if(this._topRight.insert(ent)){
                        return true;
                    } else 
                    if(this._botLeft.insert(ent)){
                        return true;
                    } else 
                    if(this._botRight.insert(ent)){
                        return true;
                    }
                })

                //Esvazia a lista
                this.entities = []

            }

            //Se já tiver sido divido insere a entidade nos filhos
            if(this._topLeft.insert(entity)){
                return true;
            } else 
            if(this._topRight.insert(entity)){
                return true;
            } else 
            if(this._botLeft.insert(entity)){
                return true;
            } else 
            if(this._botRight.insert(entity)){
                return true;
            }
            
        }

    }

    /**
    * @param area - Pode ser um RectangleRange ou CircleRange
    * @param founded - Não precisa passar mas se quiser mande um array vazio
    */
    query(area, founded){

        //Na primeira vez que for chamado founded sera === undefined
        if(!founded){
            founded = []
        }

        //Se a area não estiver "colidindo" com este QuadTree retorna o que foi encontrado até então
        if(!area.intersect(this.area)){
            return founded;
        } else {

            //Coloca todas as entidades que estiverem nesta QuadTree dentro da lista founded
            for(let i = 0; i < this.entities.length; i++){
                if(area.contains(this.entities[i])){
                    founded.push(this.entities[i])
                }
            }

            //Se ela tiver subdivisões
            if(this.isDivided){
                //Repete esta função nos filhos
                this._topLeft.query(area, founded)
                this._topRight.query(area, founded)
                this._botLeft.query(area, founded)
                this._botRight.query(area, founded)
            }

            return founded;

        }

    }

    //Debbugin purpose
    render(context){

        this.area.render(context, this.color)

        if(this.isDivided){
            this._topLeft.render(context);
            this._topRight.render(context);
            this._botLeft.render(context);
            this._botRight.render(context);
        }

    }

}

export class CircleRange{

    constructor(position, r){

        this.position = position;
        this.r        = r;
        this.r_sqrd   = r * r;

    }
    
    //Checa se essa entidade está no raio deste circulo
    contains(entity) {
        return Math.pow((entity.position.x - this.position.x), 2) + Math.pow((entity.position.y - this.position.y), 2) <= this.r_sqrd;
    }

    //Checa se este circulo está "colidindo" com um retangulo
    intersect(range) {

        var xDist = Math.abs(range.position.x - this.position.x);
        var yDist = Math.abs(range.position.y - this.position.y);
    
        var edges = Math.pow((xDist - range.size.x), 2) + Math.pow((yDist - range.size.y), 2);
    
        if (xDist > (this.r + range.size.x) || yDist > (this.r + range.size.y))
            return false;
    
        if (xDist <= range.size.x || yDist <= range.size.y)
            return true;
    
        return edges <= this.r_sqrd;

    }


    //Debbugin purpose
    render(context){

        Draw.circle({
            position: this.position,
            size    : this.r,
            border: {
                width: 3,
                color: "black"
            }
        }, context)

    }

}

/**
* @param {Vector2} position - Vector2
* @param {Vector2} size     - Vector2
*/
export class RectangleRange{

    constructor(position, size){

        this.position = position;
        this.size     = size;

    }

    //Checa se este retangulo está "colidindo" com outro retangulo
    intersect(area) {
        return (
            this.position.x < area.position.x + area.size.x &&
            this.position.x + this.size.x > area.position.x &&
            this.position.y < area.position.y + area.size.y &&
            this.position.y + this.size.y > area.position.y
        );
    }

    //Checa se esta entidade está dentro da area deste retangulo
    contains(entity){

        return (
            entity.position.x >= this.position.x &&
            entity.position.x <= this.position.x + this.size.x &&
            entity.position.y >= this.position.y &&
            entity.position.y <= this.position.y + this.size.y
        )
    
    }

    //Debbugin purpose
    render(context){

        Draw.rectangle({
            position: this.position,
            size    : this.size,
            border: {
                width: 3,
                color: "black"
            }
        }, context)

    }

}   