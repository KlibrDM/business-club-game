class Achievements{
  constructor(name, label, chain, business, type, condition, multiplier, isActive){
    this.name = name
    this.label = label;
    this.chain = chain;
    this.business = business;
    this.type = type;
    this.condition = condition;
    this.multiplier = multiplier;
    this.isActive = isActive;

    this.startMonitoring();
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
  set condition(condition){
    this._condition = condition;
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
  get condition(){
    return this._condition;
  }
  get multiplier(){
    return this._multiplier;
  }
  get isActive(){
    return this._isActive;
  }

  startMonitoring(){
    setInterval(() => {
      if(isGameLoaded){
        this.manageAchievement();
      }
    }, 500);
  }

  manageAchievement(){
    if(isGameLoaded){
      //If the achievement is not already activated
      if(!this.isActive){
        //If the achievement is not for general (that case handled below)
        if(this.business != "generalachievement"){
          //If condition is met
          if(BusinessList[this.business].amount >= this.condition){
            //Apply achievement based on type
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

            //Update business details with the new changes
            BusinessList[this.business].updateBusinessDetails();
            
            notify.add(this.label+" milestone unlocked!", "achievement");
  
            this.isActive = true;
          }
        }
        //For general achievements
        else{
          //Assume that all businesses have met the condition
          let allBusinessesMeetCondition = true;
  
          //Check if all businesses have met the condition
          Object.keys(BusinessList).forEach((e) => {
            if(BusinessList[e].chain == this.chain){
              if(BusinessList[e].amount < this.condition){
                allBusinessesMeetCondition = false;
              }
            }
          });
          
          if(allBusinessesMeetCondition){
            //Apply achievement for each business based on type
            if(this.type == "output_multiplier"){
              Object.keys(BusinessList).forEach((e) => {
                if(BusinessList[e].chain == this.chain){
                  BusinessList[e].outputAmount *= this.multiplier;
                }
              });
            }

            else if(this.type == "intake_output_multiplier"){
              Object.keys(BusinessList).forEach((e) => {
                if(BusinessList[e].chain == this.chain){
                  if(BusinessList[e].intakeAmount.length != 0){
                    BusinessList[e].intakeAmount.forEach((item, index) => {
                      BusinessList[e].intakeAmount[index] *= this.multiplier;
                    });
                  }
                  BusinessList[this.business].outputAmount *= this.multiplier;
                }
              });
            }

            else if(this.type == "processing_time_multiplier"){
              Object.keys(BusinessList).forEach((e) => {
                if(BusinessList[e].chain == this.chain){
                  BusinessList[e].processingTime /= this.multiplier;
                }
              });
            }
  
            //Update each business
            Object.keys(BusinessList).forEach((e) => {
              if(BusinessList[e].chain == this.chain){
                BusinessList[e].updateBusinessDetails();
              }
            });
  
            notify.add(this.label+" milestone unlocked!", "achievement");
  
            this.isActive = true;
          }
        }
      }
    }
  }
}