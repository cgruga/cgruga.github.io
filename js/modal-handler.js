// JavaScript to update modal content based on clicked item
document.addEventListener('DOMContentLoaded', function () {
    var imageModal = document.getElementById('imageModal');
    imageModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        var button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        var imageSrc = button.getAttribute('data-bs-image');
        var imageCaption = button.getAttribute('data-bs-caption');

        // Update the modal's content
        var modalImage = imageModal.querySelector('#modalImage');
        var modalCaption = imageModal.querySelector('#modalCaption');

        modalImage.src = imageSrc;
        modalCaption.textContent = imageCaption;
    });
});