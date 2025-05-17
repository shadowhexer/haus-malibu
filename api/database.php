<?php
$servername = "localhost";
$username = "root"; // default is root; change based on your config
$password = ""; // default is none; change based on your config
$db_name = "test";

// $uri = "mysql://avnadmin:AVNS_uPP0WKcP9xgukoAP8YV@mysql-shadowhexer.b.aivencloud.com:14205/defaultdb?ssl-mode=REQUIRED";

// $fields = parse_url($uri);

// // build the DSN including SSL settings
// $db = "mysql:";
// $db .= "host=" . $fields["host"];
// $db .= ";port=" . $fields["port"];;
// $db .= ";dbname=test";
// $db .= ";sslmode=verify-ca;sslrootcert=ca.pem";


try {
    $conn = new PDO($db, $fields["user"], $fields["pass"]);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully<br>";
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

try {
    $bookings_table = "CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id VARCHAR(36) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        contact BIGINT,
        address TEXT,
        city VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        special_requests TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY (book_id)
    )";

    $conn->exec($bookings_table);
    // echo "Table 'bookings' created or already exists.<br>";
} catch(PDOException $e) {
    echo "Error creating 'bookings': " . $e->getMessage() . "<br>";
}

try {
    $rooms_table = "CREATE TABLE IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        number_of_beds INT NOT NULL,
        bed_capacity INT NOT NULL,
        bed_size DECIMAL(10, 2) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255)
    )";

    $conn->exec($rooms_table);
    // echo "Table 'rooms' created or already exists.<br>";
} catch(PDOException $e) {
    echo "Error creating 'rooms': " . $e->getMessage() . "<br>";
}

try {
    $occupied_table = "CREATE TABLE IF NOT EXISTS occupied (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id VARCHAR(36) NOT NULL,
        room_id INT NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        status INT NOT NULL DEFAULT 0,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES bookings(book_id) ON DELETE CASCADE
    )";
    $conn->exec($occupied_table); 
} catch(PDOException $e) {
    echo "Error creating 'occupied': " . $e->getMessage() . "<br>";
}

try {
    $news_table = "CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image VARCHAR(255),
        image_alt TEXT
    )";
    $conn->exec($news_table); 
} catch(PDOException $e) {
    echo "Error creating 'occupied': " . $e->getMessage() . "<br>";
}

?>