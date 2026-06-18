const preorderButtons = document.querySelectorAll("[data-preorder-plan]");

preorderButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const plan = button.dataset.preorderPlan;
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Opening checkout...";

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to start checkout.");
      }

      window.location.href = payload.url;
    } catch (error) {
      button.textContent = originalText;
      button.disabled = false;
      alert(error.message || "Checkout is not ready yet. Please try again soon.");
    }
  });
});
