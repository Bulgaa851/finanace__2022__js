var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDomStrings: function () {
      return DOMstrings;
    },
  };
})();
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
  };
  return {
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
    },
    seeData: function () {
      return data;
    },
  };
})();
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    var inPut = uiController.getInput();
    financeController.addItem(inPut.type, inPut.description, inPut.value);
  };
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
      eventListeners();
    },
  };
})(uiController, financeController);
appController.restartApp();
