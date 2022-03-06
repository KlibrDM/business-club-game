class Business{
  constructor(name, label, chain, type, initialPrice, managerPrice, intake, intakeAmount, output, outputAmount, processingTime, chainPosition, amount, hasManager){
    this.name = name;
    this.label = label;
    this.chain = chain;
    this.type = type;
    this.price = initialPrice;
    this.managerPrice = managerPrice;
    this.intake = intake;
    this.intakeAmount = intakeAmount;
    this.output = output;
    this.outputAmount = outputAmount;
    this.processingTime = processingTime;
    this.chainPosition = chainPosition;
    this.amount = amount;
    this.hasManager = hasManager;
    this.isManufacturing = false;
  }


  set name(name){
    this._name = name;
  }
  set label(label){
    this._label = label;
  }
  set chain(chain){
    this._chain = chain;
  }
  set type(type){
    this._type = type;
  }
  set price(price){
    this._price = price;
  }
  set managerPrice(managerPrice){
    this._managerPrice = managerPrice;
  }
  set intake(intake){
    this._intake = intake;
  }
  set intakeAmount(intakeAmount){
    this._intakeAmount = intakeAmount;
  }
  set output(output){
    this._output = output;
  }
  set outputAmount(outputAmount){
    this._outputAmount = outputAmount;
  }
  set processingTime(processingTime){
    this._processingTime = processingTime;
  }
  set chainPosition(chainPosition){
    this._chainPosition = chainPosition;
  }
  set amount(amount){
    this._amount = amount;
  }
  set isManufacturing(isManufacturing){
    this._isManufacturing = isManufacturing;
  }
  set hasManager(hasManager){
    this._hasManager = hasManager;
  }


  get name(){
    return this._name;
  }
  get label(){
    return this._label;
  }
  get chain(){
    return this._chain;
  }
  get type(){
    return this._type;
  }
  get price(){
    return this._price;
  }
  get managerPrice(){
    return this._managerPrice;
  }
  get intake(){
    return this._intake;
  }
  get intakeAmount(){
    return this._intakeAmount;
  }
  get output(){
    return this._output;
  }
  get outputAmount(){
    return this._outputAmount;
  }
  get processingTime(){
    return this._processingTime;
  }
  get chainPosition(){
    return this._chainPosition;
  }
  get amount(){
    return this._amount;
  }
  get isManufacturing(){
    return this._isManufacturing;
  }
  get hasManager(){
    return this._hasManager;
  }


  /*----------------------
  --   MANUFACTURING    --
  ----------------------*/

  startManufacturing(){
    //Checks
    if(this.isManufacturing){
      notify.add(this.label + " is already running", "error");
      return 0;
    }
    if(this.amount <= 0){
      notify.add("You do not own "+this.label+" business", "error");
      return 0;
    }

    //If business needs intake
    if(this.intake.length != 0){
      //Assume that the user has what intake is needed
      let status = 1;

      //Check if user actually has the intake
      this.intake.forEach((item,index) => {
        if(user.inventory[item] == undefined || user.inventory[item] < this.intakeAmount[index] * this.amount){
          if(!this.hasManager){
            notify.add("Not enough raw materials. You need: "+(this.intakeAmount[index] * this.amount)+"x "+ItemList[item].label, "error");
          }
          //If the user does not have one of the required intakes, change status to 0
          status = 0;
        }
      });

      if(status == 0){
        return status;
      }
    }
    
    //-----If user has a manager -> AUTOMODE-----
    if(this.hasManager){
      this.isManufacturing = true;

      //Set progressbar to 100% all the time
      $("#business-progress_"+this.name).css('width', "100%");
      $("#business-progress_"+this.name).attr('aria-valuenow', "100");

      //Fix progressbar not starting bug
      setTimeout(() => {
        $("#business-progress_"+this.name).css('width', "100%");
        $("#business-progress_"+this.name).attr('aria-valuenow', "100");
      }, 500);

      //Start actual manufacturing interval
      let manufacturingInterval = setInterval(() => {
        //STORE BUSINESS AMOUNT IN CASE USER BUYS MORE BETWEEN CYCLES
        let _amount = this.amount

        //Remove intake items when manufacturing starts | Thorw error if there's a problem
        if(this.intake.length != 0){
          this.intake.forEach((item,index) => {
            if(!user.removeItem(item, (this.intakeAmount[index] * _amount)/this.processingTime)){
              //If the user is out of base item
              //Clear interval & reset progress bar
              clearInterval(manufacturingInterval);
              $("#business-progress_"+this.name).css('width', "0%");
              $("#business-progress_"+this.name).attr('aria-valuenow', "0");
  
              //Stop manufacturing process
              this.isManufacturing = false;
  
              return notify.add("Production stopped for: "+this.label+"<br>Reason: Not enough raw materials - "+this.intakeAmount[index] * this.amount+"x "+ItemList[item].label+" needed", "error");
            }
          });
        }

        //If no error happened above, then add item or money
        if(this.type == "product"){
          user.addItem(this.output, ((this.outputAmount * _amount)/this.processingTime));
        }
        else if(this.type == "money"){
          user.addMoney((this.outputAmount * _amount)/this.processingTime);
        }
        
        //Update the text on progress bar (in case user bought more businesses/upgrades/or something)
        this.updateBusinessDetailsSpecialCase();
      }, 1000);
      //Processing time doesn't matter for the interval as production will happen every second
    }

    //-----If user doesn't have a manager -> MANUAL MODE-----
    else{
      this.isManufacturing = true;

      //STORE BUSINESS AMOUNT IN CASE USER BUYS MORE BETWEEN CYCLES
      let _amount = this.amount

      //Set progressbar - update at interval - clean interval when reached 101%
      let progress = 0;
      let progressInterval = setInterval(() => {
        if(progress == 101) { progress = 0; clearInterval(progressInterval); }
        $("#business-progress_"+this.name).css('width', progress+"%");
        $("#business-progress_"+this.name).attr('aria-valuenow', progress);
        progress++;
      }, (this.processingTime * 1000)/100);

      //Remove intake items when manufacturing starts | Thorw error if there's a problem
      if(this.intake.length != 0){
        this.intake.forEach((item,index) => {
          //This shouldn't happen in manual mode because we checked previously, but I'll keep it just in case
          if(!user.removeItem(item, this.intakeAmount[index] * _amount)){
            this.isManufacturing = false;
            return notify.add("Production stopped for: "+this.label+"<br>Reason: Not enough raw materials - "+this.intakeAmount[index] * this.amount+"x "+ItemList[item].label+" needed", "error");
          }
        });
      }
      
      //Add items / money after manufacturing finished
      setTimeout(() => {
        if(this.type == "product"){
          user.addItem(this.output, this.outputAmount * _amount);
        }
        else if(this.type == "money"){
          user.addMoney(this.outputAmount * _amount);
        }

        //Stop manufacturing process
        this.isManufacturing = false;

        //Update business details in case user bought new business during the manufacturing process
        //This is needed because progress bar text doesn't update while manufacturing
        this.updateBusinessDetails();
      }, this.processingTime * 1000);
    }
  }


  /*----------------------
  --    BUSINESS BUY    --
  ----------------------*/

  businessBuy(){
    //If buy multiplier is not on max
    if(buyMultiplier != -1){
      //Check if the user has the money
      if(user.money < this.calculateBuyPriceAtMultiplier()){
        return notify.add("Not enough money to purchase "+buyMultiplier+"x "+this.label, "error");
      }
      
      //If the user has the money then buy
      for(let i = 0; i < buyMultiplier; i++){
        user.money -= this.price;
        this.price *= config_BUSINESS_PRICE_INCREASE;
        this.amount += 1;
      }
    }
    //IF USER SELECTS MAX MULTIPLIER
    else{
      let buyThisMany = this.calculateMaxBuyAmount()

      //Check if the user has the money
      if(user.money < this.calculateMaxBuyPrice()){
        return notify.add("Not enough money to purchase "+buyThisMany+"x "+this.label, "error");
      }
      
      //If the user has the money then buy
      for(let i = 0; i < buyThisMany; i++){
        user.money -= this.price;
        this.price *= config_BUSINESS_PRICE_INCREASE;
        this.amount += 1;
      }
    }

    //Update details for all businesses
    //Because user might not have enough money to buy the others now
    Object.keys(BusinessList).forEach((e) => {
      BusinessList[e].updateBusinessDetails();
    });

    //Start business if it has a manager and is not currently manufacturing
    //I don't think this is possible anymore as the user can't buy managers before buying the bussines
    //And if user just added to his business count and he has a manager, it's most likely already manufacturing
    if(this.hasManager && !this.isManufacturing){
      this.startManufacturing();
    }
  }

  //Calculate the price user needs to pay at the selected multiplier
  calculateBuyPriceAtMultiplier(){
    let _price = this.price;
    let finalPrice = _price;
    for(let i = 1; i < buyMultiplier; i++){
      _price *= config_BUSINESS_PRICE_INCREASE;
      finalPrice += _price;
    }
    return finalPrice;
  }

  //Calculate how many the user can buy when set to max
  calculateMaxBuyAmount(){
    let _money = user.money;
    let _price = this.price;
    let finalCost = 0;
    let counter = 0;
    do{
      finalCost += _price;
      _price *= config_BUSINESS_PRICE_INCREASE;
      counter++;
    }while(finalCost <= (_money - _price));
    return counter;
  }

  //Calculate the price of purchase when set to max
  calculateMaxBuyPrice(){
    let _money = user.money;
    let _price = this.price;
    let finalCost = 0;
    do{
      finalCost += _price;
      _price *= config_BUSINESS_PRICE_INCREASE;
    }while(finalCost <= (_money - _price));
    return finalCost;
  }


  /*----------------------
  --      MANAGERS      --
  ----------------------*/

  startManagers(){
    if(this.hasManager && !this.isManufacturing && this.amount > 0){
      this.startManufacturing();
    }
    this.updateManagersStatusAtInterval();
  }

  updateManagersStatusAtInterval(){
    setInterval(() => {
      if(this.hasManager && !this.isManufacturing && this.amount > 0){
        this.startManufacturing();
      }
    }, 500);
  }

  /*----------------------
  --     RENDERING      --
  ----------------------*/

  renderBusinessBox(){
    let tooltipText = this.updateBusinessTooltips();

    //Disable business buy button if user doesn't have enough money to buy
    let businessBuyPrice = 0;
    if(buyMultiplier != -1){
      businessBuyPrice = this.calculateBuyPriceAtMultiplier();
    }
    else{
      //This normally shouldn't happen as the multiplier will always be at 1 at render time
      businessBuyPrice = this.calculateMaxBuyPrice();
    }
    let businessBuyButtonStatus = "";
    if(user.money < businessBuyPrice){
      businessBuyButtonStatus = "disabled";
    }

    //Make a box in the chain for the element's position
    //If the box doesn't exist, create it and append it to chainbox
    if(!$("#chain-box_"+this.chain+"_pos_"+this.chainPosition).length){
      let element = `<div class="chain-box-position" id="chain-box_`+this.chain+`_pos_`+this.chainPosition+`"></div>`
      $("#chain-box_"+this.chain).append(element);
    }

    //Set element
    let element = `
    <div class="business-box" id="business-box_`+this.name+`">
      <div class="business-image-box" id="business-image-box_`+this.name+`">
        <img src="img/business/`+this.name+`.png" draggable="false" alt="`+this.label+`" class="business-image accent-color-0" id="business-image_`+this.name+`">
        <p class="business-amount accent-color-1" id="business-amount_`+this.name+`"></p>
      </div>
      <div class="business-data-box">
        <p class="business-name" id="business-name_`+this.name+`" data-bs-toggle="tooltip" data-bs-html="true" title="`+tooltipText+`">`+this.label+`</p>
        <div class="progress accent-color-0">
          <div class="progress-bar progress-bar-striped progress-bar-animated accent-color-1" id="business-progress_`+this.name+`" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
        </div>
        <button `+businessBuyButtonStatus+` class="business-buy-button accent-color-1" id="business-buy-button_`+this.name+`"></button>
      </div>
    </div>
    `
    $("#chain-box_"+this.chain+"_pos_"+this.chainPosition).append(element)

    this.updateBusinessDetails();

    //Set Buy Event
    $("#business-buy-button_"+this.name).click(() => {
      this.businessBuy();
    });

    //Set Manual Manufacture Event
    $("#business-image_"+this.name).click(() => {
      this.startManufacturing();
    });

    //Check the buy buttons status at an interval (in case something becomes available through passive income)
    setInterval(() => {
      this.updateBusinessDetails();
    }, 300);
  }

  updateBusinessDetails(){
    //Owned amount
    $("#business-amount_"+this.name).html(this.amount);

    //Update text on buy button (considering the multiplier)
    if(buyMultiplier != -1){
      $("#business-buy-button_"+this.name).html('Buy x'+buyMultiplier+'<br>$'+numberBeautify(this.calculateBuyPriceAtMultiplier()));
    }
    //Update text on buy button with multiplier on MAX
    else{
      $("#business-buy-button_"+this.name).html('Buy x'+this.calculateMaxBuyAmount()+'<br>$'+numberBeautify(this.calculateMaxBuyPrice()));
    }

    //Disable business buy button if user doesn't have enough money to buy
    let businessBuyPrice = 0;
    if(buyMultiplier != -1){
      businessBuyPrice = this.calculateBuyPriceAtMultiplier();
    }
    else{
      businessBuyPrice = this.calculateMaxBuyPrice();
    }
    if(user.money < businessBuyPrice){
      $("#business-buy-button_"+this.name).prop("disabled",true);
    }
    else{
      $("#business-buy-button_"+this.name).prop("disabled",false);
    }

    //Update Tooltip
    let tooltipText = this.updateBusinessTooltips();
    $("#business-name_"+this.name).attr('data-bs-original-title', tooltipText);

    //Add s to the final of output item if multiple are outputed
    let finalS = "";

    //Store the name of the output (will need in case the business type is money)
    let outputItemName = this.output;

    //Show per second if business is run by manager
    //Added !this.isManufactuing because that will be a special case handled below
    if(this.hasManager && !this.isManufacturing){
      let perSecond = (this.outputAmount*this.amount)/this.processingTime;
      //Add the final s if needed
      if(perSecond != 1 && !UncountableItemsList.includes(outputItemName)){
        finalS = "s";
      }

      let outputItemLabel = "";
      if(this.type == "product"){
        outputItemLabel = ItemList[outputItemName].label;
      }
      else if(this.type == "money"){
        outputItemLabel = config_CURRENCY_LABEL;
      }

      $("#business-progress_"+this.name).html(numberBeautify(perSecond)+' '+outputItemLabel+finalS+'/sec');
    }
    //This is without manager. /cycle
    else{
      if(!this.isManufacturing){
        let cycleAmount = (this.outputAmount*this.amount);
        //Add the final s if needed
        if(cycleAmount != 1 && !UncountableItemsList.includes(outputItemName)){
          finalS = "s";
        }
        
        let outputItemLabel = "";
        if(this.type == "product"){
          outputItemLabel = ItemList[outputItemName].label;
        }
        else if(this.type == "money"){
          outputItemLabel = config_CURRENCY_LABEL;
        }

        $("#business-progress_"+this.name).html(numberBeautify(cycleAmount)+' '+outputItemLabel+finalS);
      }
    }
  }

  updateBusinessDetailsSpecialCase(){
    //This handles a special case, hard to explain, fixes a bug
    let finalS = "";
    let outputItemName = this.output;
    //Should only be called when business has manager, but checking just in case
    if(this.hasManager){
      let persecond = (this.outputAmount*this.amount)/this.processingTime;
      //Add the final s if needed
      if(persecond != 1 && !UncountableItemsList.includes(outputItemName)){
        finalS = "s";
      }
      
      let outputItemLabel = "";
      if(this.type == "product"){
        outputItemLabel = ItemList[outputItemName].label;
      }
      else if(this.type == "money"){
        outputItemLabel = config_CURRENCY_LABEL;
      }

      $("#business-progress_"+this.name).html(numberBeautify(persecond)+' '+outputItemLabel+finalS+'/sec');
    }
  }

  updateBusinessTooltips(){
    //Set tooltip
    let tooltipAmount = 1; //Calculate the values for 1 if user doesn't own any
    if(this.amount > 1){ tooltipAmount = this.amount; } //Change tooltipAmount if user owns business

    //Set output item name and label
    let outputItemName = this.output;
    let outputItemLabel = "";
    if(this.type == "product"){
      outputItemLabel = ItemList[outputItemName].label;
    }
    else if(this.type == "money"){
      outputItemLabel = config_CURRENCY_LABEL;
    }

    //Calculate the output required
    let outputCalculateCycle = this.outputAmount*tooltipAmount;
    let outputCalculateSecond = (this.outputAmount*tooltipAmount)/this.processingTime;

    //Add s to the final of output items if multiple are outputed
    let outputPerCycleFinalS = "";
    let outputPerSecondFinalS = "";
    //Also initiate it for inputs
    let intakePerCycleFinalS = "";
    let intakePerSecondFinalS = "";
    if(outputCalculateCycle != 1 && !UncountableItemsList.includes(outputItemName)){ outputPerCycleFinalS = "s"; }
    if(outputCalculateSecond != 1 && !UncountableItemsList.includes(outputItemName)){ outputPerSecondFinalS = "s"; }

    //Set intake items if needed
    //Set the element to no materials initially and modify if needed
    let intakeElement = "No materials needed to run<br>";
    let intakeArray = this.intake;
    if(intakeArray.length != 0){
      intakeElement = "Requires: ";
      intakeArray.forEach((element, index) => {
        let intakeItemName = element;
        let intakeItemLabel = ItemList[intakeItemName].label;
        
        //Calculate the input required
        let intakeCalculateCycle = 0;
        let intakeCalculateSecond = 0;
        if(this.intakeAmount[index] !=0){
          intakeCalculateCycle = this.intakeAmount[index]*tooltipAmount;
          intakeCalculateSecond = (this.intakeAmount[index]*tooltipAmount)/this.processingTime;
        }

        //Add s to the final of input items if multiple are inputed
        if(intakeCalculateCycle != 1 && !UncountableItemsList.includes(intakeItemName)){ intakePerCycleFinalS = "s"; }
        if(intakeCalculateSecond != 1 && !UncountableItemsList.includes(intakeItemName)){ intakePerSecondFinalS = "s"; }

        //If user has manager, show intake/second, else show intake/cycle
        if(this.hasManager){
          intakeElement += numberBeautify(intakeCalculateSecond)+" "+intakeItemLabel+intakePerSecondFinalS+"/second<br>";
        }
        else{
          intakeElement += numberBeautify(intakeCalculateCycle)+" "+intakeItemLabel+intakePerCycleFinalS+"/cycle<br>";
        }
      });
    }

    //If user has manager, show output/second, else show output/cycle
    if(this.hasManager){
      return intakeElement + "Produces: "+numberBeautify(outputCalculateSecond)+" "+outputItemLabel+outputPerSecondFinalS+"/second";
    }
    else{
      return intakeElement + "Produces: "+numberBeautify(outputCalculateCycle)+" "+outputItemLabel+outputPerCycleFinalS+"/cycle";
    }
  }
}