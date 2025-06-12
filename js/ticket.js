        // Set minimum date to today
        document.getElementById('visit-date').min = new Date().toISOString().split('T')[0];

        // Ticket prices
        const ticketPrices = {
            adult: 24.99,
            child: 14.99,
            senior: 19.99,
            family: 69.99,
            student: 18.99,
            group: 12.99
        };

        let selectedTickets = {};

        // Ticket selection functionality
        document.querySelectorAll('.select-ticket').forEach(btn => {
            btn.addEventListener('click', function () {
                const type = this.dataset.type;

                if (selectedTickets[type]) {
                    selectedTickets[type]++;
                } else {
                    selectedTickets[type] = 1;
                }

                updateTicketSelection();

                // Animate the selected ticket card
                const card = this.closest('.ticket-card');
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 300);
            });
        });

        function updateTicketSelection() {
            const container = document.getElementById('selected-tickets');
            container.innerHTML = '';

            let total = 0;

            for (const [type, quantity] of Object.entries(selectedTickets)) {
                const price = ticketPrices[type];
                const subtotal = price * quantity;
                total += subtotal;

                const ticketDiv = document.createElement('div');
                ticketDiv.className = 'selected-ticket';
                ticketDiv.innerHTML = `
                <div>
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)} x${quantity}</span>
                    <button class="remove-ticket" data-type="${type}">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                </div>
                <span>₹${subtotal.toFixed(2)}</span>
            `;

                container.appendChild(ticketDiv);
            }

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-ticket').forEach(btn => {
                btn.addEventListener('click', function () {
                    const type = this.dataset.type;

                    if (selectedTickets[type] > 1) {
                        selectedTickets[type]--;
                    } else {
                        delete selectedTickets[type];
                    }

                    updateTicketSelection();
                });
            });

            document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;
        }

        // Update the updateTicketSelection function to include discard buttons
        function updateTicketSelection() {
            const container = document.getElementById('selected-tickets');
            container.innerHTML = '';

            let total = 0;

            for (const [type, quantity] of Object.entries(selectedTickets)) {
                const price = ticketPrices[type];
                const subtotal = price * quantity;
                total += subtotal;

                const ticketDiv = document.createElement('div');
                ticketDiv.className = 'selected-ticket';
                ticketDiv.innerHTML = `
            <div>
                <span>${type.charAt(0).toUpperCase() + type.slice(1)} x${quantity}</span>
                <div class="ticket-actions">
                    <button class="remove-ticket" data-type="${type}" title="Remove one">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                    <button class="discard-ticket" data-type="${type}" title="Discard all">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <span>₹${subtotal.toFixed(2)}</span>
        `;

                container.appendChild(ticketDiv);
            }

            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-ticket').forEach(btn => {
                btn.addEventListener('click', function () {
                    const type = this.dataset.type;

                    if (selectedTickets[type] > 1) {
                        selectedTickets[type]--;
                    } else {
                        delete selectedTickets[type];
                    }

                    updateTicketSelection();
                });
            });

            // Add event listeners to discard buttons
            document.querySelectorAll('.discard-ticket').forEach(btn => {
                btn.addEventListener('click', function () {
                    const type = this.dataset.type;
                    delete selectedTickets[type];
                    updateTicketSelection();
                });
            });

            document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;

            // Add "Clear All" button if there are tickets
            if (Object.keys(selectedTickets).length > 0) {
                const clearAllDiv = document.createElement('div');
                clearAllDiv.className = 'clear-all';
                clearAllDiv.innerHTML = `
            <button class="btn clear-all-btn">
                <i class="fas fa-times-circle"></i> Discard All Tickets
            </button>
        `;
                container.appendChild(clearAllDiv);

                document.querySelector('.clear-all-btn').addEventListener('click', function () {
                    selectedTickets = {};
                    updateTicketSelection();
                });
            }
        }

        // Payment method selection
        // document.querySelectorAll('input[name="payment"]').forEach(radio => {
        //     radio.addEventListener('change', function () {
        //         // Hide all payment details
        //         document.querySelectorAll('.payment-details').forEach(detail => {
        //             detail.style.display = 'none';
        //         });

        //         // Show selected payment details
        //         if (this.value === 'credit') {
        //             document.getElementById('credit-details').style.display = 'block';
        //         }
        //         else if (this.value === 'paypal') {
        //             document.getElementById('paypal-details').style.display = 'block';
        //         }
        //         else if (this.value === 'upi') {
        //             document.getElementById('upi-details').style.display = 'block';
        //         }
        //         else if (this.value === 'cash') {
        //             document.getElementById('cash-details').style.display = 'block';
        //         }
        //     });
        // });

        // Payment method selection
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', function () {
                // Hide all payment details
                document.querySelectorAll('.payment-details').forEach(detail => {
                    detail.classList.remove('active');
                });

                // Show selected payment details
                document.getElementById(`${this.value}-details`).classList.add('active');
            });
        });

        // UPI method selection
        document.querySelectorAll('input[name="upi-method"]').forEach(radio => {
            radio.addEventListener('change', function () {
                document.querySelector('.upi-qr').classList.toggle('active', this.value === 'qr');
                document.querySelector('.upi-id').classList.toggle('active', this.value === 'id');
            });
        });

        // Format card number input
        document.getElementById('card-number')?.addEventListener('input', function (e) {
            this.value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        });

        // Format expiry date input
        document.getElementById('expiry')?.addEventListener('input', function (e) {
            this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
        });

        // Form submission
        document.getElementById('ticket-form').addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('visit-date').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

            if (Object.keys(selectedTickets).length === 0) {
                alert('Please select at least one ticket type.');
                return;
            }

            // Show confirmation with animation
            const confirmation = document.createElement('div');
            confirmation.className = 'confirmation-message';
            confirmation.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Thank you, ${name}!</h3>
            <p>Your tickets for ${date} have been booked.</p>
            <p>A confirmation has been sent to ${email}.</p>
            <button class="btn" id="close-confirmation">OK</button>
        `;

            document.body.appendChild(confirmation);
            document.body.style.overflow = 'hidden';

            // Close confirmation
            document.getElementById('close-confirmation').addEventListener('click', function () {
                document.body.removeChild(confirmation);
                document.body.style.overflow = 'auto';

                // Reset form
                e.target.reset();
                selectedTickets = {};
                updateTicketSelection();
            });
        });

    // Generate a random booking reference
    function generateBookingReference() {
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const numbers = '0123456789';
        let ref = 'WAZ-';
        
        // Add 3 random letters
        for (let i = 0; i < 3; i++) {
            ref += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        
        // Add 4 random numbers
        for (let i = 0; i < 4; i++) {
            ref += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        return ref;
    }

    // Format date for display
    function formatDisplayDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Show confirmation modal with all details
    function showConfirmationModal(formData) {
        const modal = document.getElementById('confirmation-modal');
        const today = new Date().toISOString().split('T')[0];
        
        // Set booking reference
        document.getElementById('booking-reference').textContent = generateBookingReference();
        
        // Set visitor info
        document.getElementById('conf-name').textContent = formData.name;
        document.getElementById('conf-email').textContent = formData.email;
        document.getElementById('conf-phone').textContent = formData.phone;
        
        // Set visit info
        document.getElementById('conf-visit-date').textContent = formatDisplayDate(formData.visitDate);
        document.getElementById('conf-booking-date').textContent = formatDisplayDate(today);
        document.getElementById('conf-payment-method').textContent = 
            formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1);
        
        // Set ticket items
        const ticketItemsContainer = document.getElementById('conf-ticket-items');
        ticketItemsContainer.innerHTML = '';
        
        let total = 0;
        for (const [type, quantity] of Object.entries(selectedTickets)) {
            const price = ticketPrices[type];
            const subtotal = price * quantity;
            total += subtotal;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
                <td>${quantity}</td>
                <td>₹${price.toFixed(2)}</td>
                <td>₹${subtotal.toFixed(2)}</td>
            `;
            ticketItemsContainer.appendChild(row);
        }
        
        // Set total amount
        document.getElementById('conf-total-amount').textContent = `₹${total.toFixed(2)}`;
        
        // Generate QR code (using a simple API for demo purposes)
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            `Booking Ref: ${document.getElementById('booking-reference').textContent}\n` +
            `Name: ${formData.name}\n` +
            `Date: ${formData.visitDate}\n` +
            `Tickets: ${Object.keys(selectedTickets).length} types, ${Object.values(selectedTickets).reduce((a, b) => a + b, 0)} total`
        )}`;
        
        document.getElementById('ticket-qr-code').innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`;
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Download ticket as PNG
    function downloadTicket() {
        // In a real implementation, you would use a library like html2canvas
        alert('In a real implementation, this would download the ticket as a PNG image.');
        // Example:
        // html2canvas(document.querySelector('.modal-content')).then(canvas => {
        //     const link = document.createElement('a');
        //     link.download = 'wildlife-zoo-ticket.png';
        //     link.href = canvas.toDataURL();
        //     link.click();
        // });
    }

    // Print ticket
    function printTicket() {
        window.print();
    }

    // Event listeners for modal buttons
    document.addEventListener('DOMContentLoaded', function() {
        // Close modal when clicking X, close button, or outside modal
        document.querySelector('.close-modal')?.addEventListener('click', closeConfirmationModal);
        document.querySelector('.close-btn')?.addEventListener('click', closeConfirmationModal);
        document.getElementById('confirmation-modal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeConfirmationModal();
            }
        });

        // Download and print buttons
        document.querySelector('.download-ticket')?.addEventListener('click', downloadTicket);
        document.querySelector('.print-ticket')?.addEventListener('click', printTicket);
    });

    // Update form submission to show the detailed modal
    document.getElementById('ticket-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const visitDate = document.getElementById('visit-date').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        if (Object.keys(selectedTickets).length === 0) {
            alert('Please select at least one ticket type.');
            return;
        }

        showConfirmationModal({
            name,
            email,
            phone,
            visitDate,
            paymentMethod
        });
    });