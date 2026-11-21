import { isKiosk } from "./device.js";

function reportError(message, source) {
  fetch("/api/browser-errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      source,
      device: isKiosk ? "kiosk" : "phone",
    }),
    keepalive: true,
  }).catch(() => {});
}

export function setUpErrorReporting() {
  window.addEventListener("error", (event) => {
    reportError(
      event.message,
      `${event.filename}:${event.lineno}:${event.colno}`,
    );
  });
}

export function showErrorScreenAndReload(error) {
  console.error("An error occurred:", error);
  const errorScreen = document.getElementById("error-screen");
  errorScreen.style.display = "block";
  setTimeout(() => {
    window.location.reload();
  }, 6000);
}
