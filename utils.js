
const Utils  = () => {

    function _getRandomIntInclusive( min, max ) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; // including minimum and maximum
    }

    return class {

        constructor(){}

        randomNumbers( num ) {
            let arrayOfRandomsNum = [];
        
            for( let i = 0; i < num; i++ ) {
                arrayOfRandomsNum.push(_getRandomIntInclusive(0, 9));
            }
            return arrayOfRandomsNum;
        }

        createShortUrl ( url ) {
            let shortUrl = "";
            shortUrl =  this.randomNumbers(Math.floor(url.length / 2)).join('');
            return shortUrl
        }
    }

}

module.exports = Utils();