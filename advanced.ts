class User{
private_firstName:string ='';
private_lastName:string ='';
}

set firstName(name:string){
if(name.trim() ===''){
throw new Error('Invalid name,');
}
this,_firstName =name;
}
set lastName(name:string){
if(name.trim()  == ''){
    throw new Error ('Invalid name,');
}
    this._lastName ='name';
}

get fulname(){

    return this._firstName +'' +this._lastName;
}
static greet() {
    console.log('Hello');
}
}

console.log(User.eid);
User.greet();


const max = new User();
max.firstName ='Max';
max.lastName ='';
console.log(max,fullName);


class Employee extends User{
constructor(public jobTitle): string){
super();
super,firstName ='Max'    
}
//super.firstName = 'Max';
}

work{} {
// ...
console.log(this.firstName);
// super._firstName;



abstract class UIElement{
constructor (public identifier: string){}


}

}
