// uiController дэлгэцийн модуль
var uiController = (function () {
  //Dom save
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
    expensesCalculated: ".budget__expenses--value",
    incomeCalculated: ".budget__income--value",
    persentageCalculated_: ".budget__expenses--percentage",
    leftIncome_: ".budget__value",
  };
  return {
    //Оролтууд
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    //Public DOM name
    getDomStrings: function () {
      return DOMstrings;
    },
    //Цэвэрлэх
    clearField: function () {
      var field = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      var fieldArr = Array.prototype.slice.call(field);

      fieldArr.forEach(function (el, index, array) {
        el.value = "";
      });

      fieldArr[0].focus();
    },
    //Дэлгэцэнд орлого зарлага нэмэх
    addListItem: function (item, type, perItem) {
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          ' <div class="item clearfix" id="income-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">+$val$</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
      } else {
        list = DOMstrings.expensesList;
        html =
          '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">-$val$</div> <div class="item__percentage">$%$%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }
      var html = html.replace("%id%", item.id);
      var html = html.replace("%desc%", item.description);
      var html = html.replace("$val$", item.value);
      var html = html.replace("$%$", perItem);
      //DOM руу холболж дэлгэцэнд гаргана

      document.querySelector(list).insertAdjacentHTML("beforebegin", html);
    },

    //Дэлгэцэнд төсөв хэвлэх
    addCalculatedIncome: function (allFinnance) {
      document.querySelector(DOMstrings.leftIncome_).textContent =
        allFinnance.leftIncome;
      document.querySelector(DOMstrings.incomeCalculated).textContent =
        allFinnance.totalsInc;
      document.querySelector(DOMstrings.expensesCalculated).textContent =
        allFinnance.totalsExp;
      allFinnance.calPersentage !== 0
        ? (document.querySelector(
            DOMstrings.persentageCalculated_
          ).textContent = allFinnance.calPersentage + "%")
        : (document.querySelector(
            DOMstrings.persentageCalculated_
          ).textContent = allFinnance.calPersentage);
    },
  };
})();
//Дата -г хадгалах модуль
var financeController = (function () {
  //Дата функц
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  //Нийт дата
  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },

    leftOver: 0,

    persentage: 0,
  };
  //Нийт орлого зарлага  TOTALS дээр хадгалах
  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };
  return {
    //Дата нэмэх функц
    addItem: function (type, description, value) {
      var item, id;
      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, description, value);
      } else {
        //type ==='exp'
        item = new Expense(id, description, value);
      }
      data.items[type].push(item);
      return item;
    },
    calculateIncome: function () {
      //Нийт орлого зарлага  TOTALS дээр хадгалах
      calculateTotal("inc");
      calculateTotal("exp");
      //Үлдсэн төсөв
      data.leftOver = data.totals.inc - data.totals.exp;
      //Зарлага нь орлогийн хэдэн хувь болхийг тооцоолох
      data.persentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    },
    //Төсөвийг буцаах
    calculatedIncome: function () {
      return {
        totalsInc: data.totals.inc,
        totalsExp: data.totals.exp,
        leftIncome: data.leftOver,
        calPersentage: data.persentage,
      };
    },
  };
})();
//Апп модуль бүх үйлдэл эвент
var appController = (function (uiController, financeController) {
  //MOUSE юмуу ENTER дарсан тохиолдолд болох эвент
  var ctrlAddItem = function () {
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      //Төсөв тооцоолох
      financeController.calculateIncome();
      //Төсөв авах хэсэг
      var allFinnance = financeController.calculatedIncome();
      //Төсөв дэлгэцэнд хэвлэх
      uiController.addCalculatedIncome(allFinnance);

      var perItem = allFinnance.calPersentage;

      uiController.addListItem(item, input.type, perItem);
      uiController.clearField();
    }
  };
  //MOUSE,ENTER дарх DOM болон эвент холболт
  var eventListeners = function () {
    var DOM = uiController.getDomStrings();
    //Click event
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });
    //Keyboard event
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };
  return {
    restartApp: function () {
      uiController.addCalculatedIncome({
        totalsInc: 0,
        totalsExp: 0,
        leftIncome: 0,
        calPersentage: 0,
      });

      eventListeners();
    },
  };
})(uiController, financeController);
appController.restartApp();
