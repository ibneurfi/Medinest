let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
};

window.onscroll = () => {
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("hospitalForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.number.value.trim();
    const date = form.date.value.trim();

    if (!/^\d{10}$/.test(phone)) {
      showModal("📞 Please enter a valid 10-digit phone number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showModal("📧 Please enter a valid email address.");
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const token = Math.floor(100000 + Math.random() * 900000);
        const message = `
          <h3> Thank you <strong>${name}</strong>, your appointment is booked!</h3> </br>
          <p> Your Token Number: <strong>${token}</strong></p> </br>
          <p> Appointment Date: <strong>${date || "Not Specified"}</strong></p>
        `;
        showModal(message);
        form.reset();
      } else {
        const data = await response.json();
        if (data.errors) {
          showModal(data.errors.map(e => e.message).join(", "));
        } else {
          showModal("⚠️ Oops! Something went wrong.");
        }
      }
    } catch {
      showModal("🌐 Network error. Please try again later.");
    }
  });
});

function showModal(message) {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const closeBtn = document.getElementById("closeModal");
  const animationContainer = document.getElementById("lottie-animation");

  // Decide which GIF to show based on the message content
  let gifSrc = "done.gif"; // default is success

  if (message.includes("10-digit") || message.toLowerCase().includes("valid number")) {
    gifSrc = "cross.gif"; // show error gif if it's an invalid number message
  }

  animationContainer.innerHTML = `<img src="${gifSrc}" alt="Status" class="done-gif">`;

  modalMessage.innerHTML = `<p class="modal-text">${message}</p>`;


  modal.style.display = "block";

  closeBtn.onclick = () => {
    modal.style.display = "none";
    animationContainer.innerHTML = "";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      animationContainer.innerHTML = "";
    }
  };
}
