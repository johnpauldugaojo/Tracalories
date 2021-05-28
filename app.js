// Storage Controller /IEFI
const StorageCtroller = (function () {
  // Public Methods
  return {
    storeItem: function (item) {
      let items;
      // Check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set LS. Local Storage Hold String
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // default its string > to become an object /Get what already in LS
        items = JSON.parse(localStorage.getItem('items'));
        // Push the new Item
        items.push(item);
        // Reset the Local Storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsfromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },

    // Update Item Storage
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    // Delete Item to Storage
    deleteItemStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    // Cleat All Items to Storage
    clearItemStorage: function () {
      localStorage.removeItem('items');
    },
  };
})();

// Item Controller - 1
const ItemController = (function () {
  // Create Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   // {
    //   //   id: 0,
    //   //   name: 'Steak',
    //   //   calories: 1200,
    //   // },
    //   // {
    //   //   id: 1,
    //   //   name: 'Hamburger',
    //   //   calories: 900,
    //   // },
    //   // {
    //   //   id: 2,
    //   //   name: 'Eggs',
    //   //   calories: 200,
    //   // },
    // ],
    items: StorageCtroller.getItemsfromStorage(),
    currentItem: null, //Ung Current na iuupdate mo once na iclick mo ung button update
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems: function () {
      return data.items; //Data
    },

    addItem: function (name, calories) {
      let ID;
      // Create ID Auto Incerement
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to Number
      calories = parseInt(calories);

      // Create a new Item
      newItem = new Item(ID, name, calories);

      // Add the New Item to the Data
      data.items.push(newItem);

      return newItem;
    },

    //
    getItemById: function (id) {
      let found = null;
      // loop through the items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    // update item
    upateItem: function (name, calories) {
      // calories to num
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    //Delete Item
    deleteItem: function (id) {
      // Get the ids
      ids = data.items.map(function (item) {
        return item.id;
      });

      // Get the index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    // Clear all Items
    clearAllItems: function () {
      data.items = [];
    },

    // Set Current Item
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    // Get Current item
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      // Loop Through Items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });
      // Set Total Cal in data Struc
      data.totalCalories = total;
      // return Total
      return data.totalCalories;
    },

    logData: function () {
      return data;
      //Need mo i return para maging public
    },
  };
})();

// UI Control which is the Design the Button and The Views - 2
const UIController = (function () {
  //Private
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    clearBtn: '.clear-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    showTotal: '.total-calories',
  };

  // Public Methods
  return {
    populateItemsList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += ` <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil-alt"></i>
        </a>
      </li>`;
      });
      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },

    addListItem: function (item) {
      // Show the List
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create <li></li> element
      const li = document.createElement('li');
      // Add Class Name
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil-alt"></i>
      </a>`;

      // Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },

    // Update List Item to UI
    updateListItem: function (updatedItem) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List to Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${updatedItem.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${updatedItem.name}:</strong> <em>${updatedItem.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil-alt"></i>
          </a>`;
        }
      });
    },

    // Delete List Item
    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },

    // Clear Input
    clearFields: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    // Add Item to Form
    addItemForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemController.getCurrentItem().calories;
      UIController.showEditState();
    },

    // Remove All Items
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },

    // HideList
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.showTotal).textContent = totalCalories;
    },

    // Hide the Edit Delete and Back button pag load palng
    clearEditState: function () {
      UIController.clearFields();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    // Show edit and del button
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller -> Main Controller -> Dito I cacall lahat ng functions
const AppController = (function (
  ItemController,
  StorageCtroller,
  UIController
) {
  // Load Event Listeners
  const loadEventListeners = function () {
    //Get UI Selectors from UI Controller
    const UISelectors = UIController.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSumbit);

    // Disable Enter Listner
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // EDIT ICON CLICK - EDIT
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    // Update Item Event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    // Back Button Eveent
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UIController.clearEditState());

    //Delete Button Event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    // Clear Fields Button
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsBtn);
  };

  // Add Item Submit
  const itemAddSumbit = function (e) {
    // Get Form Input from UI Controller

    const input = UIController.getItemInput();

    // Check for name and calories if the input is empty
    //Laman ng GetItemIput sa Ui Controller
    if (input.name !== '' && input.calories !== '') {
      // Add Item
      const newItem = ItemController.addItem(input.name, input.calories);

      // Add Item to UI
      UIController.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemController.getTotalCalories();

      // Add total Calories to UI
      UIController.showTotalCalories(totalCalories);

      // Store in Local Storage Controller
      StorageCtroller.storeItem(newItem);

      // ClearField
      UIController.clearFields();
    }

    e.preventDefault();
  };

  // Click Edit Item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //  Get list item id(item-0,1,2) which is ung <li></li>
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the Actual Id
      const id = parseInt(listIdArr[1]);

      // Get Item
      const itemToEdit = ItemController.getItemById(id);
      // console.log(itemToEdit);

      // Set Current Item
      ItemController.setCurrentItem(itemToEdit);

      // Add Item To Form
      UIController.addItemForm();
    }

    e.preventDefault();
  };

  // Update Item submit
  const itemUpdateSubmit = function (e) {
    // Get Item Input
    const input = UIController.getItemInput();

    // update item
    const updatedItem = ItemController.upateItem(input.name, input.calories);

    // Update UI
    UIController.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = ItemController.getTotalCalories();

    // Add total Calories to UI
    UIController.showTotalCalories(totalCalories);

    // Update Local Storage

    StorageCtroller.updateItemStorage(updatedItem);

    UIController.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = function (e) {
    // Get The Current Item
    const currentItem = ItemController.getCurrentItem();

    // Delete from Data Structure
    ItemController.deleteItem(currentItem);

    // Delete form UI
    UIController.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = ItemController.getTotalCalories();

    // Add total Calories to UI
    UIController.showTotalCalories(totalCalories);

    // Delete Items from LS
    StorageCtroller.deleteItemStorage(currentItem.id);

    UIController.clearEditState();

    e.preventDefault();
  };

  const clearAllItemsBtn = function () {
    //  Delete All Items on Data Structure
    ItemController.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemController.getTotalCalories();

    // Add total Calories to UI
    UIController.showTotalCalories(totalCalories);

    // Remove from UI
    UIController.removeItems();

    // Clear from LS
    StorageCtroller.clearItemStorage();

    // Hide the UL
    UIController.hideList();
  };

  // Public Methods
  return {
    init: function () {
      // Cler Edit State
      UIController.clearEditState();

      // Fetch Items from Data Structure and Item Controller
      const items = ItemController.getItems();

      // Check if any items
      if (items.length === 0) {
        UIController.hideList();
      } else {
        // Populate List with Items
        UIController.populateItemsList(items);
      }
      // Get Total Calories
      const totalCalories = ItemController.getTotalCalories();

      // Add total Calories to UI
      UIController.showTotalCalories(totalCalories);

      // Load Event Listenerds
      loadEventListeners();
    },
  };
})(ItemController, StorageCtroller, UIController);

// Initialize App hn
AppController.init();
