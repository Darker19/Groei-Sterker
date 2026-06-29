<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit;
}

// Honeypot anti-spam veld
if (!empty($_POST["company_website"])) {
    http_response_code(403);
    echo "HONEYPOT GEBLOKKEERD";
    exit;
}

$formStart = (int)($_POST["form_start"] ?? 0);

if ($formStart === 0 || time() - $formStart < 4) {
    http_response_code(400);
    echo "Formulier te snel verzonden.";
    exit;
}

$naam = trim($_POST["naam"] ?? '');
$email = trim($_POST["email"] ?? '');
$telefoon = trim($_POST["telefoon"] ?? '');
$bericht = trim($_POST["bericht"] ?? '');

if ($naam === "" || $email === "" || $bericht === "") {
    http_response_code(400);
    echo "Verplichte velden ontbreken.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Ongeldig e-mailadres.";
    exit;
}

$to = "info@groei-sterker.nl";
$subject = "Nieuw bericht via Groei Sterker";

$message = "
Naam: $naam

E-mail: $email

Telefoon: $telefoon

Bericht:
$bericht
";

$headers = "From: Groei Sterker <info@groei-sterker.nl>\r\n";
$headers .= "Reply-To: $naam <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $message, $headers)) {
    http_response_code(200);
    echo "OK";
} else {
    http_response_code(500);
    echo "Mail kon niet worden verzonden.";
}

exit;