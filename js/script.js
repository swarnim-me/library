document.addEventListener("DOMContentLoaded", () => {
    const bodyEle = document.querySelector("body");
    const addBookBtn = document.querySelector(".add-btn");
    const themeBtn = document.querySelector(".theme-btn");
    const addBookModal = document.querySelector(".add-book-modal");
    const icons = Array.from(document.querySelectorAll(".icon"));
    addBookBtn.addEventListener("click", () => {
        addBookModal.showModal();
    })

    themeBtn.addEventListener("click", () => {
        bodyEle.classList.toggle("dark-mode");
        // icons.forEach(icon => icon.classList.toggle("invert"));
    })
})