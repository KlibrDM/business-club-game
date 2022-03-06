var UpgradesListData = [];

let upgradesLoadFinished = 0;
if(!upgradesLoadFinished){
    let wait = setInterval(function(){ 
        //Wait until the data we need is loaded
        if(Object.keys(BusinessListData).length != 0){
            upgradesLoadFinished = 1;
            clearInterval(wait);

            //The upgrades will have some kind of a random label, based on a seed
            let seed = 1055;
            let paragraphs = [
                "Lets go!", "Better marketing", "High efficiency", "Skilled workers", "Business go BRRRR", "Best Businessman",
                "Big bucks", "More! More! More!", "Second gear", "Loyal Customers", "Sales team", "Oil change", "Productivity increase",
                "Motivated employees", "Not too shabby"
            ];
            let randomParagraphs = [];
            let prevRand = 0;

            for(let i = 0; i < (Object.keys(BusinessListData).length * 7); i++){
                let rand = Math.floor(Math.sin(seed+i) * (paragraphs.length - 1));
                if(rand < 0){ rand= -rand; }
                
                for(let j = 0; rand == prevRand; j++){
                    rand = Math.floor(Math.sin(seed+j) * (paragraphs.length - 1));
                    if(rand < 0){ rand= -rand; }
                }

                randomParagraphs.push(paragraphs[rand]);
                prevRand = rand;
            }

            let paragraphIndex = 0;

            //Business upgrades
            //Bellow is an array of price multipliers (business price * multiplier)
            [60,12000,2400000,480000000,96000000000,19200000000000,3840000000000000].forEach((priceMultiplier, index) => {
                Object.keys(BusinessListData).forEach((e) => {
                    let Business = BusinessListData[e];
                    let type = "intake_output_multiplier";
                    let multiplier = 2;
                    if(index % 2 == 0){ 
                        type="output_multiplier";
                        multiplier = 3;
                    }
                    //First upgrade is a small one
                    if(index == 0){
                        multiplier = 1.5;
                    }
                    if(index >= 5){
                        multiplier *= 1.25;
                    }

                    UpgradesListData[e+index] = {
                        "name": Business.name+index,
                        "label": randomParagraphs[paragraphIndex],
                        "chain": Business.chain,
                        "business": Business.name,
                        "type": type,
                        "price": Business.price * priceMultiplier,
                        "multiplier": multiplier,
                    }

                    paragraphIndex++;
                });
            });

            //Randomly selected paragraph index to make sure the general upgrade labels aren't the same as the ones in the other chains
            paragraphIndex = 7;

            //General upgrades
            [1,1000,1000000,1000000000,1000000000000].forEach((price, index) => {
                UpgradesListData["generalupgrade"+index] = {
                    "name": "generalupgrade"+index,
                    "label": randomParagraphs[paragraphIndex],
                    "chain": "generalupgrade",
                    "business": "generalupgrade",
                    "type": "output_multiplier",
                    "price": price * 1000000000,
                    "multiplier": index+2,
                }

                paragraphIndex++;
            });
        }
    }, 20);
}