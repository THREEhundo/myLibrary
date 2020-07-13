const myLibrary = [];
var database = firebase.database();

function Book(atitle, author, genre, pages, read, bookID, key) {
  this.atitle = atitle;
  this.author = author;
  this.genre = genre;
  this.pages = pages;
  this.read = read;
  this.bookID = bookID;
  this.key = key
}

// Toggling the Read checkbox will change the property in both the myLibrary array and the database
Book.prototype.toggleRead = function(checkBox) {
  if (checkBox) {
    this.read = 'yes';
    readYes(this.key);
  } else if (!checkBox) {
    this.read = 'no';
    readNo(this.key);
  }
}

function addBookToLibrary(atitle, author, genre, pages, read, bookID) {
  // take form send to database
  addBookToDB(atitle, author, 'bookID', genre, pages, read);

  const bookLog = new Book(atitle, author, genre, pages, read, bookID, getKey());
  // console.log(bookLog);
  myLibrary.push(bookLog);
  bookID = myLibrary.indexOf(bookLog);
  render(bookLog, bookID);

  // add key property to object
  var ref = database.ref('books')
  var bookRef = ref.child(getKey());
  bookRef.update({
    'key': getKey()
  });

  // update the database bookID attribute
  database.ref('books/' + bookLog.key).update({
    'bookID': myLibrary.indexOf(bookLog)
  });
}

function render(obj, index) {
  const table = document.querySelector('#table');
  addRow(obj, index);
}

function createTable(arr) {
  const table = document.createElement('table');
  const tableContainer = document.querySelector('.table-container');
  table.id = 'table';
  let data = Object.keys(arr[0])
  generateTHead(table, data);
  generateTable(table, arr);
  tableContainer.append(table);
}

function generateTHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    if (key === 'bookID' || key === 'key') {
      void(0);
    } else if (key === 'atitle') {
      let th = document.createElement('th');
      let text = document.createTextNode('title');
      th.append(text);
      row.append(th);
    } else {
      let th = document.createElement('th');
      let text = document.createTextNode(key);
      th.append(text);
      row.append(th);
    }
  }
}

function generateTable(table, data) {
  const tBody = document.createElement('tbody');
  for (let elem of data) {
    let row = table.insertRow();
    row.dataset.book = data.indexOf(elem);
    elem.bookID = data.indexOf(elem);
    for (let key in elem) {
      if (key === 'bookID' || key === 'toggleRead' || key === 'key') {
        void(0);
      } else if (key === 'read') {
        const cell = row.insertCell();
        const checkBox = document.createElement('input');
        const cbc = checkBox.checked;
        checkBox.type = 'checkbox';
        checkBox.name = 'readBook';
        checkBox.onclick = function() {
          elem.toggleRead(checkBox.checked);
        }
        if (elem[key] === 'yes') {
          checkBox.value = 'yes';
          checkBox.setAttribute('checked', '');
        }

        cell.append(checkBox);
        row.append(cell);
        tBody.append(row);

      } else {
        let cell = row.insertCell();
        let text = document.createTextNode(elem[key]);
        cell.append(text);
        row.append(cell);
        tBody.append(row);
      }
    }
    console.log(row, row.dataset.book);
    deleteBtn(row, row.dataset.book);
  }
  table.append(tBody);
}

// New book row added to table
function addRow(data, index) {
  const tBody = document.querySelector('tBody');
  let row = table.insertRow();
  row.dataset.book = index;
  for (key in data) {
    if (key === 'bookID' || key === 'toggleRead' || key === 'key') {
      void(0);
    } else if (key === 'read') {
      const cell = row.insertCell();
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.name = 'readBook';
      checkBox.value = 'yes';
      checkBox.onclick = function() {
        data.toggleRead(checkBox.checked);
      }

      if (data[key] === 'yes') {
        checkBox.setAttribute('checked', '');
      }

      cell.append(checkBox);
      row.append(cell);
      tBody.append(row);
    } else {
      let cell = row.insertCell();
      let text = document.createTextNode(data[key]);
      cell.append(text);
      row.append(cell);
      tBody.append(row);
    }
  }
  deleteBtn(row, index);
}

function deleteBtn(row, index) {
  const deleteR = document.createElement('button');
  deleteR.innerHTML = 'X';
  const cell = row.insertCell();
  cell.classList.add('deleteBtnCell');
  cell.append(deleteR);
  row.append(cell);
  deleteR.addEventListener('click', function() {
    // delete row
    const parent = row.parentNode;
    parent.removeChild(row);

    const num = row.dataset.book;
    const key = myLibrary[num].key

    // Delete database object
    database.ref('books/' + key).remove();

    // delete object in myLibrary array
    myLibrary.splice(index, 1);

    for (let book of myLibrary) {
      if (myLibrary.indexOf(book) !== book.bookID) {
        // Iterate over all cells & find the author
        // Use the author to find parent node
        // Reset data-book to reflect current array element value
        let tds = [...document.querySelectorAll('td')].find(el => el.textContent == book.author);
        tds.parentNode.dataset.book = myLibrary.indexOf(book);
        book.bookID = myLibrary.indexOf(book);

        // update the bookID in the database
        database.ref('books/' + book.key).update({
          'bookID': myLibrary.indexOf(book)
        });
      }
    }
  });
}

function formBtn() {
  const btn = document.createElement('button');
  btn.classList.add('add-book');
  btn.classList.add('btn');
  btn.textContent = 'Add New Book';

  let data = Object.keys(myLibrary[0]);

  // Show form & set focus to first input
  btn.addEventListener('click', function() {
    const formContainer = document.querySelector('.form-container');

    formContainer.style.display = 'flex';
    document.querySelector('#atitle').focus();
  });
  const tableContainer = document.querySelector('.table-container');

  tableContainer.append(btn);
}

function createForm(data) {
  const formContainer = document.createElement('div');
  formContainer.classList.add('form-container');
  const bookForm = document.createElement('form');

  for (let key of data) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    if (key === 'read') {
      const yesInput = document.createElement('input');
      const readContainer = document.createElement('div');
      input.type = "checkbox";
      input.name = "readBook";
      input.id = 'readInput';
      input.value = 'yes';
      yesInput.type = "hidden";
      yesInput.name = "readBook";
      yesInput.value = 'no';
      label.for = 'readInput';
      label.innerHTML = 'Have You Read This Book?';
      readContainer.append(label);
      label.append(yesInput);
      label.append(input);
      bookForm.append(readContainer);
    } else if (key === 'pages') {
      input.type = 'number';
      input.name = key;
      input.id = key;
      label.for = key;
      label.innerHTML = `${capitalize(key)}: `;
      label.append(input);
      bookForm.append(label);
    } else if (key === 'bookID' || key === 'key') {
      void(0);
    } else if (key === 'atitle') {
      input.type = 'text';
      input.name = key;
      input.id = key;
      label.for = key;
      label.innerHTML = `${capitalize(key.slice(1))}: `;
      label.append(input);
      bookForm.append(label);
    } else {
      input.type = 'text';
      input.name = key;
      input.id = key;
      label.for = key;
      label.innerHTML = `${capitalize(key)}: `;
      label.append(input);
      bookForm.append(label);
    }
    if (input.id == 'atitle') {
      input.setAttribute("autofocus", "autofocus");
    }
  }

  const submit = document.createElement('input');
  submit.classList.add('btn2');
  submit.type = 'button';
  submit.value = 'submit';
  submit.id = 'btnsubmit';
  submit.addEventListener('click', addBook)

  function addBook() {
    // if checkbox is checked input value into add function
    let checked;
    const readCheckBox = document.querySelector('#readInput');

    if (readCheckBox.checked) {
      checked = 'yes';
    } else {
      checked = 'no';
    }

    const atitle = document.querySelector('#atitle');
    const author = document.querySelector('#author');
    const pages = document.querySelector('#pages');
    const genre = document.querySelector('#genre');
    addBookToLibrary(atitle.value, author.value, genre.value, parseInt(pages.value), checked, myLibrary.length + 1);
    atitle.value = '';
    author.value = '';
    pages.value = '';
    genre.value = '';
    readCheckBox.checked = false;
    formContainer.style.display = 'none';
  };

  formContainer.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      formContainer.style.display = 'none';
    }
  });

  bookForm.append(submit);
  formContainer.append(bookForm);
  document.body.append(formContainer);
  formContainer.style.display = 'none';
}


// Capitalize first letter
const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/***** DATABASE FUNCTIONS *****/

// Listen for last change and return key of that object
function getKey() {
  let key;
  database.ref('books').on('child_added', function(data) {
    key = data.key;
  });
  return key;
}

function addBookToDB(atitle, author, bookID, genre, pages, read) {
  var bookData = {
    atitle: atitle,
    author: author,
    bookID: bookID,
    genre: genre,
    pages: pages,
    read: read,
  };

  // Generate key for a new Book
  var newBookKey = database.ref().child('books').push().key;

  // Update database with book data
  var updates = {};
  updates['/books/' + newBookKey] = bookData;

  return database.ref().update(updates);
}

// Update the database read attribute to yes
function readYes(key) {
  database.ref('books/' + key).update({
    'read': 'yes'
  });

}

// Update the database read attribute to no
function readNo(key) {
  database.ref('books/' + key).update({
    'read': 'no'
  });
}

// Initialize table from database
var ref = database.ref('books');
ref.once('value', function(snapshot) {
    const objContainer = snapshot.val();
    for (let book in objContainer) {
      let arr = Object.entries(objContainer[book]);
      myLibrary.push(new Book(arr[0][1], arr[1][1], arr[3][1], arr[5][1], arr[6][1], arr[2][1], arr[4][1]));
    }

    createTable(myLibrary);
    formBtn();
    createForm(Object.keys(myLibrary[0]));
  },
  function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });