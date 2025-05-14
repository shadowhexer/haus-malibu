<?php
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "test";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully<br>";
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$table_exists = $conn->query("SHOW TABLES LIKE 'credentials'")->rowCount();
if ($table_exists == 0) {
    try {
        $create_table = "CREATE TABLE credentials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            gender VARCHAR(10),
            birthday DATE,
            address TEXT,
            contact BIGINT,
            attachment_path TEXT
        )";
        $conn->exec($create_table);
        echo "Table 'credentials' created successfully.";
    } catch(PDOException $e) {
        echo "Error creating table: " . $e->getMessage();
    }
}
?>
