<?
session_start();
global $data;
global $basePath;
include_once $basePath . "user.class.php";
// +++++++++++++++++++
$login = $data->login;
$pass =  $data->pass;
// +++++++++++++++++++
$User = new User();
$response=  $User->login($login,$pass);
// +++++++++++++++++++

if($response['status'] === 'success') {
	$uId = $response['data']['id'];
	$groupId = $response['data']['group_id'];
	$token = $response['data']['token'];

	$_SESSION['u_id'] = $uId;
	$_SESSION['login'] = $login;
	$_SESSION['token'] = $token;
	$_SESSION['group_id'] = $groupId;
	echo json_encode([
			'status'=>'success',
			'data'=> $uId
	]);
}


