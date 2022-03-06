class User{
  constructor(name){
    this.name = name;
    this.money = config_STARTING_MONEY;
    this.inventory = {};
    this.isInventoryOpen = false;
    this.itemSellPercentage = 80;
    this.lastPopUpChainSelected = "chainlemonade";

    //Start inventory auto updater
    this.updateInventoryAtInterval();
  }


  set name(name){
    this._name = name;
  }
  set money(money){
    this._money = money;
    //Render money at object creation
    this.renderMoney();
  }
  set inventory(inventory){
    this._inventory = inventory;
  }
  set isInventoryOpen(isInventoryOpen){
    this._isInventoryOpen = isInventoryOpen;
  }
  set itemSellPercentage(itemSellPercentage){
    this._itemSellPercentage = itemSellPercentage;
  }
  set lastPopUpChainSelected(lastPopUpChainSelected){
    this._lastPopUpChainSelected = lastPopUpChainSelected;
  }


  get name(){
    return this._name;
  }
  get money(){
    return this._money;
  }
  get inventory(){
    return this._inventory;
  }
  get isInventoryOpen(){
    return this._isInventoryOpen;
  }
  get itemSellPercentage(){
    return this._itemSellPercentage;
  }
  get lastPopUpChainSelected(){
    return this._lastPopUpChainSelected;
  }


  /*-------------------
  --  Manage Money   --
  -------------------*/ 

  addMoney(amount){
    if(amount < 0){
      //notify.add("Operation 'remove money' failed: Negative amount or zero");
      return 0;
    }
    this._money += amount;
    this.renderMoney();
    return 1;
  }

  removeMoney(amount){
    if(amount < 0){
      //notify.add("Operation 'remove money' failed: Negative amount or zero");
      return 0;
    }
    if(this.money-amount < 0){
      //notify.add("Operation 'remove money' failed: Not enough money");
      return 0;
    }
    this._money -= amount;
    this.renderMoney();
    return 1;
  }

  renderMoney(){
    $("#money").html(config_CURRENCY_SIGN+numberBeautify(this._money));
  }


  /*-------------------
  --  Manage Items   --
  -------------------*/ 

  addItem(item, amount){
    //Check if everything is allright
    if(amount <= 0){
      //notify.add("Operation 'add item' failed: Negative amount or zero: " + amount);
      return 0;
    }
    if(!Object.keys(ItemList).includes(item)){
      //notify.add("Operation 'add item' failed: Invalid item: " + item);
      return 0;
    }

    //If all passed
    if(this.inventory.hasOwnProperty(item)){
      //If item exists in inventory, increase the amount
      this.inventory[item] += amount;
    }
    else{
      //If it doesn't exist in inventory, add the first amount
      this.inventory[item] = amount;
    }
    return 1;
  }

  removeItem(item, amount){
    //Check if everything is allright
    if(amount <= 0){
      //notify.add("Operation 'remove item' failed: Negative amount or zero: " + amount);
      return 0;
    }
    if(!Object.keys(ItemList).includes(item)){
      //notify.add("Operation 'remove item' failed: Invalid item: " + item);
      return 0;
    }
    if(!this.inventory.hasOwnProperty(item)){
      //notify.add("Operation 'remove item' failed: User doesn't have item: " + item);
      return 0;
    }
    if(amount > this.inventory[item]){
      //notify.add("Operation 'remove item' failed: Trying to remove more than user has: " + this.inventory[item]);
      return 0;
    }

    //If all passed
    this.inventory[item] -= amount;
    return 1;
  }

  sellItem(item, amount){
    //Check if everything is allright
    if(amount <= 0){
      //notify.add("Operation 'sell item' failed: Negative amount or zero: " + amount);
      return 0;
    }
    if(!Object.keys(ItemList).includes(item)){
      //notify.add("Operation 'sell item' failed: Invalid item: " + item);
      return 0;
    }
    if(!this.inventory.hasOwnProperty(item)){
      //notify.add("Operation 'sell item' failed: User doesn't have item: " + item);
      return 0;
    }
    if(amount > this.inventory[item]){
      //notify.add("Operation 'sell item' failed: Trying to sell more than user has: " + this.inventory[item]);
      return 0;
    }

    //If all passed, give user the money
    let price = ItemList[item].price;
    let sum = price * amount;
      
    this.inventory[item] -= amount;
    this.money += sum;
    return 1;
  }


  /*-------------------
  --Manage Inventory --
  -------------------*/ 

  //Create the buttons and content div for each chain in the pop-ups
  createChainEntriesInPopUp(){
    //Create selection element and container element
    let element = `
      <div class="pop-up-chain-selection" id="pop-up-chain-selection"></div>
      <div class="pop-up-content-box" id="pop-up-content-box"></div>`;
    $("#pop-up-content").append(element);

    //Create the chain entries
    Object.keys(ChainList).forEach((e) => {
      let Chain = ChainList[e];

      let buttonElement = `
        <button class="pop-up-chain-button accent-color-1" id="pop-up-chain-button_`+Chain.name+`">`+Chain.label+`</button>
      `;
      $("#pop-up-chain-selection").append(buttonElement);

      let contentElement = `
        <div class="pop-up-chain-content" id="pop-up-chain-content_`+Chain.name+`"></div>
      `;
      $("#pop-up-content-box").append(contentElement);


      //After adding them all, show only the one we need
      $("#pop-up-content-box").children().hide();

      //If general is last selected, set Lemonade chain as last
      //Because only one menu has the general submenu
      if(this.lastPopUpChainSelected == "generalupgrade"){ this.lastPopUpChainSelected = "chainlemonade"; }

      $("#pop-up-chain-content_"+this.lastPopUpChainSelected).show();


      //EVENT LISTENER FOR CHAIN SELECTION BUTTONS
      $("#pop-up-chain-button_"+Chain.name).click(() => {
        //Hide all chains
        $("#pop-up-content-box").children().hide();

        //Show the chain we need
        $("#pop-up-chain-content_"+Chain.name).show();

        //Set it as last selected
        this.lastPopUpChainSelected = Chain.name;
      });
    });
  }

  //Show inventory in pop-up
  showInventory(){
    $("#pop-up-content").empty();
    $("#pop-up-title").html("<i class='fa-solid fa-warehouse'></i> Inventory");
    
    this.createChainEntriesInPopUp();

    //Sooo... createChainEntriesInPopUp created all chains, but not all chains have items to show in inventory
    //THEREFORE, the extra chains now have to be deleted
    Object.keys(ChainList).forEach((chainName) => {
      let chainHasItems = 0;

      //Look through all businesses in the chain to see if any of them have products
      Object.keys(BusinessList).forEach((businessName) => {
        if(BusinessList[businessName].chain == chainName){
          if(BusinessList[businessName].type == "product"){
            chainHasItems = 1;
          }
        }
      });

      //If no business has products, remove the chain from inventory
      if(!chainHasItems){
        $("#pop-up-chain-button_"+chainName).remove();
        $("#pop-up-chain-content_"+chainName).remove();

        //If last selected was a business with no products, go to default chain (which is chainlemonade)
        if(this.lastPopUpChainSelected == chainName){ this.lastPopUpChainSelected = "chainlemonade"; }
        $("#pop-up-chain-content_"+this.lastPopUpChainSelected).show();
      }
    });

    //Create the item entries
    Object.keys(this.inventory).forEach((name) => {
      let ownedAmount = this.inventory[name];

      let producedBy = {};
      //Parse the businesses to see what produces the item
      Object.keys(BusinessList).forEach((e) => {
        if(BusinessList[e].output == name){ producedBy = BusinessList[e]; }
      });

      let itemObject = {};
      //Parse the items to get the object
      Object.keys(ItemList).forEach((e) => {
        if(ItemList[e].name == name){ itemObject = ItemList[e]; }
      });

      //Create element for prices (% and all) if user owns item
      let pricesElement = ``;
      if(ownedAmount > 0){
        pricesElement = `
          <p class="inventory-percentage-price" id="inventory-percentage-price_`+name+`">Price for `+this.itemSellPercentage+`%: $`+numberBeautify(this.getPercentagePrice(ownedAmount, itemObject.price))+`</p>
          <p class="inventory-all-price" id="inventory-all-price_`+name+`">Price for `+numberBeautify(ownedAmount)+`: $`+numberBeautify(itemObject.price*ownedAmount)+`</p>
        `
      }

      //Create element for item
      let element = `
        <div class="inventory-item-box accent-color-0">
          <div class="inventory-image-box">
            <img src="img/business/`+producedBy.name+`.png" draggable="false" alt="`+itemObject.label+`" class="inventory-image">
            <p class="inventory-amount accent-color-1" id="inventory-amount_`+name+`">`+numberBeautify(ownedAmount)+`</p>
          </div>
          <div class="inventory-item-details">
            <h5 class="inventory-item-name">`+itemObject.label+`</h5>
            <p class="inventory-unit-price">Price for 1: $`+itemObject.price+`</p>
            `+pricesElement+`
          </div>
          
          <div class="inventory-data-box">
            <button class="inventory-button inventory-sell-button accent-color-1" id="inventory-sell-unit-button_`+name+`">Sell 1</button>
            
            <div class="inventory-percentage-button-group">
              <button class="inventory-button inventory-sell-percentage-button accent-color-1" id="inventory-sell-percentage-button_`+name+`">Sell `+this.itemSellPercentage+`%</button>
              <div class="inventory-percentage-mover-buttons">
                <button class="inventory-button inventory-percentage-mover-button accent-color-1" id="inventory-percentage-mover-button-increase_`+name+`"><i class="fa-solid fa-angle-up"></i></button>
                <button class="inventory-button inventory-percentage-mover-button accent-color-1" id="inventory-percentage-mover-button-decrease_`+name+`"><i class="fa-solid fa-angle-down"></i></button>
              </div>
            </div>
            
            <button class="inventory-button inventory-sell-all-button accent-color-1" id="inventory-sell-all-button_`+name+`">Sell All</button>
          </div>
        </div>
      `;
      $("#pop-up-chain-content_"+producedBy.chain).append(element);


      //EVENT LISTENER FOR PERCENTAGE INCREASE/DECREASE
      $("#inventory-percentage-mover-button-increase_"+name).click(() => {
        if(this.itemSellPercentage < 100){
          this.itemSellPercentage += 5;
          //This shouldn't happen but let's make sure it doesn't break if it does
          if(this.itemSellPercentage > 100){
            this.itemSellPercentage = 100;
          }
          //Update buttons
          this.updateSellPercentageButtons();
        }
      });
      $("#inventory-percentage-mover-button-decrease_"+name).click(() => {
        if(this.itemSellPercentage > 5){
          this.itemSellPercentage -= 5;
          //This shouldn't happen but let's make sure it doesn't break if it does
          if(this.itemSellPercentage < 5){
            this.itemSellPercentage = 5;
          }
          //Update buttons
          this.updateSellPercentageButtons();
        }
      });


      //EVENT LISTENER FOR SELL BUTTONS

      //Unit
      $("#inventory-sell-unit-button_"+name).click(() => {
        let amount = Math.floor(this.inventory[name]);
        if(amount >= 1){
          this.sellItem(name, 1);
          this.updateInventory();
        }
        else{
          notify.add("Can't sell "+itemObject.label+". Minimum amount required is 1", "error");
        }
      });

      //Percentage
      $("#inventory-sell-percentage-button_"+name).click(() => {
        let amount = Math.floor(this.inventory[name]);
        amount = this.getClosestAmountToPercentage(amount);
        if(amount >= 1){
          this.sellItem(name, amount);
          this.updateInventory();
        }
        else{
          notify.add("Can't sell "+itemObject.label+". Minimum amount required is 1", "error");
        }
      });

      //All
      $("#inventory-sell-all-button_"+name).click(() => {
        let amount = Math.floor(this.inventory[name]);
        if(amount >= 1){
          this.sellItem(name, amount);
          this.updateInventory();
        }
        else{
          notify.add("Can't sell "+itemObject.label+". Minimum amount required is 1", "error");
        }
      });
    });
    $("#pop-up-section").show();
  }

  //Show quicksell inventory in sidebar (right)
  showQuicksellInventory(){
    Object.keys(this.inventory).forEach((name) => {
      let ownedAmount = this.inventory[name];

      let producedBy = {};
      //Parse the businesses to see what produces the item
      Object.keys(BusinessList).forEach((e) => {
        if(BusinessList[e].output == name){ producedBy = BusinessList[e]; }
      });

      let itemObject = {};
      //Parse the items to get the object
      Object.keys(ItemList).forEach((e) => {
        if(ItemList[e].name == name){ itemObject = ItemList[e]; }
      });

      //Create element for each item
      let element = `
        <div class="quicksell-inventory-item-box accent-color-0">
          <div class="quicksell-inventory-image-box">
            <img src="img/business/`+producedBy.name+`.png" draggable="false" alt="`+itemObject.label+`" class="quicksell-inventory-image">
            <p class="quicksell-inventory-amount accent-color-1" id="quicksell-inventory-amount_`+name+`">`+numberBeautify(ownedAmount)+`</p>
          </div>
          <div class="quicksell-inventory-data-box">
            <p class="quicksell-inventory-item-name">`+itemObject.label+`</p>
            <button class="quicksell-inventory-button inventory-sell-percentage-button accent-color-1" id="quicksell-inventory-sell-percentage-button_`+name+`">Sell `+this.itemSellPercentage+`%</button>
          </div>
        </div>
      `;
      $("#quicksell-inventory").append(element);

      //Event listener for percentage sell button
      $("#quicksell-inventory-sell-percentage-button_"+name).click(() => {
        let amount = Math.floor(this.inventory[name]);
        amount = this.getClosestAmountToPercentage(amount);
        if(amount >= 1){
          this.sellItem(name, amount);
          this.updateInventory();
        }
        else{
          notify.add("Can't sell "+itemObject.label+". Minimum amount required is 1", "error");
        }
      });
    });
  }

  getPercentagePrice(amount, price){
    return this.getClosestAmountToPercentage(amount)*price;
  }

  getClosestAmountToPercentage(amount){
    return Math.floor((Math.floor(amount)*this.itemSellPercentage)/100);
  }

  updateInventoryAtInterval(){
    //Inventory will be updated at a specific interval to prevent a bunch of numbers just flying around
    setInterval(() => {
      this.updateInventory();
    }, 500);
  }

  updateInventory(){
    Object.keys(this.inventory).forEach((name) => {
      let ownedAmount = this.inventory[name];
      //Update quicksell inventory
      $("#quicksell-inventory-amount_"+name).html(numberBeautify(ownedAmount));
      //Update inventory if it's open
      if(this.isInventoryOpen){
        $("#inventory-amount_"+name).html(numberBeautify(ownedAmount));
        this.updateSellPriceShownForItems();
      }
    });
  }

  updateSellPercentageButtons(){
    //Change the text on buttons
    $(".inventory-sell-percentage-button").html("Sell "+this.itemSellPercentage+"%");
    $("#sell-percentage-of-all").html(this.itemSellPercentage+"%");
    //Change the prices shown for items
    this.updateSellPriceShownForItems();
  }

  updateSellPriceShownForItems(){
    Object.keys(this.inventory).forEach((name) => {
      let ownedAmount = Math.floor(this.inventory[name]);
      let itemObject = {};
      //Parse the items to get the object
      Object.keys(ItemList).forEach((e) => {
        if(ItemList[e].name == name){ itemObject = ItemList[e]; }
      });
      $("#inventory-percentage-price_"+name).html("Price for "+this.itemSellPercentage+"%: $"+numberBeautify(this.getPercentagePrice(ownedAmount, itemObject.price)));
      $("#inventory-all-price_"+name).html("Price for "+numberBeautify(ownedAmount)+": $"+numberBeautify(itemObject.price*ownedAmount));
    });
  }

  //Managers
  showManagers(){
    $("#pop-up-content").empty();
    $("#pop-up-title").html("<i class='fa-solid fa-user'></i> Managers");
    
    this.createChainEntriesInPopUp();

    //Show managers for all businesses
    Object.keys(BusinessList).forEach((e) => {
      let Business = BusinessList[e];

      let HireButtonStatus = "";
      let HireButtonText = "Hire";
      
      //Disable hire button if user can't hire
      if(user.money < Business.managerPrice){
        HireButtonStatus = "disabled";
        HireButtonText = "Can't afford";
      }
      if(Business.amount == 0){
        HireButtonStatus = "disabled";
        HireButtonText = "No business";
      }
      if(Business.hasManager){
        HireButtonStatus = "disabled";
        HireButtonText = "Hired";
      }

      //Create manager element
      let element = `
        <div class="pop-up-item-box accent-color-0">
          <div class="pop-up-image-box">
            <img src="img/business/`+Business.name+`.png" draggable="false" alt="`+Business.label+` manager" class="pop-up-image">
          </div>

          <div class="pop-up-item-details">
            <h5 class="pop-up-item-name">`+Business.label+` manager</h5>
            <p class="pop-up-price">Price: $`+numberBeautify(Business.managerPrice)+`</p>
            <button `+HireButtonStatus+` class="pop-up-button accent-color-1" id="manager-buy-button_`+Business.name+`">`+HireButtonText+`</button>
          </div>
        </div>
      `;
      $("#pop-up-chain-content_"+Business.chain).append(element);

      //EVENT LISTENER FOR HIRE BUTTONS
      $("#manager-buy-button_"+Business.name).click(() => {
        //None of these checks should be possible because the button would be disabled
        //But still checking just in case
        if(Business.hasManager){
          return notify.add(Business.label+" already has a manager", "error");
        }
        if(Business.amount == 0){
          return notify.add(Business.label+" not owned", "error");
        }
        if(!this.removeMoney(Business.managerPrice)){
          return notify.add("Not enough money", "error");
        }

        Business.hasManager = true;
        Business.updateBusinessDetails();

        notify.add("Manager for "+Business.label+" hired!", "manager");

        this.updatePopUpManagers();
      });
    });
    $("#pop-up-section").show();
  }

  updatePopUpManagers(){
    Object.keys(BusinessList).forEach((e) => {
      let Business = BusinessList[e];

      let HireButtonText = "Hire";
      if(user.money < Business.managerPrice){
        $("#manager-buy-button_"+Business.name).prop("disabled",true);
        HireButtonText = "Can't afford";
      }
      if(Business.amount == 0){
        $("#manager-buy-button_"+Business.name).prop("disabled",true);
        HireButtonText = "No business";
      }
      if(Business.hasManager){
        $("#manager-buy-button_"+Business.name).prop("disabled",true);
        HireButtonText = "Hired";
      }
      
      $("#manager-buy-button_"+Business.name).html(HireButtonText);
    });
  }

  //Upgrades
  showUpgrades(){
    $("#pop-up-content").empty();
    $("#pop-up-title").html("<i class='fa-solid fa-gear'></i> Upgrades");
    
    this.createChainEntriesInPopUp();

    //There is an extra category for upgrades (general)
    //Create General category
    let buttonElement = `
      <button class="pop-up-chain-button accent-color-1" id="pop-up-chain-button_generalupgrade">General</button>
    `;
    $("#pop-up-chain-selection").prepend(buttonElement);

    let contentElement = `
      <div class="pop-up-chain-content" id="pop-up-chain-content_generalupgrade"></div>
    `;
    $("#pop-up-content-box").prepend(contentElement);

    //Hide the category then show what we need
    $("#pop-up-chain-content_generalupgrade").hide();
    $("#pop-up-chain-content_"+this.lastPopUpChainSelected).show();

    //EVENT LISTENER FOR GENERAL BUTTON
    $("#pop-up-chain-button_generalupgrade").click(() => {
      //Hide all chains
      $("#pop-up-content-box").children().hide();

      //Show the chain we need
      $("#pop-up-chain-content_generalupgrade").show();

      //Set it as last selected
      this.lastPopUpChainSelected = "generalupgrade";
    });


    //Create the elements for each upgrade
    Object.keys(UpgradesList).forEach((e) => {
      let Upgrade = UpgradesList[e];

      let BuyButtonStatus = "";
      let BuyButtonText = "Buy";
      
      //Disable button if user can't buy
      if(user.money < Upgrade.price){
        BuyButtonStatus = "disabled";
        BuyButtonText = "Can't afford";
      }
      if(Upgrade.business != "generalupgrade"){
        if(BusinessList[Upgrade.business].amount == 0){
          BuyButtonStatus = "disabled";
          BuyButtonText = "No business";
        }
      }
      if(Upgrade.isActive){
        BuyButtonStatus = "disabled";
        BuyButtonText = "Active";
      }

      //Set details shown to the user based on what the upgrade is actually doing (upgrade type)
      let upgradeDetails = "";
      if(Upgrade.type == "output_multiplier"){
        upgradeDetails = "Increases output by: " + (Upgrade.multiplier-1)*100 + "%";
      }
      if(Upgrade.type == "intake_output_multiplier"){
        upgradeDetails = "Increases processing capacity by: " + (Upgrade.multiplier-1)*100 + "%";
      }
      if(Upgrade.type == "processing_time_multiplier"){
        upgradeDetails = "Decreases processing time by: " + (Upgrade.multiplier-1)*100 + "%";
      }

      //Create element
      let element = `
        <div class="pop-up-item-box accent-color-0">
          <div class="pop-up-image-box">
            <img src="img/business/`+Upgrade.business+`.png" draggable="false" alt="`+Upgrade.label+`" class="pop-up-image">
          </div>

          <div class="pop-up-item-details">
            <h5 class="pop-up-item-name">`+Upgrade.label+`</h5>
            <p class="pop-up-text">`+upgradeDetails+`</p>
            <p class="pop-up-price">Price: $`+numberBeautify(Upgrade.price)+`</p>
            <button `+BuyButtonStatus+` class="pop-up-button accent-color-1" id="upgrade-buy-button_`+Upgrade.name+`">`+BuyButtonText+`</button>
          </div>
        </div>
      `;
      $("#pop-up-chain-content_"+Upgrade.chain).append(element);


      //EVENT LISTENER FOR BUY BUTTONS
      $("#upgrade-buy-button_"+Upgrade.name).click(() => {
        if(Upgrade.isActive){
          //This shouldn't be possible but still...
          return notify.add(Upgrade.label+" is already active", "error");
        }
        if(Upgrade.business != "generalupgrade"){
          if(BusinessList[Upgrade.business].amount == 0){
            //This shouldn't be possible but still...
            return notify.add(BusinessList[Upgrade.business].label+" not owned", "error");
          }
        }
        if(!this.removeMoney(Upgrade.price)){
          return notify.add("Not enough money", "error");
        }

        //Get the upgrade
        Upgrade.isActive = true;
        Upgrade.manageUpgrade();

        //Update businesses with the upgrade
        if(Upgrade.business != "generalupgrade"){
          BusinessList[Upgrade.business].updateBusinessDetails();
        }
        else{
          Object.keys(BusinessList).forEach((e) => {
            BusinessList[e].updateBusinessDetails();
          });
        }

        this.updatePopUpUpgrades();
      });
    });
    $("#pop-up-section").show();
  }

  updatePopUpUpgrades(){
    Object.keys(UpgradesList).forEach((e) => {
      let Upgrade = UpgradesList[e];

      let BuyButtonText = "Buy";

      if(user.money < Upgrade.price){
        $("#upgrade-buy-button_"+Upgrade.name).prop("disabled",true);
        BuyButtonText = "Can't afford";
      }
      if(Upgrade.business != "generalupgrade"){
        if(BusinessList[Upgrade.business].amount == 0){
          $("#upgrade-buy-button_"+Upgrade.name).prop("disabled",true);
          BuyButtonText = "No business";
        }
      }
      if(Upgrade.isActive){
        $("#upgrade-buy-button_"+Upgrade.name).prop("disabled",true);
        BuyButtonText = "Active";
      }
      
      $("#upgrade-buy-button_"+Upgrade.name).html(BuyButtonText);
    });
  }

  //Achievemnts
  showAchievements(){
    $("#pop-up-content").empty();
    $("#pop-up-title").html("<i class='fa-solid fa-trophy'></i> Milestones");
    
    this.createChainEntriesInPopUp();

    Object.keys(AchievementsList).forEach((e) => {
      let Achievement = AchievementsList[e];

      //Show text on progress bar if achievement is active
      let AchievementButtonText = "";
      if(Achievement.isActive){
        AchievementButtonText = "Active";
      }

      //Show details to the user based on what the achievement is doing
      let upgradeDetails = "";
      if(Achievement.type == "output_multiplier"){
        upgradeDetails = "Increases output by: " + (Achievement.multiplier-1)*100 + "%";
      }
      if(Achievement.type == "intake_output_multiplier"){
        upgradeDetails = "Increases processing capacity by: " + (Achievement.multiplier-1)*100 + "%";
      }
      if(Achievement.type == "processing_time_multiplier"){
        upgradeDetails = "Decreases processing time by: " + (Achievement.multiplier-1)*100 + "%";
      }

      //Set achievement progress bar and details for getting the achievement
      let achievementProgress = 0;
      let achievementText = "";
      if(Achievement.business != "generalachievement"){
        achievementText = "Requires "+Achievement.condition+" "+BusinessList[Achievement.business].label;
        achievementProgress = (BusinessList[Achievement.business].amount/Achievement.condition)*100;
      }
      else{
        achievementText = "Requires "+Achievement.condition+" of everything in "+ChainList[Achievement.chain].label;
        
        //Use a points system
        //for example if you need 10 of all businesses and you have 5 businesses, you need 50 points
        //once you have 10 of one business (or more) you get 10 points from that business
        //if you only have 5 of one business, you get only 5 points from that business
        let pointsNeeded = 0;
        let pointsAquired = 0;
        Object.keys(BusinessList).forEach((e) => {
          if(BusinessList[e].chain == Achievement.chain){
            pointsNeeded += Achievement.condition;

            //If not max points
            if(BusinessList[e].amount < Achievement.condition){
              pointsAquired += BusinessList[e].amount;
            }
            //If max points
            else{
              pointsAquired += Achievement.condition;
            }
          }
        });

        achievementProgress = (pointsAquired/pointsNeeded)*100;
      }
      if(achievementProgress > 100) { achievementProgress = 100; }
      

      //Create element for achievements
      let element = `
        <div class="pop-up-item-box pop-up-milestones-box accent-color-0">
          <div class="pop-up-image-box">
            <img src="img/business/`+Achievement.business+`.png" draggable="false" alt="`+Achievement.label+`" class="pop-up-image">
          </div>

          <div class="pop-up-item-details">
            <h5 class="pop-up-item-name">`+Achievement.label+`</h5>
            <p class="pop-up-text">`+upgradeDetails+`</p>
            <div class="progress achievement-progress">
              <div class="progress-bar accent-color-1" id="achievement-progress_`+Achievement.name+`" role="progressbar" aria-valuenow="`+achievementProgress+`" aria-valuemin="0" aria-valuemax="100" style="width: `+achievementProgress+`%">`+AchievementButtonText+`</div>
            </div>
            <p class="pop-up-text">`+achievementText+`</p>
          </div>
        </div>
      `;
      $("#pop-up-chain-content_"+Achievement.chain).append(element);
    });
    $("#pop-up-section").show();
  }

  //Businesses
  showBusinesses(){
    $("#pop-up-content").empty();
    $("#pop-up-title").html("<i class='fa-solid fa-briefcase'></i> Businesses");
    
    this.createChainEntriesInPopUp();

    Object.keys(BusinessList).forEach((e) => {
      let Business = BusinessList[e];

      let IntakeOutputText = Business.updateBusinessTooltips();

      //Inform the user about what business he needs to own in order to run this business
      let businessPrerequisites = "No prerequisites needed to run";

      if(Business.intake.length != 0){
        businessPrerequisites = "";
        Object.keys(BusinessList).forEach((elem) => {
          Business.intake.forEach((item) => {
            if(BusinessList[elem].output == item){
              businessPrerequisites += BusinessList[elem].label + "<br>";
            } 
          });
        });
      }
      
      //Create very simple element for showing details about the business
      let element = `
        <div class="pop-up-item-box accent-color-0">
          <div class="pop-up-image-box">
            <img src="img/business/`+Business.name+`.png" draggable="false" alt="`+Business.label+`" class="pop-up-image">
          </div>

          <div class="pop-up-item-details">
            <h5 class="pop-up-item-name">`+Business.label+`</h5>
            <p class="pop-up-text">Gives `+Business.type+`</p>
            <hr>
            <h6 class="pop-up-text">Details</h6>
            <p class="pop-up-text">`+IntakeOutputText+`</p>
            <p class="pop-up-text">Production time: `+Business.processingTime+` seconds</p>
            <hr>
            <h6 class="pop-up-text">Prerequisites</h6>
            <p class="pop-up-text">`+businessPrerequisites+`</p>
          </div>
        </div>
      `;
      $("#pop-up-chain-content_"+Business.chain).append(element);
    });
    $("#pop-up-section").show();
  }

  //Rankings
  showRanking(){
    $("#pop-up-content").empty();
    $("#pop-up-title").html("<i class='fa-solid fa-chart-line'></i> Ranking");

    //Add user to the ranking list
    RankingList["You"] = this.money;
    let sortedRankingList = [];

    //Create a sorted list
    Object.keys(RankingList).forEach((name) => {
      sortedRankingList.push([name, RankingList[name]]);
    });

    sortedRankingList.sort(function(a, b) {
        a = a[1];
        b = b[1];
        return a < b ? 1 : (a > b ? -1 : 0);
    });

    sortedRankingList.forEach((array, index) => {
      let name = array[0];
      let value = array[1];

      let accentColor = "accent-color-0";
      let userIdMarking = '';
      if(name == "You"){ 
        accentColor = "accent-color-1"; 
        userIdMarking = 'id="ranking-you"';
      }

      let rankingNumber = index+1;
      if(rankingNumber > 100 && name == "You"){
        rankingNumber = "...";
      }

      //Create element for each company (including you)
      let element = `
        <div class="pop-up-item-box pop-up-ranking-box `+accentColor+`" `+userIdMarking+`>
          <div class="pop-up-ranking-item-details">
            <h5 class="pop-up-text">`+rankingNumber+` `+name+`</h5>
            <h5 class="pop-up-ranking-value">$`+numberBeautify(value)+`</h5>
          </div>
        </div>
      `;
      $("#pop-up-content").append(element);
    });
    $("#pop-up-section").show();

    //Reset scroll
    $("#pop-up-content").scrollTop(0);
    //Scroll to user location
    $("#pop-up-content").scrollTop($("#ranking-you").offset().top-(screen.height * 0.35));
  }
}