<?php
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    exit("Only GET requests are allowed.");
}
$R = isset($_GET['R']) ? floatval($_GET['R']) : null;
$x = isset($_GET['x']) ? floatval($_GET['x']) : null;
$y = isset($_GET['y']) ? floatval($_GET['y']) : null;
date_default_timezone_set('Europe/Moscow');
function isPointInArea($x, $y, $R): bool
{
    $quarterCircle = ($x <= 0 && $x <= $R / 2 && $y >= 0 && $y <= sqrt($R * $R / 4 - $x * $x));
    $rectangle = ($x <= 0 && $x <= $R && $y >= -$R / 2 && $y <= 0);
    $triangle = ($x >= 0 && $x <= $R / 2 && $y >= -$R / 2 && $y >= 0 && $y <= ($R / 2) - $x);
    return $quarterCircle || $rectangle || $triangle;
}
$results = [];

if (is_numeric($R) && is_numeric($x) && is_numeric($y) && $R >= 2 && $R <= 5 && $y >= -3 && $y <= 5) {
    $start_time = microtime(true);
    $isInArea = isPointInArea($x, $y, $R);
    $end_time = microtime(true);
    $execution_time = $end_time - $start_time; // время выполнения

    $result = [
        'R' => $R,
        'x' => $x,
        'y' => $y,
        'result' => $isInArea ? 'Попадание' : 'Непопадание',
        'timestamp' => date('Y-m-d H:i:s'),
    ];
    if ($execution_time > 0) {
        $result['script_runtime'] = sprintf('%.7f', $execution_time) . ' секунд';
    }else{$result['script_runtime'] = sprintf('zero');}

    $results[] = $result;
}

header('Content-Type: application/json');
echo json_encode($results);
