<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once __DIR__.'\database.php';
if (!$conn) {
    die("Database connection failed!");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Kuhaa ang tanan input values
    $room_id = $_POST["room-id"];
    $firstname = $_POST["first_name"];
    $lastname = $_POST["last_name"];
    $email = $_POST["email"];
    $contact = $_POST["phone"];
    $address = $_POST["address"];
    $city = $_POST["city"];
    $country = $_POST["country"];
    $checkIn = $_POST["check-in"];
    $checkOut = $_POST["check-out"];
    $special_requests = $_POST["special_requests"];

    $id = bin2hex(random_bytes(10 / 2));

    $stmt = $conn->prepare("INSERT INTO `bookings` (`book_id`, `first_name`, `last_name`, `email`, `contact`, `address`, `city`, `country`, `special_requests`) 
                            VALUES (:id, :firstname, :lastname, :email, :contact, :address, :city, :country, :special_requests);");

    $update_occupied = $conn->prepare("INSERT INTO `occupied` (`book_id`, `room_id`, `check_in`, `check_out`) VALUES (:book_id, :room_id, :check_in, :check_out);");

    $stmt->bindParam(':id', $id, PDO::PARAM_STR);
    $stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
    $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':contact', $contact, PDO::PARAM_INT);
    $stmt->bindParam(':address', $address, PDO::PARAM_STR);
    $stmt->bindParam(':city', $city, PDO::PARAM_STR);
    $stmt->bindParam(':country', $country, PDO::PARAM_STR);
    $stmt->bindParam(':special_requests', $special_requests, PDO::PARAM_STR);

    $update_occupied->bindParam(':book_id', $id, PDO::PARAM_STR);
    $update_occupied->bindParam(':room_id', $room_id, PDO::PARAM_INT);
    $check_in_date = date('Y-m-d', strtotime($checkIn));
    $check_out_date = date('Y-m-d', strtotime($checkOut));
    $update_occupied->bindParam(':check_in', $check_in_date, PDO::PARAM_STR);
    $update_occupied->bindParam(':check_out', $check_out_date, PDO::PARAM_STR);

    try {
        if ($stmt->execute() && $update_occupied->execute()) {
            echo "<script>alert('Booking submitted!'); window.location.href='../rooms.html';</script>";
        } else {
            $error = $stmt->errorInfo();
            echo "<script>alert('Error submiting booking.');</script>";
        }
    } catch (PDOException $e) {
        echo "<script>alert('Database error: " . addslashes($e->getMessage()) . "'); window.location.href='rooms.html';</script>";
    }
}

$conn = null;
?>
