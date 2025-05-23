function addBooking() {
    const form = document.getElementById('guest-form');
    const formData = new FormData(form);

    fetch('/api/submit_booking', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
           if (data.status === "success") {
                alert(data.message);
                window.location.href = `receipt.html?booking_id=${data.book_id}`;
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        });
}