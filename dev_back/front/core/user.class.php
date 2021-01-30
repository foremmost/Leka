<?
include_once "db.class.php";
include_once "utility.class.php";
include_once "ticket.class.php";
class User {
	private $db;
	public $users;
	public $table_name;
	function __construct(){
		$this->db = new Db();
	}
	function userExists($login){
		$sql = "
			SELECT id FROM 
			`users`
			WHERE `login` = ? 
		";
		$id = $this->db->prepare($sql,'s',[$login]);
		if($id->num_rows > 0){
				return true;
		}
		return false;
	}
	function checkLogin($login){
		$sql  = "
			SELECT `id`
			FROM `users`
			WHERE `login` = ?";
		$user = $this->db->prepare($sql,'s',[
				$this->db->filter($login,'s')
		])->fetch_assoc();
		if(!empty($user)){
			return [
					'status'=> 'success',
					'data' => ['id'=>$user['id']]
			];
		}else{
			return [
					'status'=> 'fail'
			];
		}
	}
	function giveTicket($uId){
		$Ticket = new Ticket();
		return $Ticket->create($uId);
	}

	function login($login,$pass){
		$sql  = "
			SELECT `id`,`group_id`,`login`,`password`
			FROM `users`
			WHERE `login` = ?";
		$user = $this->db->prepare($sql,'s',[
				$this->db->filter($login,'s')
		])->fetch_assoc();
		if(!empty($user)){
			$hashUserPassword = $user['password'];
			if( !(password_verify($pass,$hashUserPassword)) ){
				return false;
			}
			$token = $this->giveTicket($user['id']);
			return
				[
				'status'=> 'success',
				'data'=>
						[
							'id'=> $user['id'],
							'group_id'=> $user['group_id'],
							'token'=> $token
						]
			];
		}else{
			return [
					'status'=> 'fail'
			];
		}
	}
	function getName($userData){
    session_start();
	  $uId = $userData->uId;
	  if(empty($uId)){
	    $uId = $_SESSION['u_id'];
    }
		$sql = "
			SELECT `name`,`second_name`
			FROM `users_meta`
			WHERE `u_id` = ?
		";
		$user = $this->db->prepare($sql,'i',[$uId])->fetch_assoc();
		if($this->db->errno > 0){
			return [
					'status'=>'fail',
					'failText'=> "Get Name error"
			];
		}
		if(!empty($user)){
			return [
					'status'=>'success',
					'data'=> $user
			];
		}else{
      return [
          'status'=>'fail',
          'failText'=> "User not found"
      ];
    }
	}


}