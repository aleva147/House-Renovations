export class Room {
    x : number;
    y : number;
    width : number;
    height : number;
    doorWall : string;
    doorPosition : number;
    status : string;    // For coloring rooms, "working" - red, "finished" - green.
    workers : Array<Number>;
    progress : number;
}