<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit;
}


if (!empty($_POST["company_website"])) {
    http_response_code(403);
    echo "HONEYPOT GEBLOKKEERD";
    exit;
}

$formStart = (int)($_POST["form_start"] ?? 0);

if ($formStart === 0 || time() - $formStart < 4) {
    exit;
}

$naam = htmlspecialchars($_POST["naam"] ?? '');
$email = htmlspecialchars($_POST["email"] ?? '');
$telefoon = htmlspecialchars($_POST["telefoon"] ?? '');
$bericht = htmlspecialchars($_POST["bericht"] ?? '');

$to = "info@groei-sterker.nl";

$subject = "Nieuw bericht via Groei Sterker";

$message = "
Naam: $naam

E-mail: $email

Telefoon: $telefoon

Bericht:
$bericht
";

$headers = "From: info@groei-sterker.nl\r\n";
$headers .= "Reply-To: $email\r\n";

mail($to, $subject, $message, $headers);

http_response_code(200);
echo "OK";
exit;

