function getLength(val: string )
  function getLength(val :string   |string   any []) {
    if (typeof val  === 'string') {
        const numberOfWords = val.split('').length;
        return ${numberOfWords}  words;
    }
    return val.length;
    }
  }  

const numOfWords = getLength('does this work?');
// numOfWords.length;
const numItems = getLength(['Sports','Cookies']);


