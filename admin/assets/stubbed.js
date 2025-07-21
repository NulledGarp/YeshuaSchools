document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm");
  const eventForm = document.getElementById("addEventForm");

  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      const user = loginForm.username.value.trim();
      const pass = loginForm.password.value.trim();

      // TODO: Replace with real auth backend check
      if (user === "admin" && pass === "yeshua123") {
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("errorMessage").classList.remove("hidden");
      }
    };
  }

  if (eventForm) {
    eventForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = eventForm.title.value;
      const date = eventForm.date.value;
      const desc = eventForm.description.value;

      // TODO: Send to backend
      console.log("Submitting event:", { title, date, desc });
      alert("Event added!");
      eventForm.reset();
    };

    // Load sample events
    const eventList = document.getElementById("eventList");
    eventList.innerHTML = `
      <div class="border rounded p-2">
        <strong>YHS Orientation</strong><br />
        <span class="text-gray-500">2025-08-20</span>
      </div>
    `;
  }
});

function logout() {
  window.location.href = "adminlogin.html";
}
