let receipt = [];

document.addEventListener('DOMContentLoaded', function() {
    // Fetching the GET parameters in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('booking_id');

    if (id) {
        addReceipt(id);
    } else {
        console.warn("No room ID found in URL.");
    }
});

function addReceipt(bookId) {
    const formData = new FormData();
    formData.append('book-id', bookId);

    fetch(window.location.origin + '/haus-malibu/api/retrieve_booking.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "error") {
            alert("Error: " + data.message);
            return;
        }
        receipt = data.result;
        displayReceipt();
    })
    .catch(err => {
        console.log('Error: ' + err.message);
    });
}

function displayReceipt() {
    const list = document.getElementById("receipt-list");
    list.innerHTML = '';

    list.innerHTML += `
        <li class="booking-item" data-id="${receipt.book_id}">
          <div>
            <strong>Book ID:</strong> ${receipt.book_id}<br>
            <strong>Room:</strong> ${receipt.room_name}<br>
            <strong>Name:</strong> ${receipt.first_name} ${receipt.last_name}<br>
            <strong>Check-in:</strong> ${receipt.check_in}<br>
            <strong>Check-out:</strong> ${receipt.check_out}<br>
            <strong>Booking Time:</strong> ${receipt.date}<br>
          </div>
          <div class="booking-actions">
            <button type="button" class="generate-btn" onclick="generatePDF()">Download Report</button>
            <button type="button" class="generate-btn" onclick="window.location.href='rooms.html'">Exit</button>
          </div>
        </li>`;
};

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const rows = [receipt].map(b => [
        b.book_id, b.first_name, b.last_name, b.check_in, b.check_out, b.date,
    ]);

    doc.text("Haus Malibu Booking Report", 14, 15);
    doc.autoTable({
        startY: 20,
        head: [["Book ID", "First Name", "Last Name", "Check-in", "Check-out", "Time"]],
        body: rows,
        styles: { cellPadding: 3 },
        theme: "grid"
    });

    doc.save("Haus Malibu Receipt.pdf");
};