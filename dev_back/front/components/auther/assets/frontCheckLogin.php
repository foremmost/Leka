<?
session_start();
global $data;
global $basePath;
include_once $basePath."user.class.php";
$login = $data->login;

$User = new User();
$user=  $User->checkLogin($login);
if($user['status'] == 'fail'){
	echo json_encode([
			'status'=>'success',
			'data'=>[
					'u_id'=>null
			]
	]);
	die();
}
$uId = $user['data']['id'];
if($user['status'] === 'success'){
		$_SESSION['u_id'] = $uId;
		$_SESSION['login'] = $login;
		$response = [
				'status'=>'success',
				'data'=>[
						'u_id'=>$uId,
						'login'=>$login
				]
		];
}

echo json_encode($response);