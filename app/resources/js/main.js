// TODO: subcategories?
// TODO: login / save mechanism
// TODO: random xp
// TODO: Max-width option button?
// TODO: Fix reordering
// TODO: fix sticky hover on mobile

let data = (localStorage.getItem('todoList')) ? JSON.parse                      (localStorage.getItem('todoList')) : {
      todo: [],
      completed: []
};

let audioOn = true;
let audioCheck = document.getElementById("audiocheckbox");

let audioClick = new Audio("app/resources/assets/sfx/click.mp3");
let audioQuestComplete = new Audio("app/resources/assets/sfx/questcomplete.mp3");
let audioQuestAdded = new Audio("app/resources/assets/sfx/questadded.mp3");
let audioQuestAbandon = new Audio("app/resources/assets/sfx/questabandoned.mp3");

let audioCheckBoxElement = document.getElementById("audiocheckbox");
audioCheckBoxElement.addEventListener('change', toggleAudio);


function toggleAudio() {
  if (audioCheck.checked == true) {
    audioOn = true;
  } else {
    audioOn = false;
  }
}

renderTodoList();

// User clicked on add item button
// Add item to to do list
document.getElementById('addItem').addEventListener('click', function() {
  let value = document.getElementById('item').value;

  if(value) {
    if (value) {
      addItem(value);
    }

  }
});

document.getElementById('item').addEventListener('keydown', function(e) {
  let value = this.value;
  if (e.code === 'Enter' && value) {
    addItem(value);
  }
});

function addItem(value) {
  addItemToDOM(value);
      document.getElementById('item').value = '';
      
      data.todo.push(value);
      dataObjectUpdated();
      if (audioOn) {
        audioClick.play();
        audioQuestAdded.play();
      }
}

function renderTodoList() {
  if (!data.todo.length && !data.completed.length) return;

  for (let i = 0; i < data.todo.length; i++) {
    var value = data.todo[i];
    addItemToDOM(value);
  }

  for (let j = 0; j < data.completed.length; j++) {
    var value = data.completed[j];
    addItemToDOM(value, true);
  }
};

function dataObjectUpdated() {
  localStorage.setItem('todoList', JSON.stringify(data));
}

// Create a pop-up "are you sure" box with yes/no buttons, as well as a bg blocking element. Then either delete the object, or close the box
function removeItem() {
  let body = document.getElementById("main");
  let buttons = document.createElement('div');
  buttons.classList.add('buttons');

  let popUpBox = document.createElement('popupbox');
  popUpBox.classList.add("popup");

  let bgBlock = document.createElement('bgBlock');
  bgBlock.classList.add("bgBlock");

  popUpBox.innerText = "Are you sure you want to abandon this quest?";

  let yes = document.createElement('button');
  yes.classList.add("yes");

  let no = document.createElement('button');
  no.classList.add("no");

  var clickedListItem = (this);

  yes.addEventListener('click', function e() {
    var item = clickedListItem.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;

    if (id === 'todo') {
      data.todo.splice(data.todo.indexOf(value), 1);
    } else {
      data.completed.splice(data.completed.indexOf(value), 1);
    }

    item.remove();
    $('.bgBlock').remove();
    $('.popup').remove();

    dataObjectUpdated();

    if (audioOn) {
      audioClick.play();
      audioQuestAbandon.play();
    }
  });

  no.addEventListener('click', function e() {
    $('.bgBlock').remove();
    $('.popup').remove();
  
    if (audioOn) {
      audioClick.play();
    }
  });

  buttons.appendChild(yes);
  buttons.appendChild(no);
  popUpBox.appendChild(buttons);

  body.appendChild(popUpBox);
  body.appendChild(bgBlock);

  if (audioOn) {
    audioClick.play();
  }
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;

  if (id === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
  }
  dataObjectUpdated();

  // if ID = todo, change to completed. or, it is completed, so change it back to todo
  var target = (id === 'todo') ? 
                document.getElementById('completed'):
                document.getElementById('todo');

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
  if (audioOn) {
    audioClick.play();
    audioQuestComplete.play();
  }
}

function addItemToDOM(text, completed) {
  let list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

  let item = document.createElement('li');
  // item.innerText = "fuck";

  let innerItem = document.createElement('div');
  innerItem.classList.add('textbox');
  innerItem.innerText = text;

  let buttons = document.createElement('div');
  buttons.classList.add('buttons');

  let remove = document.createElement('button');
  remove.classList.add('remove');

  // Add click event for removing item
  remove.addEventListener('click', removeItem);
  
  let complete = document.createElement('button');
  complete.classList.add('complete')

  // Add click event for completing the item
  complete.addEventListener('click', completeItem);

  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(innerItem);
  item.appendChild(buttons);

  list.insertBefore(item, list.childNodes[0]);
}

//SortableJS list sorting code
let todo = document.getElementById('todo');
let completed = document.getElementById('completed');

let sortabletoDo = new Sortable(todo, {
  animation: 150,
  onEnd: function (e) {dataObjectUpdated()},
  store: {
		/**
		 * Get the order of elements. Called once during initialization.
		 * @param   {Sortable}  sortable
		 * @returns {Array}
		 */
		get: function (sortable) {
			var order = localStorage.getItem(sortable.options.group.name);
			return order ? order.split('|') : [];
		},

		/**
		 * Save the order of elements. Called onEnd (when the item is dropped).
		 * @param {Sortable}  sortable
		 */
		set: function (sortable) {
			var order = sortable.toArray();
			localStorage.setItem(sortable.options.group.name, order.join('|'));
		}
	}
});
let sortableCompleted = new Sortable(completed, {
  animation: 150,
  onUpdate: function (e) {dataObjectUpdated()},
  store: {

		get: function (sortable) {
			var order = localStorage.getItem(sortable.options.group.name);
			return order ? order.split('|') : [];
		},

		set: function (sortable) {
			var order = sortable.toArray();
			localStorage.setItem(sortable.options.group.name, order.join('|'));
    }
  }
});