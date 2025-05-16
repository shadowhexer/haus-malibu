<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once __DIR__.'\database.php';
if (!$conn) {
    die("Database connection failed!");
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['book_id']; // Fixed array access syntax

    $stmt = $conn->prepare("SELECT b.book_id, b.first_name, b.last_name, r.name as room_name, b.date, o.status, o.check_in, o.check_out FROM bookings b JOIN occupied o ON b.book_id = o.book_id JOIN rooms r ON o.room_id = r.id WHERE b.book_id = :id"); // Fixed SEARCH to SELECT
    $stmt->bindParam(':id', $id); // Fixed variable name typo

    try {
        if ($stmt->execute()) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
            // Convert to JSON and echo
            header('Content-Type: application/json');
            echo json_encode($result);
        } else {
            $error = $stmt->errorInfo();
            echo "<script>alert('Error retrieving data.');</script>";
        }
    } catch (PDOException $e) {
        echo "<script>alert('Database error: $e'); window.location.href='rooms.html';</script>";
    }
}

$conn = null;

?>