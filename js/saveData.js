//Autosave data every 10 seconds
setInterval(() => {
    saveGame();
}, 10000);

function saveGame(){
    //Set so load knows if it's on initial load
    localStorage.setItem('isGameSaved', 1);

    //Set savegame compatibility version
    localStorage.setItem("SaveGameCompatibilityVersion", config_SAVE_GAME_COMPATIBILITY_VERSION);

    //Save user
    localStorage.setItem('user', JSON.stringify(user));

    //Save player image level
    localStorage.setItem('playerImageLevel', currentPlayerImage);

    //Save chain order
    let chainOrder = [];
    let children = $("#businesses").children();
    children.map((e) => {
        chainOrder.push(children[e].id);
    });
    localStorage.setItem('ChainOrder', JSON.stringify(chainOrder));

    //Save businesses
    Object.keys(BusinessList).forEach((e) => {
        localStorage.setItem('BusinessList_'+e, JSON.stringify(BusinessList[e]));
    });

    //Save upgrades
    let StoreUpgradesList = [];
    Object.keys(UpgradesList).forEach((e) => {
        if(UpgradesList[e].isActive){
            StoreUpgradesList.push(e);
        }
    });
    localStorage.setItem('ActiveUpgrades', JSON.stringify(StoreUpgradesList));

    //Save achievements
    let StoreAchievementsList = [];
    Object.keys(AchievementsList).forEach((e) => {
        if(AchievementsList[e].isActive){
            StoreAchievementsList.push(e);
        }
    });
    localStorage.setItem('ActiveAchievements', JSON.stringify(StoreAchievementsList));
}