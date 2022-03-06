var AchievementsListData = {};

let achievementsLoadFinished = 0;
if(!achievementsLoadFinished){
    let wait = setInterval(function(){ 
        //Wait until the data we need is loaded
        if(Object.keys(BusinessListData).length != 0 && Object.keys(ChainListData).length != 0){
            achievementsLoadFinished = 1;
            clearInterval(wait);

            //Business Achievements
            Object.keys(BusinessListData).forEach((e) => {
                let Business = BusinessListData[e];

                //Below is array of conditions that has to be met to unlock achievement
                [100,200,300,400,500,750,1000,1500,2000,2500].forEach((cond, index) => {
                    let multiplier = 1;
                    if(cond < 500){ multiplier = 2; }
                    else if(cond < 1000){ multiplier = 3; }
                    else if(cond < 2500){ multiplier = 4; }
                    else if(cond >= 2500){ multiplier = 5; }
                    AchievementsListData[e+index] = {
                        "name": Business.name+index,
                        "label": Business.label + " Milestone " + (index+1),
                        "chain": Business.chain,
                        "business": Business.name,
                        "type": "output_multiplier",
                        "condition": cond,
                        "multiplier": multiplier,
                    }
                });
            });

            //Chain Achievements (General for each chain)
            Object.keys(ChainListData).forEach((e) => {
                let Chain = ChainListData[e];
                //Array of conditions
                [10,50,150,500,1250,2500].forEach((cond, index) => {
                    AchievementsListData[e+index] = {
                        "name": Chain.name+index,
                        "label": Chain.label + " milestone " + (index+1),
                        "chain": Chain.name,
                        "business": "generalachievement",
                        "type": "processing_time_multiplier",
                        "condition": cond,
                        "multiplier": 2,
                    }
                });
            });
        }
    }, 20);
}