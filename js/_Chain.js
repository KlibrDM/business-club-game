class Chain{
  constructor(name, label){
    this.name = name;
    this.label = label;
  }


  set name(name){
    this._name = name;
  }
  set label(label){
    this._label = label;
  }


  get name(){
    return this._name;
  }
  get label(){
    return this._label;
  }


  renderChainBox(){
    let element = `
    <div class="business-chain" id="business-chain_`+this.name+`">
      <div class="chain-control-buttons">
        <button class="chain-control-button" id="chain-move-up_`+this.name+`"><i class="fa-solid fa-angle-up"></i></button>
        <button class="chain-control-button" id="chain-move-down_`+this.name+`"><i class="fa-solid fa-angle-down"></i></button>
      </div>
      <div class="chain-content">
        <h2 class="chain-title text-accent-color-1">`+this.label+`</h2>
        <div class="chain-box border-accent-color-1" id="chain-box_`+this.name+`"></div>
      </div>
    </div>
    `
    $("#businesses").append(element);

    //Set control buttons click event
    $("#chain-move-up_"+this.name).click(() => {
      
      let currentIndex = $("#business-chain_"+this.name).index();
      //If it's not at top
      if(currentIndex != 0){
        $(".business-chain:eq("+currentIndex+")").after($(".business-chain:eq("+(currentIndex-1)+")"));
      }
    });

    //Set control buttons click event
    $("#chain-move-down_"+this.name).click(() => {
      
      let currentIndex = $("#business-chain_"+this.name).index();
      //No if - if not at bottom - needed here
      $(".business-chain:eq("+currentIndex+")").before($(".business-chain:eq("+(currentIndex+1)+")"));
    });
  }
}