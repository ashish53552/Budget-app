
var budgetController=(function(){
  var Income=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };
  var Expense=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };
  Expense.prototype.calcPercentage=function(){
    if(data.addTotal.inc!=0)
    this.percentage=Math.round((this.value/data.addTotal.inc)*100);
    else this.percentage=-1;
  };
var calcTotal=function(type){
  var sum=0;
  for(var i=0;i<data.addItems[type].length;i++){
    sum+=data.addItems[type][i].value;
  }
  data.addTotal[type]=sum;
};
var calcBudgetAndPercentage=function(){
  data.budget=data.addTotal.inc-data.addTotal.exp;
  if(data.addTotal.inc) data.addTotal.percentage=Math.round((data.addTotal.exp/data.addTotal.inc)*100);
  else data.addTotal.percentage=-1;
};



  var data={
    addItems:{
      exp:[],
      inc:[]
    },
    addTotal:{
      exp:0,
      inc:0,
      percentage:-1
    },
    budget:0,
  };
  return {
    addItem:function(type,description,value){
      var newItem;
      if(type==="exp"){
        newItem=new Expense();
      }else if(type==="inc"){
        newItem=new Income();
      }

      if(data.addItems[type].length>0){
        id=data.addItems[type][data.addItems[type].length-1].id+1;
      }else{
        id=0;
      }
      newItem.description=description;
      newItem.value=value;
      newItem.id=id;
      data.addItems[type].push(newItem);
      return newItem;
    },
    deleteItem:function(type,id){
      var idArr=data.addItems[type].map(function(current,index){
        return current.id;
      });
      var el=idArr.indexOf(id);
      if(el!=-1){
        data.addItems[type].splice(el,1);
      }

    },
    updateBudget:function(type){
      calcTotal(type);
      calcBudgetAndPercentage();
      return {
        budget:data.budget,
        totalIncome:data.addTotal.inc,
        totalExpense:data.addTotal.exp,
        percentage:data.addTotal.percentage
      };
    },
    calculatePercentages:function(){
      var percentages=data.addItems.exp.map(function(current,index){
        current.calcPercentage();
        return current.percentage;
      });
      return percentages;
    },
    testing:function(){
      return data;
    }
  };

})();

var uiController=(function(){

  var DOMstrings={
    type:".add__type",
    description:".add__description",
    value:".add__value",
    checkBtn:".add__btn",
    incomeList:".income__list",
    expensesList:".expenses__list",
    budgetTotalValue:".budget__value",
    budgetIncomeValue:".budget__income--value",
    budgetExpensesValue:".budget__expenses--value",
    budgetPercentageValue:".budget__expenses--percentage",
    containerClass:".container",
    expensesPercLabel:".item__percentage",
    titleMonth:".budget__title--month"
  };
  var nodeForeach=function(item,callback){
    for(var i=0;i<item.length;i++){
      callback(item[i],i);
    }
  };
  var format=function(value,type){
    var int,dec,intDec;
    value=Math.abs(value);
    value=value.toFixed(2);
    value.toString();
    intDec=value.split(".");
    int=intDec[0];
    dec=intDec[1];
    if(int.length>3){
      int=int.substr(0,int.length-3)+","+int.substr(int.length-3,3);
    }
    if(type)
    return ((type==="inc")?("+"):("-"))+" " +int+"."+dec;

  };
  return {
    getInput:function(){
      return  {
            type:document.querySelector(DOMstrings.type).value,
            description:document.querySelector(DOMstrings.description).value,
            value:parseFloat(document.querySelector(DOMstrings.value).value),
          };
    },
    addListItem:function(item,type){
      var newHtml,element;
      if(type==="inc"){
        element=document.querySelector(DOMstrings.incomeList);
        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }else if(type==="exp"){
        element=document.querySelector(DOMstrings.expensesList);
      html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      newHtml=html.replace("%id%",item.id);
      newHtml=newHtml.replace("%description%",item.description);
      newHtml=newHtml.replace("%value%",format(item.value,type));
      element.insertAdjacentHTML("beforeend",newHtml);
    },
    deleteListItem:function(el){
      el=document.getElementById(el);
      el.parentNode.removeChild(el);
    },
    clearAllFields:function(){
      var fields=document.querySelectorAll(DOMstrings.value+","+DOMstrings.description);
      Array.prototype.slice.call(fields);
      fields.forEach(function(current,index,fields){
        current.value="";
      });
      fields[0].focus();
    },
    setBudget:function(){
      var fields=document.querySelectorAll(DOMstrings.budgetTotalValue+","+DOMstrings.budgetIncomeValue+","+DOMstrings.budgetExpensesValue);

    },
    chngFmtng:function(){
      fields=document.querySelectorAll(DOMstrings.type+","+DOMstrings.value+","+DOMstrings.description);
      nodeForeach(fields,function(current,index){
        current.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.checkBtn).classList.toggle("red");
    },
    displayBudget:function(object){
      var type;
      ((object.budget>0)?(type="inc"):(type="exp"));
      document.querySelector(DOMstrings.budgetTotalValue).textContent=format(object.budget,type);
      document.querySelector(DOMstrings.budgetExpensesValue).textContent=format(object.totalExpense,"exp");
      document.querySelector(DOMstrings.budgetIncomeValue).textContent=format(object.totalIncome,"inc");
      if(object.percentage>0){
        document.querySelector(DOMstrings.budgetPercentageValue).textContent=object.percentage+"%";
      }else{
        document.querySelector(DOMstrings.budgetPercentageValue).textContent="---";
      }
    },
    displayPercentages:function(percentages){
      items=document.querySelectorAll(DOMstrings.expensesPercLabel);
      nodeForeach(items,function(current,index){
        if(percentages[index]!=-1){
          console.log(percentages[index]);
          current.textContent=percentages[index]+"%";
        }
        else current.textContent="---";
      });
    },
    setDate:function(){
      var date=new Date();
      var month=date.getMonth();
      var year=date.getFullYear();
      var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
      document.querySelector(DOMstrings.titleMonth).textContent=months[month]+" "+year;
    },
    getDOMstrings:function(){
      return DOMstrings;
    }
  };


})();


var appController=(function(uiCtrl,bgtCtrl){

    var DOM=uiCtrl.getDOMstrings();

    ///ctrl Additem
    var ctrlAddItem=function(){

      var input=uiCtrl.getInput();
      if(input.description!==""&&input.value!==""&&!isNaN(input.value)){
        var item= bgtCtrl.addItem(input.type,input.description,input.value);
        uiCtrl.addListItem(item,input.type);
        uiCtrl.clearAllFields();
        uiCtrl.displayBudget(bgtCtrl.updateBudget(input.type));
        uiCtrl.displayPercentages(bgtCtrl.calculatePercentages());

      }



    };

    var ctrlDeleteItem=function(event){
      id=event.target.parentNode.parentNode.parentNode.parentNode.id;
      if(id){
        var ids=id.split("-");
        bgtCtrl.deleteItem(ids[0],parseInt(ids[1]));
        uiCtrl.displayBudget(bgtCtrl.updateBudget(ids[0]));
        uiCtrl.deleteListItem(id);
        uiCtrl.displayPercentages(bgtCtrl.calculatePercentages());
      }


    };

    var setupEventListeners=function(){
      document.addEventListener("keypress",function(event){
        if(event.keyCode===13||event.which===13)
        {
          ctrlAddItem();
        }
      });
      document.querySelector(DOM.checkBtn).addEventListener("click",ctrlAddItem);
      document.querySelector(DOM.type).addEventListener("change",uiCtrl.chngFmtng);
      document.querySelector(DOM.containerClass).addEventListener("click",ctrlDeleteItem);
    };


    return {
      init:function(){
        uiCtrl.setDate();
        var object={
          budget:0,
          totalIncome:0,
          totalExpense:0,
          percentage:0
        };
        console.log("The Application has started !");
        setupEventListeners();
        uiCtrl.displayBudget(object);
      }
    };

})(uiController,budgetController);

appController.init();
