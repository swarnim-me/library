document.addEventListener("DOMContentLoaded", () => {
    const bodyEle = document.querySelector("body");
    const bookGrid = document.querySelector(".book-grid");

    //General
    const closeBtns = Array.from(document.querySelectorAll(".close-btn"));
    const addBookBtn = document.querySelector(".add-btn");
    const themeBtn = document.querySelector(".theme-btn");

    // Add Book Inputs
    const addBookModal = document.querySelector(".add-book-modal");
    const cancelBtn = document.querySelector(".cancel-btn");
    const nameInput = document.querySelector("#book-name-input");
    const authorInput = document.querySelector("#author-name-input");
    const statusInput = document.querySelector("#status-input");
    const bookCoverURLInput = document.querySelector("#cover-url-input");
    const genreInput = document.querySelector("#genre-input");
    const ratingInput = Array.from(document.querySelectorAll(".rating-input input[type='radio']"));
    const reviewInput = document.querySelector("#review-input");
    const addBookForm = document.querySelector("form");
    const addTitle = document.querySelector(".add-title");

    //Book Details Modal
    const bookDetailsModal = document.querySelector(".book-details-modal");
    const bookDetailsTitle = document.querySelector(".book-details-modal .modal-title");
    const bookDetailsCover = document.querySelector(".book-details-modal .modal-cover");
    const bookDetailsAuthor = document.querySelector(".book-details-modal .modal-author");
    const bookDetailsGenre = document.querySelector(".book-details-modal .modal-genre");
    const bookDetailsRating = document.querySelector(".book-details-modal .rating");
    const bookDetailsReview = document.querySelector(".book-details-modal .modal-review");
    const editBtn = document.querySelector(".edit-btn");

    let ratingInputValue = 0;
    let isEditing = false;
    let currentSelectedBook = {};

    if (!localStorage.getItem("books")) {
        localStorage.setItem("books", JSON.stringify([{ "id": 0, "title": "Some Book", "author": "Some person", "coverURL": "./assets/images/default-cover.jpg", "rating": "4", "genre": "Self Help", "status": "Want to read", "review": "Hello, this is nice" }, { "id": 1, "title": "Another one", "author": "Some other person", "coverURL": "./assets/images/default-cover.jpg", "rating": "2", "genre": "Self Help", "status": "Want to read", "review": "ehh, its aight" }]));
    }

    const getBooks = () => {
        return JSON.parse(localStorage.getItem("books"));
    }

    const getBookIndexById = (id) => {
        const activeDB = getBooks();
        for (let i = 0; i < activeDB.length; i++) {
            if (activeDB[i].id === Number(id)) return i;
        }
        return -1;
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

    const addStarsToEle = (rating, ele) => {
        ele.innerHTML = "";
        for (let i = 0; i < 5; i++) {
            const starEle = document.createElement("img");
            starEle.setAttribute("src", "./assets/icons/star.svg");
            starEle.setAttribute("alt", "star");
            if (i < rating) {
                starEle.classList.add("filter-star");
            }
            ele.appendChild(starEle);
        }
    }

    const renderGrid = () => {
        bookGrid.innerHTML = "";
        const booksData = JSON.parse(localStorage.getItem("books"));
        booksData.forEach((book, index) => {
            const bookEle = document.createElement("div");
            bookEle.classList.add("book");
            const bookCoverEle = document.createElement("div");
            bookCoverEle.classList.add("book-cover-wrapper");
            bookCoverEle.style.backgroundImage = `url('${book.coverURL}')`;
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
            addStarsToEle(book.rating, bookRatingEle);
            const bookReviewEle = document.createElement("div");
            bookReviewEle.classList.add("book-review");
            bookReviewEle.textContent = book.review.substring(0, 50);
            if (book.review.length > 50) bookReviewEle.textContent += "...";
            const statusButtonEle = createStatusButton(book);
            bookEle.append(bookCoverEle, bookTitleEle, bookInfoEle, bookRatingEle, bookReviewEle, statusButtonEle)
            bookEle.setAttribute("data-book-id", index);

            addBookListener(bookEle);

            bookGrid.appendChild(bookEle);
        })
    }

    const addBookListener = (bookEle) => {
        bookEle.addEventListener("click", () => {
            console.log(bookEle.dataset.bookId);
            const activeDB = getBooks();
            const activeBookIndex = getBookIndexById(bookEle.dataset.bookId);
            currentSelectedBook = activeDB[activeBookIndex];
            if (activeBookIndex !== -1) {
                bookDetailsTitle.textContent = currentSelectedBook.title;
                bookDetailsCover.style.backgroundImage = `url(${currentSelectedBook.coverURL})`;
                bookDetailsAuthor.textContent = currentSelectedBook.author;
                bookDetailsGenre.textContent = currentSelectedBook.genre;
                bookDetailsReview.textContent = currentSelectedBook.review;
                addStarsToEle(currentSelectedBook.rating, bookDetailsRating);
                bookDetailsModal.showModal();
            }
        })
    }

    editBtn.addEventListener("click", () => {
        isEditing = true;
        addTitle.textContent = "Edit";
        nameInput.value = currentSelectedBook.title;
        authorInput.value = currentSelectedBook.author;
        statusInput.value = currentSelectedBook.status;
        bookCoverURLInput.value = currentSelectedBook.coverURL ?? "";
        genreInput.value = currentSelectedBook.genre;
        reviewInput.value = currentSelectedBook.review;
        addStarsToRatingInput(currentSelectedBook.rating);
        addBookModal.showModal();
    })

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
        resetInputs();
    })

    const addStarsToRatingInput = (ratingCount) => {
        ratingInput.forEach((star, index) => {
            if (ratingCount && ratingCount > index) star.classList.add("filter-star");
        })
        ratingInput.forEach((rating, index) => {
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
    }

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
        let newBook = {};
        if (Object.keys(currentSelectedBook).length !== 0) {
            const activeDB = getBooks();
            activeDB.forEach((book, index) => {
                if (book.id === currentSelectedBook.id) {
                    activeDB[index] = {
                        id: book.id,
                        title: nameInput.value,
                        author: authorInput.value,
                        coverURL: bookCoverURLInput.value,
                        status: statusInput.value,
                        genre: genreInput.value,
                        rating: ratingInputValue === 0 ? book.rating : ratingInputValue,
                        review: reviewInput.value,
                    }
                }
            })
            addTitle.textContent = "Add";
            setBooks(activeDB);
            currentSelectedBook = {};
        }
        else {
            newBook = new Book(nameInput.value, authorInput.value, bookCover, ratingInputValue, genreInput.value, statusInput.value, reviewInput.value)
            updateBookDB(newBook);
        }
        addBookModal.close();
        bookDetailsModal.close();
        addTitle.textContent = "Add";
        resetInputs();
    })

    addBookBtn.addEventListener("click", () => {
        addStarsToRatingInput();
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