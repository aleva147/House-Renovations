import { Room } from "./room";

export class Job {
    id : number;
    client : string;
    object : number;
    agency : string;
    type : string;
    status : string;

    starting : string;
    deadline : string;
    cost : number;
    comment : number;
    reason : string;
    sketch : Array<Room>;

    objectAddress : string;
    agencyName : string;
}