export class Draw{

    constructor(scene){
        this.c = scene.c;
    }

    default(func){

        this.c.beginPath();
        func();
        this.c.closePath();

    }

    /**
    *  @param color    - String
    *  @param position - Vector2 
    *  @param size     - Number 
    */
    circle(obj){

        this.default(()=>{
            this.c.fillStyle = obj.color;
            this.c.arc(obj.position.x, obj.position.y, obj.size, 0, Math.PI * 2);
            this.c.fill();
        })
    
    }

    /**
    *  @param color    - String
    *  @param position - Vector2 
    *  @param size     - Number 
    */
    static circle(obj, context){

        context.beginPath();
        context.fillStyle = obj.color;
        context.arc(obj.position.x, obj.position.y, obj.size, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    
    }

    /** 
    * @param color - String 
    * @param width - Number
    * @param start - Vector2
    * @param end   - Vector2 
    */
    line(obj){

        this.default(()=>{
            this.c.strokeStyle = obj.color;
            this.c.lineWidth   = obj.width;
            this.c.moveTo(obj.start.x, obj.start.y);
            this.c.lineTo(obj.end.x  , obj.end.y);
            this.c.stroke();
        })

    }

    /** 
    * @param color - String 
    * @param width - Number
    * @param start - Vector2
    * @param end   - Vector2 
    */
    static line(obj, context){

        context.beginPath();
        context.strokeStyle = obj.color;
        context.lineWidth   = obj.width;
        context.moveTo(obj.start.x, obj.start.y);
        context.lineTo(obj.end.x  , obj.end.y);
        context.stroke();
        context.closePath();

    }

    /** 
    * @param color     - String 
    * @param textAlign - String
    * @param size      - Number
    * @param position  - Vector2 
    * @param text  - String 
    */
    text(obj){

        this.default(()=>{
            this.c.fillStyle = obj.color;
            this.c.textAlign = obj.align;
            this.c.font      = obj.size + "px arial";
            this.c.fillText(obj.text, obj.position.x, obj.position.y);
            this.c.fill();
        })

    }

    /** 
    * @param color     - String 
    * @param textAlign - String
    * @param size      - Number
    * @param position  - Vector2 
    * @param text  - String 
    */
    static text(obj, context){

        context.beginPath();
        context.fillStyle = obj.color;
        context.textAlign = obj.align;
        context.font      = obj.size + "px arial";
        context.fillText(obj.text, obj.position.x, obj.position.y);
        context.fill();
        context.closePath();

    }

    /** 
    * @param color - String; 
    * @param position - Vector2; 
    * @param size - Number; 
    */
    square(obj){
    
        this.default(()=>{
            this.c.fillStyle = obj.color;
            this.c.rect(obj.position.x, obj.position.y, obj.size, obj.size);
            this.c.fill();
        })
    
    }

    /** 
    * @param color - String; 
    * @param position - Vector2; 
    * @param size - Number; 
    */
    static square(obj, context){
    
        context.beginPath();
        context.fillStyle = obj.color;
        context.rect(obj.position.x, obj.position.y, obj.size, obj.size);
        context.fill();
        context.closePath();
    
    }

    /** 
    * @param color - String; 
    * @param position - Vector2; 
    * @param size - Vector2; 
    */
    rectangle(obj){
    
        this.default(()=>{
            this.c.fillStyle = obj.color;
            this.c.rect(obj.position.x, obj.position.y, obj.size.x, obj.size.y);
            this.c.fill();
        })
    
    }

    static rectangle(obj, context){
    
            context.beginPath();
            context.fillStyle = obj.color;
            context.rect(obj.position.x, obj.position.y, obj.size.x, obj.size.y);
            context.fill();
            context.closePath();
        
    
    }

}