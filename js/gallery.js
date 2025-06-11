 // Gallery filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.dataset.filter;
                const items = document.querySelectorAll('.gallery-item');

                items.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Lightbox functionality
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.querySelector('.lightbox-caption');

        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', function () {
                // First set the lightbox content to the clicked image
                lightboxImg.src = this.src;
                lightboxCaption.textContent = this.alt;

                // Then show the lightbox
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';

                // After showing the clicked image, load the high-res version
                const highResImg = new Image();
                highResImg.src = this.dataset.enlarged;
                highResImg.onload = function () {
                    lightboxImg.src = this.src;
                };
            });
        });

        document.querySelector('.close-lightbox').addEventListener('click', function () {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Close lightbox with ESC key
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && lightbox.style.display === 'block') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });