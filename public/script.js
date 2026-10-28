const tossButtons = [...document.querySelectorAll(".wool-ball")];
const game = document.querySelector("#playroom");
const puffLayer = document.querySelector("#puff-layer");
const gameStatus = document.querySelector("#game-status");
const replayButton = document.querySelector("#replay-button");
let tossCount = 0;

function tossPuff(button) {
  if (tossCount >= 5) return;
  tossCount += 1;

  const puff = document.createElement("span");
  puff.className = `falling-puff puff-${button.dataset.color}`;
  puff.style.setProperty("--drop-x", `${20 + Math.random() * 60}%`);
  puffLayer.append(puff);
  puff.addEventListener("animationend", () => puff.remove(), { once: true });

  game.classList.remove("is-dancing");
  void game.offsetWidth;
  game.classList.add("is-dancing");
  window.setTimeout(() => game.classList.remove("is-dancing"), 750);

  if (tossCount === 5) {
    gameStatus.textContent = "Quest complete! The flock is fabulously fluffy.";
    tossButtons.forEach((item) => { item.disabled = true; });
    replayButton.hidden = false;
  } else {
    gameStatus.textContent = `${tossCount} of 5 · toss again to keep them bouncing`;
  }
}

tossButtons.forEach((button) => button.addEventListener("click", () => tossPuff(button)));

replayButton.addEventListener("click", () => {
  tossCount = 0;
  tossButtons.forEach((button) => { button.disabled = false; });
  replayButton.hidden = true;
  gameStatus.textContent = "0 of 5 · make the flock wiggle";
  game.classList.remove("is-dancing");
  puffLayer.replaceChildren();
  tossButtons[0].focus();
});

const form = document.querySelector("#waitlist-form");
const emailInput = document.querySelector("#email");
const message = document.querySelector("#form-message");
const submit = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.removeAttribute("data-state");
  if (!emailInput.value.trim() || !emailInput.validity.valid) {
    emailInput.setAttribute("aria-invalid", "true");
    message.dataset.state = "error";
    message.textContent = "Pop in a valid email address and try again.";
    emailInput.focus();
    return;
  }
  emailInput.removeAttribute("aria-invalid");
  if (window.location.protocol === "file:") {
    message.dataset.state = "error";
    message.textContent = "The waitlist will be ready after the site is deployed to Cloudflare.";
    return;
  }
  submit.disabled = true;
  submit.textContent = "One sec…";
  message.textContent = "Adding your name to the flock…";
  try {
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput.value.trim(), website: form.elements.website.value }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not add your email.");
    message.dataset.state = "success";
    message.textContent = result.duplicate
      ? "You’re already on the list. We’ll be in touch when the shop opens."
      : "You’re on the list! We’ll be in touch when the shop opens.";
    emailInput.value = "";
  } catch (error) {
    message.dataset.state = "error";
    message.textContent = error.message === "Failed to fetch"
      ? "The list is getting fluffed up. Please try again in a moment."
      : error.message;
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Count me in <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 12 12 4M5 4h7v7" /></svg>';
  }
});
