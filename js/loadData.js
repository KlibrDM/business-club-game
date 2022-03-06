$(document).ready(function(){
    //Update Global variables
    ChainList = loadChain();
    BusinessList = loadBusiness();
    ItemList = loadItem();
    UpgradesList = loadUpgrades();
    AchievementsList = loadAchievements();
    RankingList = loadRanking();

    //Load save game
    setTimeout(() => {
        loadGame();

        //Hide loading screen with animation
        setTimeout(() =>{
            $("#loading").addClass("fade-out");
        }, 300);
        setTimeout(() =>{
            $("#loading").hide();
        }, 500);
    }, 200);
});

function loadChain(){
    //Create a list in which we insert all the objects
    let list = [];
    Object.keys(ChainListData).forEach((entry) => {
        let element = ChainListData[entry];

        //Create the object
        let obj = new Chain(element.name, element.label);

        //Add the object into the list
        list[element.name] = obj;
    });
    //Return the list
    return list;
}

function loadBusiness(){
    //Create a list in which we insert all the objects
    let list = [];
    Object.keys(BusinessListData).forEach((entry) => {
        let e = BusinessListData[entry];

        //Create the object
        let obj = new Business(e.name, e.label, e.chain, e.type, e.price, e.managerprice, e.intake, e.intakeamount, e.output, e.outputamount, e.processingtime, e.chainposition, 0, false);
        
        //Add the object into the list
        list[e.name] = obj;
    });
    //Return the list
    return list;
}

function loadItem(){
    //Create a list in which we insert all the objects
    let list = [];
    Object.keys(ItemListData).forEach((entry) => {
        let e = ItemListData[entry];

        //Create the object
        let obj = new Item(e.name, e.label, e.price);
        
        //Add the object into the list
        list[e.name] = obj;
    });
    //Return the list
    return list;
}

function loadUpgrades(){
    //Upgrades are not just stored in a variable, they are dynamically created so we have to wait for them
    let list = [];

    let loadFinished = 0;
    if(!loadFinished){
        let wait = setInterval(() => {
            //Wait until the data we need is loaded
            if(Object.keys(UpgradesListData).length != 0){
                loadFinished = 1;
                clearInterval(wait);
                
                Object.keys(UpgradesListData).forEach((entry) => {
                    let e = UpgradesListData[entry];
            
                    //Create the object
                    let obj = new Upgrades(e.name, e.label, e.chain, e.business, e.type, e.price, e.multiplier, false);
                    
                    //Add the object into the list
                    list[e.name] = obj;
                });
            }
        }, 20);
    }

    //Return the list
    return list;
}

function loadAchievements(){
    //Achievements are not just stored in a variable, they are dynamically created so we have to wait for them
    let list = [];

    let loadFinished = 0;
    if(!loadFinished){
        let wait = setInterval(() => {
            //Wait until the data we need is loaded
            if(Object.keys(AchievementsListData).length != 0){
                loadFinished = 1;
                clearInterval(wait);

                Object.keys(AchievementsListData).forEach((entry) => {
                    let e = AchievementsListData[entry];

                    //Create the object
                    let obj = new Achievements(e.name, e.label, e.chain, e.business, e.type, e.condition, e.multiplier, false);
                    
                    //Add the object into the list
                    list[e.name] = obj;
                });
            }
        }, 20);
    }

    //Return the list
    return list;
}

function loadRanking(){
    //This is a simple list, no object needed
    return RankingListData;
}

//Load savegame data
function loadGame(){
    //Initialize chainOrder, will be used later
    let chainOrder = [];

    //If user has a savegame (basically not first time)
    if(localStorage.getItem('isGameSaved') != null){
        //If savegame is compatible
        if(localStorage.getItem('SaveGameCompatibilityVersion') == config_SAVE_GAME_COMPATIBILITY_VERSION){
            //Load user data
            userLoad = JSON.parse(localStorage.getItem('user'));
            user.name = userLoad._name;
            user.inventory = userLoad._inventory;
            user.money = userLoad._money;
            user.renderMoney();

            //Player Image Level
            if(localStorage.getItem('playerImageLevel') != null){
                playerImageLevel = localStorage.getItem('playerImageLevel');
            }

            //Load Businesses
            Object.keys(BusinessList).forEach((e) => {
                if(localStorage.getItem('BusinessList_'+e) != null){
                    let data = JSON.parse(localStorage.getItem('BusinessList_'+e));
                    BusinessList[e] = new Business(data._name, data._label, data._chain, data._type, data._price, data._managerPrice, data._intake, data._intakeAmount, data._output, data._outputAmount, data._processingTime, data._chainPosition, data._amount, data._hasManager);
                }
                BusinessList[e].updateBusinessDetails();
            });

            //Upgrades
            if(localStorage.getItem('ActiveUpgrades') != null){
                let activeUpgrades = JSON.parse(localStorage.getItem('ActiveUpgrades'));
                activeUpgrades.forEach((e) => {
                    UpgradesList[e].isActive = true;
                });
            }

            //Achievements
            if(localStorage.getItem('ActiveAchievements') != null){
                let activeAchievements = JSON.parse(localStorage.getItem('ActiveAchievements'));
                activeAchievements.forEach((e) => {
                    AchievementsList[e].isActive = true;
                });
            }

            //Chain Order
            if(localStorage.getItem('ChainOrder') != null){
                chainOrder = JSON.parse(localStorage.getItem('ChainOrder'));
            }

            //Empty businesses to load the saved ones
            $("#businesses").empty();
        }
        else{
            notify.add("Incompatible Save Game","error");
        }
    }
    //Else if user is first time, show tutorial
    else{
        showTutorial();
    }

    //Set businesses (and chains)
    setBusinesses();

    //Reorder chains
    if(chainOrder.length > 0){
        let loadFinished = 0;
        if(!loadFinished){
            let wait = setInterval(function(){ 
                //Wait until businesses are loaded
                if($("#businesses").children().length != 0){
                    loadFinished = 1;
                    clearInterval(wait);

                    //Reorder them
                    chainOrder.forEach((name) => {
                        $("#"+name).appendTo($("#businesses"));
                    });
                }
            }, 5);
        }
    }
    
    isGameLoaded = true;
}