// AMOUNT BUTTONS
const amountBtns = document.querySelectorAll(".amount-btn");
const customAmount = document.getElementById("custom-amount");

amountBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    amountBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    customAmount.value = btn.dataset.amount;
  });
});

// PAYMENT METHOD SWITCH
const paymentRadios = document.querySelectorAll("input[name='pay-method']");
const upiSection = document.getElementById("upi-section");
const cardSection = document.getElementById("card-section");
const paypalSection = document.getElementById("paypal-section");

paymentRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    upiSection.classList.remove("active");
    cardSection.classList.remove("active");
    paypalSection.classList.remove("active");

    if (radio.value === "upi") upiSection.classList.add("active");
    if (radio.value === "card") cardSection.classList.add("active");
    if (radio.value === "paypal") paypalSection.classList.add("active");
  });
});

// DONATE BUTTON
document.getElementById("donate-btn").addEventListener("click", () => {
  alert("Thank you for your donation! ❤️\nYour support helps save wildlife.");
});
