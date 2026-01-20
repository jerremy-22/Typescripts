type  DataStore = {
    [prop:string]:  number| boolean;
};

let store:  DataStore  = {};

// ...
store.id = 5;
store.isOpen = false;
// store.name = 'Max';


let roles = ['admin', 'user', 'guest', 'editor',]  as const;
// roles.push('max');
const firstRole = roles[0];
store.name= 'Max';
store.isInstructor = true;