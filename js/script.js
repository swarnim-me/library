document.addEventListener("DOMContentLoaded", () => {
    const bodyEle = document.querySelector("body");
    const addBookBtn = document.querySelector(".add-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const themeBtn = document.querySelector(".theme-btn");
    const addBookModal = document.querySelector(".add-book-modal");
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
        localStorage.setItem("books", JSON.stringify(books));
    }

    const updateBookDB = (newBook) => {
        console.log(JSON.parse(localStorage.getItem("books")));
        const newDB = JSON.parse(localStorage.getItem("books"));
        newDB.push(newBook);
        console.log(newDB);
        localStorage.setItem("books", JSON.stringify(newDB));
        renderGrid();
    }

    const renderGrid = () => {
        bookGrid.innerHTML = "";
        const booksData = JSON.parse(localStorage.getItem("books"));
        booksData.forEach(book => {
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
            bookReviewEle.textContent = book.review;
            const statusButtonEle = document.createElement("button");
            statusButtonEle.classList.add("status-button");
            statusButtonEle.textContent = "Want to read";
            bookEle.append(bookCoverEle, bookTitleEle, bookInfoEle, bookRatingEle, bookReviewEle, statusButtonEle)
            bookGrid.appendChild(bookEle);
        })
    }

    const resetInputs = () => {
        addBookForm.reset();
        ratingInputValue = 0;
        ratingInput.forEach(ratingStar => {
            ratingStar.style.filter = "none";
        })
    }

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
        let bookCover = "./assets/images/defaultCover.jpg";
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