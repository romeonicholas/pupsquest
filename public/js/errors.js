export function showErrorScreenAndReload(error) {
  console.error("An error occurred:", error);
  const errorScreen = document.getElementById("error-screen");
  errorScreen.style.display = "block";
  setTimeout(() => {
    window.location.reload();
  }, 6000);
}
