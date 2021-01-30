<?
session_start();
global $data;
global $basePath;
include_once $basePath."user.class.php";

$User = new User();
if(isset($_SESSION['u_id'])){
  echo json_encode([
      'status'=>'success',
     'data'=>[
         'uId'=>$_SESSION['u_id']
     ]
  ]);
}else{
  echo json_encode([
      'status'=>'fail',
      'data'=>[
          'failText'=> "User id not exists"
      ]
  ]);
}