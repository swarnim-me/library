document.addEventListener("DOMContentLoaded", () => {
    const bodyEle = document.querySelector("body");
    const addBookBtn = document.querySelector(".add-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const themeBtn = document.querySelector(".theme-btn");
    const addBookModal = document.querySelector(".add-book-modal");
    const bookDetailsModal = document.querySelector(".book-details-modal");
    const detailsCloseBtn = document.querySelector(".book-details-modal .close-btn");
    const closeBtns = Array.from(document.querySelectorAll(".close-btn"));
    const nameInput = document.querySelector("#book-name-input");
    const authorInput = document.querySelector("#author-name-input");
    const statusInput = document.querySelector("#status-input");
    const bookCoverURLInput = document.querySelector("#cover-url-input");
    const genreInput = document.querySelector("#genre-input");
    const reviewInput = document.querySelector("#review-input");
    const addBookForm = document.querySelector("form");
    const bookGrid = document.querySelector(".book-grid");
    let ratingInputValue = 0;
    const ratingInput = Array.from(document.querySelectorAll(".rating-input input[type='radio']"));
    let books = [];

    if (localStorage.getItem("books")) {
        books = JSON.parse(localStorage.getItem("books"));
    }
    else {
        localStorage.setItem("books", JSON.stringify([{ "id": 0, "title": "Some Book", "author": "Some person", "coverURL": "./assets/images/default-cover.jpg", "rating": "4", "genre": "Self Help", "status": "Want to read", "review": "Hello, this is nice" }, { "id": 1, "title": "Another one", "author": "Some other person", "coverURL": "./assets/images/default-cover.jpg", "rating": "2", "genre": "Self Help", "status": "Want to read", "review": "ehh, its aight" }]));
    }

    const getBooks = () => {
        return JSON.parse(localStorage.getItem("books"));
    }

    const setBooks = (books) => {
        localStorage.setItem("books", JSON.stringify(books));
        renderGrid();
    }

    const updateBookDB = (newBook) => {
        console.log(JSON.parse(localStorage.getItem("books")));
        const newDB = JSON.parse(localStorage.getItem("books"));
        newDB.push(newBook);
        console.log(newDB);
        localStorage.setItem("books", JSON.stringify(newDB));
        renderGrid();
    }

    const createStatusButton = (book) => {
        const statusValues = ["Want to read", "Reading", "Read"];
        const statusButtonEle = document.createElement("button");
        statusButtonEle.classList.add("status-button");
        statusButtonEle.textContent = book.status;
        const wantToReadColor = window.getComputedStyle(document.documentElement).getPropertyValue('--primary-clr');
        const readingColor = window.getComputedStyle(document.documentElement).getPropertyValue('--reading-clr');
        const readColor = window.getComputedStyle(document.documentElement).getPropertyValue('--read-clr');
        switch (book.status) {
            case statusValues[0]: statusButtonEle.style.background = wantToReadColor; break;
            case statusValues[1]: statusButtonEle.style.background = readingColor; break;
            case statusValues[2]: statusButtonEle.style.background = readColor; break;
        }

        statusButtonEle.addEventListener("click", (event) => {
            event.stopPropagation();
            let currentStatusIndex;
            statusValues.forEach((status, index) => {
                if (book.status === status) currentStatusIndex = index;
            })
            let activeBooks = getBooks();
            activeBooks.forEach(activeBook => {
                if (activeBook.id === book.id) {
                    const nextIndex = currentStatusIndex + 1 == statusValues.length ? 0 : currentStatusIndex + 1;
                    activeBook.status = statusValues[nextIndex];
                }
            })
            setBooks(activeBooks);
        })
        return statusButtonEle;
    }

    const renderGrid = () => {
        bookGrid.innerHTML = "";
        const booksData = JSON.parse(localStorage.getItem("books"));
        booksData.forEach((book, index) => {
            const bookEle = document.createElement("div");
            bookEle.classList.add("book");
            const bookCoverEle = document.createElement("div");
            bookCoverEle.classList.add("book-cover-wrapper");
            bookCoverEle.style.backgroundImage = `url(${book.coverURL})`;
            bookEle.appendChild(bookCoverEle);
            const bookTitleEle = document.createElement("h3");
            bookTitleEle.classList.add("book-title");
            bookTitleEle.textContent = book.title;
            const bookInfoEle = document.createElement("div");
            bookInfoEle.classList.add("book-info");
            const bookAuthorEle = document.createElement("div");
            bookAuthorEle.classList.add("book-author");
            bookAuthorEle.textContent = book.author;
            const bookGenreEle = document.createElement("div");
            bookGenreEle.classList.add("book-genre");
            bookGenreEle.textContent = book.genre;
            bookInfoEle.append(bookAuthorEle, bookGenreEle);
            const bookRatingEle = document.createElement("div");
            bookRatingEle.classList.add("rating");
            for (let i = 0; i < 5; i++) {
                const starEle = document.createElement("img");
                starEle.setAttribute("src", "./assets/icons/star.svg");
                starEle.setAttribute("alt", "star");
                if (i < book.rating) {
                    starEle.classList.add("filter-star");
                }
                bookRatingEle.appendChild(starEle);
            }
            const bookReviewEle = document.createElement("div");
            bookReviewEle.classList.add("book-review");
            bookReviewEle.textContent = book.review.substring(0, 50);
            if (book.review.length > 50) bookReviewEle.textContent += "...";
            const statusButtonEle = createStatusButton(book);
            bookEle.append(bookCoverEle, bookTitleEle, bookInfoEle, bookRatingEle, bookReviewEle, statusButtonEle)
            bookEle.setAttribute("data-book-id", index);

            bookEle.addEventListener("click", () => {
                bookDetailsModal.showModal();
            })
            bookGrid.appendChild(bookEle);
        })
    }

    const resetInputs = () => {
        addBookForm.reset();
        ratingInputValue = 0;
        ratingInput.forEach(ratingStar => {
            ratingStar.classList.remove("filter-star");
        })
    }


    closeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.parentElement.close();
        })
    })

    ratingInput.forEach(rating => {
        rating.addEventListener("click", () => {
            const selected = rating.value;
            ratingInputValue = selected;
            // console.log(selected);
            ratingInput.forEach(star => {
                if (star.value <= selected) {
                    star.classList.add("filter-star")
                }
                else {
                    star.classList.remove("filter-star");
                }
            })
        })
    })

    function Book(title, author, coverURL, rating, genre, status, review) {
        this.id = getBooks().length;
        this.title = title;
        this.author = author;
        this.coverURL = coverURL;
        this.rating = rating;
        this.genre = genre;
        this.status = status;
        this.review = review;
    }

    addBookForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (addBookForm.checkValidity() === false) {
            addBookForm.reportValidity();
            return;
        }
        let bookCover = "./assets/images/default-cover.jpg";
        if (bookCoverURLInput.value != "") bookCover = bookCoverURLInput.value;
        const newBook = new Book(nameInput.value, authorInput.value, bookCover, ratingInputValue, genreInput.value, statusInput.value, reviewInput.value)
        console.log(newBook);
        updateBookDB(newBook);
        addBookModal.close();
        resetInputs();
    })

    addBookBtn.addEventListener("click", () => {
        addBookModal.showModal();
    })

    cancelBtn.addEventListener("click", (event) => {
        event.preventDefault();
        resetInputs();
        addBookModal.close();
    })

    themeBtn.addEventListener("click", () => {
        bodyEle.classList.toggle("dark-mode");
    })
    renderGrid();
})