<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import database.php to continue the connection
require_once 'database.php';
if (!$conn) {
    die("Database connection failed!");
}

try {
    $stmt = $conn->prepare("SELECT r.*, o.status FROM rooms r LEFT JOIN occupied o ON r.id = o.room_id");
    $stmt->execute();
    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["rooms" => $rooms]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
} catch (Throwable $t) {
    http_response_code(500);
    echo json_encode(["error" => "Fatal: " . $t->getMessage()]);
}

$conn = null;

?>