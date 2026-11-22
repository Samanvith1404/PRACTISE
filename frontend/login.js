const form = document.querySelector("#login-form");
const message = document.querySelector("#login-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  let i=0;
  message.textContent = "";
  message.className = "message";

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Signing in…";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.elements.username.value.trim(),
        password: form.elements.password.value
      })
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to sign in.");
    }

    message.textContent = result.message;
    message.classList.add("success");
  } catch (error) {
    message.textContent = error.message || "Could not reach the server. Try again.";
    message.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sign in";
  }
});
