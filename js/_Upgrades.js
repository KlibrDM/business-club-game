class Upgrades{
  constructor(name, label, chain, business, type, price, multiplier, isActive){
    this.name = name
    this.label = label;
    this.chain = chain;
    this.business = business;
    this.type = type;
    this.price = price;
    this.multiplier = multiplier;
    this.isActive = isActive;
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
  set business(business){
    this._business = business;
  }
  set type(type){
    this._type = type;
  }
  set price(price){
    this._price = price;
  }
  set multiplier(multiplier){
    this._multiplier = multiplier;
  }
  set isActive(isActive){
    this._isActive = isActive;
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
  get business(){
    return this._business;
  }
  get type(){
    return this._type;
  }
  get price(){
    return this._price;
  }
  get multiplier(){
    return this._multiplier;
  }
  get isActive(){
    return this._isActive;
  }

  manageUpgrade(){
    if(this.chain != "generalupgrade"){
      //Do this for normal case
      if(this.type == "output_multiplier"){
        BusinessList[this.business].outputAmount *= this.multiplier;
      }
      else if(this.type == "intake_output_multiplier"){
        if(BusinessList[this.business].intakeAmount.length != 0){
          BusinessList[this.business].intakeAmount.forEach((item, index) => {
            BusinessList[this.business].intakeAmount[index] *= this.multiplier;
          });
        }
        BusinessList[this.business].outputAmount *= this.multiplier;
      }
      else if(this.type == "processing_time_multiplier"){
        BusinessList[this.business].processingTime /= this.multiplier;
      }
    }
    
    else{
      //Do this for general upgrade (for all businesses)
      if(this.type == "output_multiplier"){
        Object.keys(BusinessList).forEach((e) => {
          BusinessList[e].outputAmount *= this.multiplier;
        });
      }
      else if(this.type == "intake_output_multiplier"){
        Object.keys(BusinessList).forEach((e) => {
          if(BusinessList[e].intakeAmount.length != 0){
            BusinessList[e].intakeAmount.forEach((item, index) => {
              BusinessList[e].intakeAmount[index] *= this.multiplier;
            });
          }
          BusinessList[this.business].outputAmount *= this.multiplier;
        });
      }
      else if(this.type == "processing_time_multiplier"){
        Object.keys(BusinessList).forEach((e) => {
          BusinessList[e].processingTime /= this.multiplier;
        });
      }
    }

    //Settings the upgrade as active and updating the businesses is handled when clicking on the buy button
    
    notify.add(this.label+" activated!", "upgrade");
  }
}