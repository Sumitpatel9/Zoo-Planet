// Auto-fill last updated date
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("sitemap-updated");
  if (el) {
    const date = new Date();
    el.textContent = date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
});
