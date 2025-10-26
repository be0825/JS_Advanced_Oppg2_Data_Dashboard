// Boklesing: En applikasjon for å holde oversikt over bøker som man har lest eller tenker å lese.

const books = [
  //standardbøker:
  {
    id: "Book-1",
    title: "Aeneiden",
    author: "Vergil",
    genre: "Epos",
    pages: 346,
    haveRead: true,
  },
  {
    id: "Book-2",
    title: "The Carmina of Caius Valerius Catullus",
    author: "Catullus",
    genre: "Poesi",
    pages: 100,
    haveRead: true,
  },
  {
    id: "Book-3",
    title: "Hamlet",
    author: "William Shakespeare",
    genre: "Drama",
    pages: 50,
    haveRead: true,
  },
  {
    id: "Book-4",
    title: "The Sound and the Fury",
    author: "William Faulkner",
    genre: "Klassiker",
    pages: 375,
    haveRead: true,
  },
  {
    id: "Book-5",
    title: "The Trial",
    author: "Franz Kafka",
    genre: "Klassiker",
    pages: 212,
    haveRead: true,
  },
  {
    id: "Book-6",
    title: "Lolita",
    author: "Vladimir Nabokov",
    genre: "Klassiker",
    pages: 327,
    haveRead: true,
  },
  {
    id: "Book-7",
    title: "Sense and Sensibility",
    author: "Jane Austen",
    genre: "Klassiker",
    pages: 372,
    haveRead: false,
  },
  {
    id: "Book-8",
    title: "DE OPTIMO GENERE ORATORVM",
    author: "M. TVLLI CICERONIS",
    genre: "Lærebok",
    pages: 72,
    haveRead: false,
  },
  {
    id: "Book-9",
    title: "De rerum natura",
    author: "Lucretius",
    genre: "Filosofi",
    pages: 192,
    haveRead: true,
  },
  {
    id: "Book-10",
    title: "Odysseen",
    author: "Homer",
    genre: "Epos",
    pages: 509,
    haveRead: false,
  },
];

//Variabler fra DOM
const form = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const pagesInput = document.getElementById("pages");
const haveReadInput = document.getElementById("haveRead");
const filterHaveReadBtn = document.getElementById("filterHaveRead");
const sortTitleBtn = document.getElementById("sortTitle");
const clearAllBtn = document.getElementById("clearAll");
const container = document.querySelector("#list-container");

//Opprett bokvisning
const listDiv = document.createElement("div");
listDiv.id = "book-list";
container.appendChild(listDiv);

//Statistikk
const statsDiv = document.createElement("div");
statsDiv.id = "stats";
statsDiv.style.marginTop = "20px";
statsDiv.style.padding = "10px";
container.appendChild(statsDiv);

//Local Storage
const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
const saveBooks = (books) =>
  localStorage.setItem("books", JSON.stringify(books));
// Hvis tom localStorage -> legg inn standardbøkene
if (getBooks().length === 0) {
  saveBooks(books);
}

let showHaveReadOnly = false;
let sortAlphabetically = false;
let bookIndex = 0;

//Legg til ny bok
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newBook = {
    id: "Book-" + Date.now(),
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: genreInput.value.trim(),
    pages: parseInt(pagesInput.value),
    haveRead: haveReadInput.checked, // Bruker .checked for å sjekke om krysset av for lest
  };

  const books = getBooks();
  books.push(newBook);
  saveBooks(books);

  form.reset();
  renderBooks();
});

// shuld we add timestamp here?
//const timestampElement = document.createElement("p");
//timestampElement.textContent = new Date(task.timestamp).toISOString();

/*tester sort men dette ble feil
const sortButton = document.getElementById("sortAlphabetically");
sortButton.addEventListener("click", sort);
function sort() {
  const currentList = getBooks();

  //books.sort((a, b) => a.title - b.title);
  currentList.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
  for (let book of currentList) {
    console.log(book.title);
  }
  //saveBooks(currentList);
  renderBooks();
}*/

//Vis bøker
function renderBooks() {
  let books = getBooks();

  if (showHaveReadOnly) {
    books = books.filter((b) => b.haveRead);
  }

  if (sortAlphabetically) {
    books.sort((a, b) => a.title.localeCompare(b.title));
  }

  //sortering som ikke funket skikkelig
  // if (sortAlphabetically)
  //  books.sort((a, b) => {
  //     if (a.title < b.title) return -1;
  //    if (a.title > b.title) return 1;
  //    return 0;
  //   });

  listDiv.innerHTML = "";

  if (books.length === 0) {
    listDiv.innerHTML = "<p>Ingen bøker funnet.</p>";
    statsDiv.innerHTML = "";
    return;
  }

  books.map((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.margin = "10px 0";
    card.style.borderRadius = "8px";
    card.style.color = "#cf1515ff";
    card.style.background = "#d4babaff";

    const haveReadOrNot = book.haveRead ? "Har lest" : "Har ikke lest";

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Forfatter:</strong> ${book.author}</p>
      <p><strong>Sjanger:</strong> ${book.genre}</p>
      <p><strong>Sider:</strong> ${book.pages}</p>
      <button class="have-read-btn">${haveReadOrNot}</button>
      <button class="delete-btn">Slett</button>
    `;

    //Toggle har lest
    card.querySelector(".have-read-btn").addEventListener("click", () => {
      toggleHaveRead(book.id);
    });

    //Slett bok
    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteBook(book.id);
    });

    listDiv.appendChild(card);
  });

  renderStats(books);
}

//Statistikk med reduce()
function renderStats(books) {
  const totalBooks = books.length;
  const totalPages = books.reduce((sum, b) => sum + (b.pages || 0), 0);
  const haveReadCount = books.filter((b) => b.haveRead).length;

  statsDiv.innerHTML = `
    <p><strong>Totalt antall bøker:</strong> ${totalBooks}</p>
    <p><strong>Totalt antall sider:</strong> ${totalPages}</p>
    <p><strong>Antall leste bøker:</strong> ${haveReadCount}</p>
  `;
}

/**function addBook(title) {
  if (title === "" || title.length < 3) {
    return; // Early return
  }

  const newBook = {
    description,
    completed: false,
    timestamp: Date.now(),
    id: bookIndex++, // id <- 0, bookIndex = bookIndex+1
  };
  books.push(newBook);}*/

//Toggle har lest
function toggleHaveRead(id) {
  const books = getBooks().map((b) => {
    if (b.id === id) b.haveRead = !b.haveRead;
    return b;
  });
  saveBooks(books);
  renderBooks();
}

//Slett bok
function deleteBook(id) {
  if (!confirm("Vil du slette denne boken?")) return;
  const books = getBooks().filter((b) => b.id !== id);
  saveBooks(books);
  renderBooks();
}

//Slett alle bøkene
clearAllBtn.addEventListener("click", () => {
  if (!confirm("Vil du slette alle bøker?")) return;
  localStorage.removeItem("books");
  renderBooks();
});

//Vis bare leste bøker
filterHaveReadBtn.addEventListener("click", () => {
  showHaveReadOnly = !showHaveReadOnly;
  filterHaveReadBtn.textContent = showHaveReadOnly
    ? "Vis alle"
    : "Vis leste bøker";
  renderBooks();
});

//Sorter A–Å
sortTitleBtn.addEventListener("click", () => {
  sortAlphabetically = !sortAlphabetically;
  sortTitleBtn.textContent = sortAlphabetically ? "Usortert" : "Sorter A–Å";
  renderBooks();
});

//Skriv listen
renderBooks();
