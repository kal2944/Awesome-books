/* eslint-disable max-classes-per-file */
const form = document.querySelector('form');

class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }
}
class Storage {
  static BooksFromStorage() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static BooksToStorage(book) {
    const books = Storage.BooksFromStorage();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeFromStorage(author) {
    const books = Storage.BooksFromStorage();

    books.forEach((book, i) => {
      if (book.author === author) {
        books.splice(i, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

class BooksToDom {
  static displayBooksInDom() {
    const books = Storage.BooksFromStorage();

    books.forEach((book) => BooksToDom.BooksList(book));
  }

  static BooksList(book) {
    const tbody = document.querySelector('#tbody');
    const tableRow = document.createElement('tr');

    tableRow.innerHTML = `
    <td>${`"${book.title}"`}</td>
    <td>by</td>
    <td>${book.author}</td>
    <td><a href="#" class='rm-button'>Remove</a></td>
    `;
    tbody.appendChild(tableRow);
  }

  static deleteBook(el) {
    if (el.classList.contains('rm-button')) {
      el.parentElement.parentElement.remove();
    }
  }

  static clearField() {
    document.querySelector('#b-title').value = '';
    document.querySelector('#b-author').value = '';
  }
}

document.addEventListener('DOMContentLoaded', BooksToDom.displayBooksInDom);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('b-title').value;
  const author = document.getElementById('b-author').value;

  const book = new Book(title, author);

  BooksToDom.BooksList(book);

  Storage.BooksToStorage(book);

  BooksToDom.clearField();
});

document.querySelector('#tbody').addEventListener('click', (e) => {
  BooksToDom.deleteBook(e.target);
  Storage.removeFromStorage(
    e.target.parentElement.previousElementSibling.textContent,
  );
});