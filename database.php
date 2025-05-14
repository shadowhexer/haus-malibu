<?php
$servername = "localhost";
$username = "root"; // default is root; change based on your config
$password = ""; // default is none; change based on your config
$db_name = "test";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully<br>";
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$room_exists = $conn->query("SHOW TABLES LIKE 'rooms'")->rowCount();
$booking_exists = $conn->query("SHOW TABLES LIKE 'bookings'")->rowCount();

if ($booking_exists == 0 || $room_exists == 0) {
    try {
        $bookings_table = "CREATE TABLE bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            contact BIGINT,
            address TEXT,
            city VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            special_requests TEXT
        )";

        $rooms_table = "CREATE TABLE rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bed_capacity INT NOT NULL,
            size DECIMAL(10, 2) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            status INT NOT NULL,
        )";
        $conn->exec($bookings_table);
        $conn->exec($rooms_table);
        echo "Table 'credentials' created successfully.";
    } catch(PDOException $e) {
        echo "Error creating table: " . $e->getMessage();
    }
}
?>
