class Notifications{
  constructor(){
    this.entry = [];
    this.isActive = false;
  }

  set entry(entry){
    this._entry = entry;
  }
  set isActive(isActive){
    this._isActive = isActive;
  }

  get entry(){
    return this._entry;
  }
  get isActive(){
    return this._isActive;
  }


  add(msg, type){
    //Add message only if it doesn't already exist
    if(!this.entry.includes(msg)){
      this.entry.push(msg);

      //Set border color based on type
      let color = "#2b2b2b"
      if(type == "error"){
        color = "#4b0528";
      }
      else if(type == "success"){
        color = "#1cd108";
      }
      else if(type == "upgrade" || type == "achievement" || type == "manager"){
        color = "#f2df0c";
      }

      let element = `<p style="border-color: `+color+`;">`+msg+`</p>`;
      $("#notification").append(element);
      $("#notification-section").scrollTop($("#notification-section")[0].scrollHeight);

      this.show();

      //Remove after timeout
      setTimeout(() => {
        //Remove first entry
        this.entry.shift();
        
        $('#notification').find('p:first').remove();
        
        //Hide notification if there are no more notifications
        if(this.entry.length == 0){
          this.hide();
        }
      }, 5000);
    }
  }

  show(){
    if(!this.isActive){
      this.isActive = true;
      $("#notification-section").removeClass("slide-out-right");
      $("#notification-section").addClass("slide-in-right");
      $("#notification-section").show();
    }
  }

  hide(){
    if(this.isActive){
      this.isActive = false;
      $("#notification-section").removeClass("slide-in-right");
      $("#notification-section").addClass("slide-out-right");
      $("#notification-section").hide();
    }
  }
}