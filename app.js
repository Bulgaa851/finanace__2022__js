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
    containerDiv: ".container",
    itemPersentage: ".item__percentage",
    dateLabel: ".budget__title--month",
  };
  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");

    var y = "";
    var count = 1;

    for (var i = 0; i < x.length; i++) {
      y = y + x[i];

      if (count % 3 === 0) y = y + ",";
      count++;
    }

    var z = y.split("").reverse().join("");

    if (z[0] === ",") z = z.substr(1, z.length - 1);

    if (type === "inc") z = "+ " + z;
    else z = "- " + z;

    return z;
  };
  return {
    //Оролтууд
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    //Public DOM name
    getDomStrings: function () {
      return DOMstrings;
    },
    displayPersentage: function (allPersentages) {
      //Node list persentage
      var elements = document.querySelectorAll(DOMstrings.itemPersentage);
      //Element bolgonoos huwiig massiw aas awj shiwih
      nodeListForEach(elements, function (el, index) {
        el.textContent = allPersentages[index];
      });
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
    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    //Дэлгэцэнд орлого зарлага нэмэх
    addListItem: function (item, type) {
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          ' <div class="item clearfix" id="inc-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">$val$</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
      } else {
        list = DOMstrings.expensesList;
        html =
          '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">$val$</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
      }
      var html = html.replace("%id%", item.id);
      var html = html.replace("%desc%", item.description);
      var html = html.replace("$val$", formatMoney(item.value, type));
      //DOM руу холболж дэлгэцэнд гаргана

      document.querySelector(list).insertAdjacentHTML("beforebegin", html);
    },

    //Дэлгэцэнд төсөв хэвлэх
    addCalculatedIncome: function (allFinnance) {
      var type;
      if (allFinnance.leftIncome > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.leftIncome_).textContent = formatMoney(
        allFinnance.leftIncome,
        type
      );
      document.querySelector(DOMstrings.incomeCalculated).textContent =
        formatMoney(allFinnance.totalsInc, (x = "inc"));
      document.querySelector(DOMstrings.expensesCalculated).textContent =
        formatMoney(allFinnance.totalsExp, (x = "exp"));
      allFinnance.calPersentage !== 0
        ? (document.querySelector(
            DOMstrings.persentageCalculated_
          ).textContent = allFinnance.calPersentage + "%")
        : (document.querySelector(
            DOMstrings.persentageCalculated_
          ).textContent = allFinnance.calPersentage);
    },
    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );
      nodeListForEach(fields, function (el) {
        el.classList.toggle("red-focus");
      });
      window.document.querySelector(DOMstrings.addBtn).classList.toggle("red");
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
    this.persentage = -1;
  };
  Expense.prototype.calculatPersentage = function (totalIncome) {
    if (totalIncome !== 0) {
      this.persentage = Math.round((this.value / totalIncome) * 100) + "%";
    } else this.persentage = 0;
  };
  Expense.prototype.getPersentage = function () {
    return this.persentage;
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
      data.totals.inc > 0
        ? (data.persentage = Math.round(
            (data.totals.exp / data.totals.inc) * 100
          ))
        : (data.persentage = 0);
    },
    calcuPersantage: function () {
      data.items.exp.forEach(function (el) {
        el.calculatPersentage(data.totals.inc);
      });
    },
    getPersentages: function () {
      var allPersentages = data.items.exp.map(function (el) {
        return el.getPersentage();
      });
      return allPersentages;
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
    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
  };
})();
//Апп модуль бүх үйлдэл эвент
var appController = (function (uiController, financeController) {
  //MOUSE юмуу ENTER дарсан тохиолдолд болох эвент
  var ctrlAddItem = function () {
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      input.value = parseInt(input.value);
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      //Веб рүү тохируулана
      uiController.addListItem(item, input.type);
      uiController.clearField();
      //Төсөвийг шинээр тооцоолох
      updateFinance();
    }
  };
  var updateFinance = function () {
    //Төсөв тооцоолох
    financeController.calculateIncome();
    //Төсөв авах хэсэг
    var allFinnance = financeController.calculatedIncome();
    //Төсөв дэлгэцэнд хэвлэх
    uiController.addCalculatedIncome(allFinnance);
    //Exp хувийг тооцоолоно
    financeController.calcuPersantage();
    //Хувийг хүлээж авна
    var allPersentages = financeController.getPersentages();
    //Хувийг хэвлэнэ
    console.log(allPersentages);
    uiController.displayPersentage(allPersentages);
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
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var idItem = parseInt(arr[1]);
          //Устгана модулаас
          financeController.deleteItem(type, idItem);
          //Дэлгэц дээрээс устгана
          uiController.deleteListItem(id);
          //Үлдэгдэл гаргана
          updateFinance();
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
