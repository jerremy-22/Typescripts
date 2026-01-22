function logger (target: any, ctx: ClassDecoratorContext) { 
console.log('logger decorator');
console.log(target);
console.log(ctx);


return class extends target{
    constructor(...args: any [])  {
        super(... args);
        console.log('class constructor');
    }
    age= 35;
};

}


@logger 
 class Person {
   name ='Max';

   greet (){
console.log('Hi, I am ' + this. name);

   }

 }

 const max = new Person();
 max.greet();
 console.log(max);


