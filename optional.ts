function generateError(msg:string){
throw new error(msg);
}

generateError();



type User={
    name:string;
    age:number;
    role?:'admin' |'guest'
};

let input = null;
const didProvideInput = input || false;
