// ========== COMMON HELPERS ==========
function setPujaDetails(name, amt, temple) {
  const ev = document.getElementById("eventName");
  const am = document.getElementById("amount");
  const st = document.getElementById("sourceTemple");

  if (ev) ev.value = name || "";
  if (am) am.value = amt || 0;
  if (st && temple) st.value = temple;
}

function validateBeforeSubmit(formId = "paymentForm") {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function(e) {
    const name = (document.getElementById("eventName")?.value || "").trim();
    const amount = parseFloat(document.getElementById("amount")?.value || 0);

    if (!name || isNaN(amount) || amount <= 0) {
      e.preventDefault();
      alert("Please select a valid puja & amount before proceeding.");
      return false;
    }

    // double submit stop
    const btn = form.querySelector("button[type='submit'], input[type='submit']");
    if (btn) {
      btn.disabled = true;
      btn.innerText = "Processing...";
    }
  });
}

function wireButtons(selector = "[data-puja-name][data-puja-amount]") {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(btn => {
    btn.addEventListener("click", function() {
      const name = this.getAttribute("data-puja-name");
      const amount = parseFloat(this.getAttribute("data-puja-amount"));
      const temple = this.getAttribute("data-puja-temple") || "";
      setPujaDetails(name, amount, temple);
    });
  });
}

window.addEventListener("load", function() {
  validateBeforeSubmit();     // paymentForm default
  wireButtons();
});
