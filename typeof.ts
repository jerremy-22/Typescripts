const  userName ='Max';

console.log(typeof userName);
type userName= typeof userName;

const settings={
diffculty:'hard',
minLevel:10,
didStart:false,
players: ['Max', 'Jane']


}



type Settings = {
    diffculty : string
    minLevel :number;


function loadData(settings: Settings){
    // ...
}

loadData(settings);

