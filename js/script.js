document.addEventListener("DOMContentLoaded", () => {
    const bodyEle = document.querySelector("body");
    const addBookBtn = document.querySelector(".add-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const themeBtn = document.querySelector(".theme-btn");
    const addBookModal = document.querySelector(".add-book-modal");
    addBookBtn.addEventListener("click", () => {
        addBookModal.showModal();
    })

    cancelBtn.addEventListener("click", (event) => {
        event.preventDefault();
        addBookModal.close();
    })

    themeBtn.addEventListener("click", () => {
        bodyEle.classList.toggle("dark-mode");
    })
})