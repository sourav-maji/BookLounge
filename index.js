// Variable decleration
const baseUrl = `https://api.freeapi.app/api/v1/public/books`;
let currentPage = 1;
let books = [];
let totalPage;
let isGrid = true;
let previousPage = false;
let nextPage = false;

// Elements reference
const bookCard = document.getElementById("bookCard");
const gridView = document.getElementById("gridView");
const listView = document.getElementById("listView");
const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const sortByTitle = document.getElementById("sortByTitle");
const sortByDate = document.getElementById("sortByDate");
const previousPageBtn = document.getElementById("previousPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");

if (bookCard && gridView) {
  gridView.addEventListener("click", () => {
    console.log("Called");
    bookCard.className = "row";
  });
}
if (bookCard && listView) {
  listView.addEventListener("click", () => {
    bookCard.className = "col";
  });
}

// function for fetch books

function getBooks(url, page) {
  let apiUrl = url;
  if (page) {
    apiUrl = url + `?page=${page}`;
  }
  fetch(apiUrl)
    .then((resposnse) => {
      if (!resposnse.ok) {
        throw new Error("Network response was not ok");
      }

      return resposnse.json();
    })
    .then((data) => {
      console.log("data ... ", data);
      // Assign the values on variable on api response
      totalPage = data.data.totalPages;
      previousPage = data.data.previousPage;
      nextPage = data.data.nextPage;
      books = data.data.data;
      showRecords(books);
    })
    .catch((error) => {
      console.log(`Something went wrong : ${error}`);
    });
}

// getBooks(baseUrl, currentPage);
// setTimeout(() => {
//   // console.log(totalPage);
//   console.log(books);
//   // console.log(previousPage);
//   // console.log(nextPage);
//   // console.log(books);
// }, 1500);

window.onload = () => {
  getBooks(baseUrl, currentPage);
  setTimeout(() => {
    showRecords(books);
  }, 300);
};

// Show Records
function showRecords(localBookData) {
  const bookCard = document.getElementById("bookCard");
  bookCard.textContent = "";

  if (localBookData.length < 1) {
    bookCard.textContent = "No Book Found";
  }

  localBookData.forEach((element) => {
    let cardparent = document.createElement("div");
    cardparent.className = "col-sm-3 mb-4";

    let cardDiv = document.createElement("div");
    cardDiv.className = "card h-100";
    cardDiv.style.width = "100%";

    let titleDiv = document.createElement("div");
    titleDiv.className = "card-header text-center";
    let title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = element.volumeInfo.title;
    titleDiv.appendChild(title);
    cardDiv.appendChild(titleDiv);

    // Thumbnail Image
    let thumbnail = document.createElement("img");
    thumbnail.src = element.volumeInfo.imageLinks.thumbnail;
    thumbnail.className = "card-img-top";
    cardDiv.appendChild(thumbnail);

    // Book Info Section
    let infoDiv = document.createElement("div");
    infoDiv.className = "card-body text-center";

    // Author(s)
    let author = document.createElement("p");
    author.className = "card-text";
    author.textContent = `Author(s): ${element.volumeInfo.authors?.join(", ")}`;
    infoDiv.appendChild(author);

    // Publisher
    let publisher = document.createElement("p");
    publisher.className = "card-text";
    publisher.textContent = element.volumeInfo.publisher;
    infoDiv.appendChild(publisher);

    // Published Date
    let publishedDate = document.createElement("p");
    publishedDate.className = "card-text";
    publishedDate.textContent = element.volumeInfo.publishedDate;
    infoDiv.appendChild(publishedDate);

    // Add all info to the card
    cardDiv.appendChild(infoDiv);

    // Open book details in a new tab when clicking on the image
    thumbnail.addEventListener("click", function () {
      if (element.volumeInfo.infoLink) {
        window.open(element.volumeInfo.infoLink, "_blank");
      } else {
        alert("No more details available for this book.");
      }
    });

    cardparent.appendChild(cardDiv);
    bookCard.appendChild(cardparent);
  });
}

if (searchButton) {
  searchButton.addEventListener("click", function () {
    const userInput = searchBox.value;

    if (!userInput || !userInput.trim()) {
      alert("Please provide input");
      return;
    }
    const filteredBooks = searchBooks(books, userInput);
    showRecords(filteredBooks);
  });
}

// Implementing the Search function
function searchBooks(books, userInput) {
  const filteredBooks = books.filter((element) => {
    const bookTitle = element.volumeInfo.title.toLowerCase();
    let bookAuthors = element.volumeInfo.authors.join(", ");
    bookAuthors = bookAuthors.toLowerCase();
    if (
      bookTitle.includes(userInput.toLowerCase()) ||
      bookAuthors.includes(userInput.toLowerCase())
    ) {
      return true;
    }
  });

  console.log("filteredBooks", filteredBooks);

  return filteredBooks;
}

// Implement the sorting functionality
if (sortByTitle) {
  sortByTitle.addEventListener("click", () => {
    sortedBooks = sortBooksByTitle(books);

    showRecords(sortedBooks);
  });
}

function sortBooksByTitle(localBook) {
  return localBook.sort((a, b) => {
    return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
  });
}

function sortBooksByDate(localBook) {
  return localBook.sort(
    (a, b) =>
      new Date(a.volumeInfo.publishedDate) -
      new Date(b.volumeInfo.publishedDate)
  );
}

if (sortByDate) {
  sortByDate.addEventListener("click", () => {
    sortedBooks = sortBooksByDate(books);

    showRecords(sortedBooks);
  });
}

previousPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    getBooks(baseUrl, currentPage--);
    showRecords(books);
  } else {
    alert("You're already in first page");
  }
});
nextPageBtn.addEventListener("click", () => {
  if (currentPage < totalPage) {
    getBooks(baseUrl, currentPage++);
    showRecords(books);
  } else {
    alert("You're already in first page");
  }
});
