type User ={ name: string; age: number };
type UserKeys = keyof User;

let validKey: UserKeys;

validKey = 'name';
validKey='age';






