document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.getElementById("theme-btn");
  const darkText = document.getElementById("dark-text");
  const lightText = document.getElementById("light-text");

  const updateThemeHighlight = (theme) => {
    if (theme === "dark") {
      darkText.classList.add("selected-theme");
      lightText.classList.remove("selected-theme");
    } else {
      darkText.classList.remove("selected-theme");
      lightText.classList.add("selected-theme");
    }
  };

  const currentTheme = localStorage.getItem("converter-theme") || "dark";
  document.body.classList.add(`${currentTheme}-mode`);
  updateThemeHighlight(currentTheme);

  themeButton.addEventListener("click", () => {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("converter-theme", "light");
      updateThemeHighlight("light");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("converter-theme", "dark");
      updateThemeHighlight("dark");
    }
  });
});
