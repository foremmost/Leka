<?

$rawData = file_get_contents('php://input');
$data = json_encode($rawData);

echo json_encode([
		'response'=>true
]);
