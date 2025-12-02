// Smooth scroll for map button
document.querySelectorAll('a[href^="#map-section"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector("#map-section").scrollIntoView({ behavior: "smooth" });
  });
});
