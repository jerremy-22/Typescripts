type FileSource = { path:string};
const fileSource:FileSource = {
    path:'some/path/to/file.csv'
};


type DBSource = { connectionUrl: string  };
const dbsource: DBSource = {
    type: 'db',
    connectionUrl: 'some-connection-url',
};

type Source = FileSource | DBSource;

  function loadData(source: Source) {
// Open + read file OR reach out to database server
if (typeof source === 'object' && 'path' in source ){
    // source.path; => use that to open the file


}
  }


 class User {
   constructor (public name : string) {}

    join() {
    //

    } 

     class Admin {
   constructor(permissions : string[]) {}


scan() {
  // ...

}
 


     }
 const user  = new User('Max');
const  admin = new Admin (['ban', 'restore']);

type Entity = User  | Admin;
  
function init(entity: Entity)  {
// .join()OR .scan()  ...

}



