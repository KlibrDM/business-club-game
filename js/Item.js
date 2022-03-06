class Item{
  constructor(name, label, price){
    this.name = name;
    this.label = label;
    this.price = price;
  }


  set name(name){
    this._name = name;
  }
  set label(label){
    this._label = label;
  }
  set price(price){
    this._price = price;
  }


  get name(){
    return this._name;
  }
  get label(){
    return this._label;
  }
  get price(){
    return this._price;
  }
}