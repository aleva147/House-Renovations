export class Room {
    x : number;
    y : number;
    width : number;
    height : number;
    doorWall : string;
    doorPosition : number;
    status : string;    // Za bojenje prostorije, "working" crveno, "finished" zelenom, "none" belo.
    workers : Array<number>;
    progress : number;

    workersNames : Array<string>;

    constructor(x,y,width,height,doorWall,doorPosition) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.doorWall = doorWall;
        this.doorPosition = doorPosition;
        this.status = "none";
        this.workers = new Array<number>;
        this.progress = 0;
    }
}