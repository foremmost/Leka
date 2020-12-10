<?
session_start();
global $data;
global $basePath;
include_once $basePath."user.class.php";
$login = $data->login;
$step = $data->step;
$response =['status'=>'fail'
,'data'=> password_hash('qwerty12345',PASSWORD_DEFAULT)];
if($step === 1){
	$User = new User();
	$user=  $User->checkLogin($login);
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
}else{
	$pass =  $data->pass;
	$User = new User();
	$user=  $User->login($login,$pass);
	if($user['status'] === 'success'){
		$uId = $user['data']['id'];
		$groupId = $user['data']['group_id'];
		$page=  'home';
		$response = [
			'status'=>'success',
			'page'=>$page,
			'data'=> $uId
		];
		$_SESSION['u_id'] = $uId;
		$_SESSION['login'] = $login;
		$_SESSION['group_id'] = $groupId;
		$_SESSION['page'] = $page;
	}
}







#echo password_hash('qwerty12345',PASSWORD_DEFAULT);

/*$response =['status'=>'fail'];
if(isset($login) && isset($pass)){
	$user=  $User->login($login,$pass);
	if($user['status'] === 'success'){
		$_SESSION['u_id'] = $user['id'];
		$_SESSION['role'] = $user['group_id'];
	}
//foremost186@gmail.com
if($request == 'get'){
	$step = (int) $_GET['step'];
	$login = $_GET['login'];
	$pass = $_GET['pass'];
}
if($request == 'post'){

}else{
	$rawData = file_get_contents('php://input');
	$data = json_decode($rawData);
}
#print_r($_GET);
}*/
echo json_encode($response);