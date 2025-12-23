//  // Form submission handling
//     document.getElementById('contactForm').addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         // Get form values
//         const name = document.getElementById('name').value;
//         const email = document.getElementById('email').value;
//         const subject = document.getElementById('subject').value;
//         const message = document.getElementById('message').value;
        
//         // In a real implementation, you would send this data to a server
//         console.log('Form submitted:', { name, email, subject, message });
        
//         // Show success message
//         const successMessage = document.createElement('div');
//         successMessage.className = 'success-message';
//         successMessage.innerHTML = `
//             <i class="fas fa-check-circle"></i>
//             <h3>Thank You, ${name}!</h3>
//             <p>Your message has been sent successfully.</p>
//             <p>We'll get back to you within 24 hours.</p>
//             <button class="btn" id="close-success">OK</button>
//         `;
        
//         document.body.appendChild(successMessage);
//         document.body.style.overflow = 'hidden';
//         successMessage.style.display = 'flex';
        
//         // Close success message
//         document.getElementById('close-success').addEventListener('click', function() {
//             document.body.removeChild(successMessage);
//             document.body.style.overflow = 'auto';
//             document.getElementById('contactForm').reset();
//         });
//     });
    
//     // Handle ESC key to close success message
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape') {
//             const successMessage = document.querySelector('.success-message');
//             if (successMessage) {
//                 document.body.removeChild(successMessage);
//                 document.body.style.overflow = 'auto';
//                 document.getElementById('contactForm').reset();
//             }
//         }
//     });
    
//     // Simple map zoom controls (would need proper API integration for real functionality)
//     document.getElementById('zoomIn').addEventListener('click', function(e) {
//         e.preventDefault();
//         alert('In a real implementation, this would zoom in the map');
//     });
    
//     document.getElementById('zoomOut').addEventListener('click', function(e) {
//         e.preventDefault();
//         alert('In a real implementation, this would zoom out the map');
//     });

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone")?.value || "";
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  try {
    const res = await fetch("http://localhost:4000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject,
        message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    // ✅ SUCCESS MODAL (same as your code)
    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <h3>Thank You, ${name}!</h3>
      <p>Your message has been sent successfully.</p>
      <p>We'll get back to you within 24 hours.</p>
      <button class="btn" id="close-success">OK</button>
    `;

    document.body.appendChild(successMessage);
    document.body.style.overflow = "hidden";
    successMessage.style.display = "flex";

    document.getElementById("close-success").addEventListener("click", () => {
      document.body.removeChild(successMessage);
      document.body.style.overflow = "auto";
      document.getElementById("contactForm").reset();
    });
  } catch (error) {
    alert("Server error. Please try again later.");
  }
});
