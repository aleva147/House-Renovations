import { Room } from "./room";

export class Objectt {
    id : number;
    client : string;
    type : string;
    address : string;
    numOfRooms : number;
    sqFootage : number;
    sketch : Array<Room>;

    workInProgress : boolean = false;
}