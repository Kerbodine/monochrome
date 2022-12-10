/* This runs after a web page loads */

// Create cursor
let cursor = document.createElement("div");
cursor.id = "cursor";
cursor.style.display = "none";
document.body.append(cursor);

function enableMono() {
  cursor.style.display = "block";
  document.documentElement.style.filter = "grayscale(100%)";
  document.documentElement.style.cursor = "none";
}

function disableMono() {
  cursor.style.display = "none";
  document.documentElement.style.filter = "";
  document.documentElement.style.cursor = "default";
}

// Listen for background script messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.monochrome === true) {
    enableMono();
  } else {
    disableMono();
  }
});

// Listen for command+shift+g to toggle cursor
document.addEventListener("keydown", function (e) {
  if (e.key === "g" && e.shiftKey && e.metaKey) {
    if (cursor.style.display === "none") {
      enableMono();
      chrome.runtime.sendMessage({ monochrome: true });
    } else {
      disableMono();
      (async () => {
        await chrome.runtime.sendMessage({ monochrome: false });
      })();
    }
  }
});

// Make cursor bigger when hovering over buttons and links
const buttons = document.querySelectorAll("button");
const links = document.querySelectorAll("a");
[...buttons, ...links].forEach((btn) => {
  btn.addEventListener("mouseleave", () => {
    cursor.classList.remove("big");
  });
  btn.addEventListener("mouseover", () => {
    cursor.classList.add("big");
  });
});

const frames = document.querySelectorAll("iframe");
frames.forEach((btn) => {
  btn.addEventListener("mouseleave", () => {
    cursor.classList.remove("hidden");
  });
  btn.addEventListener("mouseover", () => {
    cursor.classList.add("hidden");
  });
});

// Move cursor
window.addEventListener("mousemove", cursorMove);
function cursorMove(e) {
  window.requestAnimationFrame(() => {
    cursor.style.top = `${e.pageY - cursor.offsetHeight / 2}px`;
    cursor.style.left = `${e.pageX - cursor.offsetHeight / 2}px`;
  });
}
