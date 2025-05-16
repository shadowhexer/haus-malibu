let booking = [], news = [];

function addBooking(event) {
    const form = document.getElementById('book_form');
    const formData = new FormData(form);

    fetch(window.location.origin + '/haus-malibu/api/retrieve_booking.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 0) data.status = 'Pending';
            else if (data.status === 1) data.status = 'Accepted';
            else if (data.status === 2) data.status = 'Declined';
            booking = data
            displayBookings();
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        })
        .finally(() => {
            document.getElementById("book_id").value = '';
            // document.getElementById("check-in").value = '';
            // document.getElementById("check-out").value = '';
        });
}

function displayBookings() {
    const list = document.getElementById("bookingList");
    list.innerHTML = '';

    let color = booking.status === "Accepted" ? "green" :
        booking.status === "Declined" ? "red" : "orange";
    list.innerHTML += `
        <li class="booking-item" data-id="${booking.book_id}">
          <div>
            <strong>Book ID:</strong> ${booking.book_id}<br>
            <strong>Room:</strong> ${booking.room_name}<br>
            <strong>Name:</strong> ${booking.first_name} ${booking.last_name}<br>
            <strong>Check-in:</strong> ${booking.check_in}<br>
            <strong>Check-out:</strong> ${booking.check_out}<br>
            <strong>Booking Time:</strong> ${booking.date}<br>
            <strong>Status:</strong> <span id="status-${booking.status}" style="color: ${color}; font-weight: bold;">${booking.status}</span>
          </div>
          ${booking.status === "Pending" ? `
          <div class="booking-actions">
            <button class="accept-btn" onclick="modifyBooking('${booking.book_id}', '1')">Accept</button>
            <button class="decline-btn" onclick="modifyBooking('${booking.book_id}', '2')">Decline</button>
          </div>
          ` : ''}
        </li>`;
};


function modifyBooking(id, bookStatus) {

    fetch(window.location.origin + '/haus-malibu/api/modify_booking.php', {
        method: 'POST',
        body: JSON.stringify({ book_id: id, status: bookStatus }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = 'admin.html'
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        })
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const rows = [booking].map(b => [
        b.book_id, b.first_name, b.last_name, b.checkIn, b.checkOut, b.date,
        {
            content: b.status,
            styles: {
                fontStyle: 'bold',
                textColor: b.status === "Accepted" ? [40, 167, 69] :
                    b.status === "Declined" ? [220, 53, 69] : [255, 193, 7]
            }
        }
    ]);

    doc.text("Haus Malibu Booking Report", 14, 15);
    doc.autoTable({
        startY: 20,
        head: [["Book ID", "First Name", "Last Name", "Check-in", "Check-out", "Time", "Status"]],
        body: rows,
        styles: { cellPadding: 3 },
        theme: "grid"
    });

    doc.save("Haus Malibu Bookings.pdf");
}

function addRoom(event) {
    const form = document.getElementById('room-form');
    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    fetch(window.location.origin + '/haus-malibu/api/add_rooms.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.message);
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.log(err.message);
    })
    .finally(() => {
        document.getElementById("room-name").value = '';
        document.getElementById("room-type").value = '';
        document.getElementById("beds").value = '';
        document.getElementById("capacity").value = '';
        document.getElementById("bed-size").value = '';
        document.getElementById("price").value = '';
        document.getElementById("desc").value = '';
    });

    //   if (name && desc && image) {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       rooms.push({ id: Date.now(), name, desc, image: reader.result });
    //       displayRooms();
    //     };
    //     reader.readAsDataURL(image);
    //   }
}

function addNews() {
    const title = document.getElementById("news-title").value;
    const content = document.getElementById("news-content").value;
    const image = document.getElementById("news-image").files[0];

    if (title && content && image) {
        const reader = new FileReader();
        reader.onload = () => {
            news.push({ id: Date.now(), title, content, image: reader.result });
            displayNews();
        };
        reader.readAsDataURL(image);
    }
}

function displayNews() {
    const list = document.getElementById("newsList");
    list.innerHTML = '';
    news.forEach(n => {
        list.innerHTML += `
        <li class="news-item">
          <div>
            <strong>${n.title}</strong><br>
            ${n.content}<br>
            <img src="${n.image}" alt="News image">
          </div>
          <div class="news-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </li>`;
    });
}