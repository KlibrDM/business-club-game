$(document).ready(function(){
  setInitialInventory();
  checkResolution();

  let waitForLoad = setInterval(() => {
    if(isGameLoaded){
      clearInterval(waitForLoad);
      setPlayerImage();
    }
  }, 20);
});


/*---------------
--    USER     --
---------------*/ 

var user = new User("Player");

//SET INITIAL INVENTORY - couldn't make it work in user class for some reason...
//And then show quicksell inventory
function setInitialInventory(){
  let loadFinished = 0;
  if(!loadFinished){
    let wait = setInterval(function(){ 
      //Wait until the data we need is loaded
      if(Object.keys(ItemList).length != 0){
        loadFinished = 1;
        clearInterval(wait);

        //Add items to inventory
        Object.keys(ItemList).forEach((e) => {
          user.inventory[ItemList[e].name] = 0;
        });

        //Show quicksell inventory
        user.showQuicksellInventory();
      }
    }, 20);
  }
}


/*----------------
--Buy Multiplier--
----------------*/

var buyMultipliers = [1, 10, 100, -1];
var buyMultiplierIndex = 0;
var buyMultiplier = buyMultipliers[buyMultiplierIndex];

$("#purchase-multiplier-section").click(() => {
  //Change buy multipliers
  buyMultiplierIndex ++;
  if(buyMultiplierIndex > 3) { buyMultiplierIndex = 0; }

  buyMultiplier = buyMultipliers[buyMultiplierIndex];

  //Update multiplier section
  if(buyMultiplier == -1){
    $("#purchase-multiplier").html("Max");
  }
  else{
    $("#purchase-multiplier").html("x"+buyMultiplier);
  }

  //Update how business price based on multiplier
  Object.keys(BusinessList).forEach((e) => {
    let Business = BusinessList[e];
    Business.updateBusinessDetails();
  });
});


/*----------------
--Sell perc. all--
----------------*/

$("#sell-percentage-of-all-section").click(() => {
  Object.keys(ItemList).forEach((name) => {
    let amount = Math.floor(user.inventory[name]);
    amount = user.getClosestAmountToPercentage(amount);
    if(amount >= 1){
      user.sellItem(name, amount);
      user.updateInventory();
    }
  });
});


/*----------------
--  Businesses  --
----------------*/ 

//This was initially called here, but now it's called in loadData once we loaded the savegame (if existent)
function setBusinesses(){
  let loadFinished = 0;
  if(!loadFinished){
    let wait = setInterval(function(){ 
      //Wait until the data we need is loaded
      if(Object.keys(BusinessList).length != 0 && Object.keys(ChainList).length != 0){
        loadFinished = 1;
        clearInterval(wait);

        //Render Chains
        Object.keys(ChainList).forEach((e) => {
          let Chain = ChainList[e];
          Chain.renderChainBox();
        });

        //Render Businesses in chains
        Object.keys(BusinessList).forEach((e) => {
          let Business = BusinessList[e];
          Business.renderBusinessBox();
          Business.startManagers();
        });

        //ENABLE TOOLTIPS BOOTSTRAP
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        });
      }
    }, 20);
  }
}


/*----------------
-- Notifications--
----------------*/ 

var notify = new Notifications();


/*----------------
--   Resizing   --
----------------*/ 

//Tell the user to rotate device (mostly phones) if playing on vertical screen

$(window).resize(function() {
  checkResolution();
});

function checkResolution(){
  if(window.innerWidth*1.3 < window.innerHeight){
    $("#app").hide();
    $("#rotate").show();
  }
  else{
    $("#app").show();
    $("#rotate").hide();
  }
}


/*-----------------
-- Button events --
-----------------*/

//POP-UP
$("#pop-up-close").click(() => {
  $("#pop-up-section").hide();
  user.isInventoryOpen = false;
});

//INVENTORY
$("#menu_inventory").click(() => {
  user.showInventory();
  user.isInventoryOpen = true;
});

//BUSINESSES
$("#menu_businesses").click(() => {
  user.showBusinesses();
});

//MANAGERS
$("#menu_managers").click(() => {
  user.showManagers();
});

//UPGRADES
$("#menu_upgrades").click(() => {
  user.showUpgrades();
});

//ACHIEVEMENTS
$("#menu_achievements").click(() => {
  user.showAchievements();
});

//RANKING
$("#menu_ranking").click(() => {
  user.showRanking();
});

//SAVE
$("#menu_save").click(() => {
  saveGame();
  notify.add("Game saved","success");
});


/*---------------
-- Profile Pic --
---------------*/ 

//Update profile pic based on how rich the user is

setInterval(() => {
  setPlayerImage();
}, 5250);

var playerImageLevel = 1;
let currentPlayerImage = 1;

function setPlayerImage(){
  if(user.money >= 1000000000000000000){
    playerImageLevel = 7;
  }
  else if(user.money >= 1000000000000000 && playerImageLevel < 6){
    playerImageLevel = 6;
  }
  else if(user.money >= 1000000000000 && playerImageLevel < 5){
    playerImageLevel = 5;
  }
  else if(user.money >= 1000000000 && playerImageLevel < 4){
    playerImageLevel = 4;
  }
  else if(user.money >= 1000000 && playerImageLevel < 3){
    playerImageLevel = 3;
  }
  else if(user.money >= 10000 && playerImageLevel < 2){
    playerImageLevel = 2;
  }
  
  if(currentPlayerImage < playerImageLevel){
    $("#player-image").attr("src","img/player/businessman"+playerImageLevel+".jpg");
    currentPlayerImage = playerImageLevel;
  }
}


/*------------------
-- NumberBeautify --
------------------*/ 

function numberBeautify(amount){
  if(amount/1000000000000000000000000000000000 >= 1){
    return (amount/1000000000000000000000000000000000).toFixed(3)*1+" decillion";
  }
  else if(amount/1000000000000000000000000000000 >= 1){
    return (amount/1000000000000000000000000000000).toFixed(3)*1+" nonillion";
  }
  else if(amount/1000000000000000000000000000 >= 1){
    return (amount/1000000000000000000000000000).toFixed(3)*1+" octillion";
  }
  else if(amount/1000000000000000000000000 >= 1){
    return (amount/1000000000000000000000000).toFixed(3)*1+" septillion";
  }
  else if(amount/1000000000000000000000 >= 1){
    return (amount/1000000000000000000000).toFixed(3)*1+" sextillion";
  }
  else if(amount/1000000000000000000 >= 1){
    return (amount/1000000000000000000).toFixed(3)*1+" quintillion";
  }
  else if(amount/1000000000000000 >= 1){
    return (amount/1000000000000000).toFixed(3)*1+" quadrillion";
  }
  else if(amount/1000000000000 >= 1){
    return (amount/1000000000000).toFixed(3)*1+" trillion";
  }
  else if(amount/1000000000 >= 1){
    return (amount/1000000000).toFixed(3)*1+" billion";
  }
  else if(amount/1000000 >= 1){
    return (amount/1000000).toFixed(3)*1+" million";
  }
  else{
    return amount.toFixed(2)*1;
  }
}