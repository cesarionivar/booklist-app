const form = document.querySelector("#bookListForm");
const btnSubmit = document.querySelector("#btnSubmit");
const tableBooks = document.querySelector("#books");
let booksTemp = [];

const printAlert = (message) => {
  const existeAlerta = document.querySelector(".error");
  if (existeAlerta) return;

  // Create an alert for errors purpose
  const divAlerta = document.createElement("div");
  divAlerta.classList.add("error");
  divAlerta.textContent = message;

  form.insertAdjacentElement("beforebegin", divAlerta);

  // Delete alert after 3 seconds
  setTimeout(() => {
    divAlerta.remove();
  }, 3000);
};


const showBooks = () => {

  const books = loadBooks();
  console.log(books);

  if(books.length <= 0) {
    tableBooks.classList.add('none');
    return;
  }
  let booksHtml = '';
  // console.log(books);
  books.forEach(book => {
    booksHtml += `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" data-id="${book.id}">X</a></td>
      </tr>
    `;
  });

  tableBooks.querySelector("tbody").innerHTML = booksHtml;

}

const loadBooks = () => {
  let books = localStorage.getItem("books")
    ? JSON.parse(localStorage.getItem("books"))
    : [];
  return books;
};

const saveBooks = (addBook) => {
  let books = loadBooks();
  books.push(...addBook);
  localStorage.setItem("books", JSON.stringify(books));
};

const newBook = (book) => {
  book.id = new Date().getTime();
  booksTemp.push(book);
  saveBooks(booksTemp);
};

document.addEventListener("DOMContentLoaded", () => {
  showBooks();
});

tableBooks.addEventListener('click', e => {
  if(e.target.matches('a')) {
    e.preventDefault();
    const confirmation = confirm('Are you sure, you want to delete this book?');
    if(!confirmation) return;

    const id = e.target.dataset.id;
    const books = loadBooks();
    const deleteBook = books.filter(book => book.id != id);
    localStorage.removeItem('books');
    saveBooks(deleteBook);
    location.reload();
  }

});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = e.target.title.value;
  const author = e.target.author.value;
  const isbn = e.target.isbn.value;

  if (title === "" || author === "" || isbn === "") {
    printAlert("Todos los campos son obligatorios!");
    return;
  }

  const book = { title, author, isbn, };

  newBook(book);
  location.reload();
  form.reset();
  e.target.title.focus();

});
