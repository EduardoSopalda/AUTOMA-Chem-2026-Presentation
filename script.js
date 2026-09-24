document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const navButtons = document.querySelectorAll(".nav-item, .secondary-btn");

  function activateSlide(targetId) {
    slides.forEach((slide) => {
      slide.classList.toggle("active", slide.id === targetId);
    });

    navButtons.forEach((button) => {
      const isNavTarget = button.dataset.target === targetId;
      button.classList.toggle("active", isNavTarget && button.classList.contains("nav-item"));
    });

    const navList = document.querySelectorAll(".nav-item");
    navList.forEach((button) => {
      button.classList.toggle("active", button.dataset.target === targetId);
    });
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      if (target) {
        activateSlide(target);
      }
    });
  });
});
