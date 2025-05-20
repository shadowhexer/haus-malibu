<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("Database connection failed!");
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Get JSON data from the request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if ($_SERVER["REQUEST_METHOD"] == "POST" && $data) {
    $id = $data['book_id'];
    $status = $data['status'];

    switch($status) {
        case "Pending":
            $status = 0;
            break;
        case "Accepted":
            $status = 1;
            break;
        case "Declined":
            $status = 2;
            break;
    }

    $stmt = $conn->prepare("UPDATE occupied SET status = :status WHERE book_id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':status', $status);

    try {
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Successfully updated booking status!']);
        } else {
            $error = $stmt->errorInfo();
            echo json_encode(['message' => 'Error updating booking status: ' . implode(', ', $error)]);
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Database Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'Invalid request or missing data']);
}

$conn = null;

?>