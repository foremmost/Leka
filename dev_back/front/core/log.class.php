<?php
include_once "db.class.php";
class Log{
	private $db;
	function __construct(){
		$this->db = new Db();
	}
	public function saveLog($logData){
		session_start();
		$logData = (object) $logData;
		$type = $logData->type ? $logData->type : 'error';
		$title = $logData->title;
		$desc = $logData->desc;

		$u_id = NULL;
		$ip = NULL;
		if(isset($_SESSION['u_id'])){
			$u_id = $_SESSION['u_id'];
		}else{
			$ip = $_SERVER['SERVER_ADDR'];
		}
		$addDate=  date('Y-m-d H:i:s');
		$sql = "
			INSERT INTO `logs` (`title`,`desc`,`type`,`u_id`,`ip`,`add_date`)
			VALUES (?,?,?,?,?,?)
		";
		$this->db->prepare($sql,'sssiss',[
				$title,$desc,$type,$u_id,$ip,$addDate
		]);
		$id = $this->db->insert_id;
		if(!empty($id)){
			return [
					'status'=>'success',
					'data'=>[
							'id'=>$id
					]
			];
		}
		return [
				'status'=>'fail',
				'failText'=>$this->db->errtext
		];
	}
	public function getLogs($logData){
        $perPage = $logData->perPage;
        $page =  $logData->page - 1;
        $page = ($perPage * $page);
		$sql = "
			SELECT `id`,`title`,`desc`,`type`,`u_id`,`ip`,`add_date` 
			FROM `logs`
			LIMIT ?,?
		";
		$logs = $this->db->prepare($sql,'ii',[$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($logs)){
			return $logs;
		}
		return [];
	}
	public function deleteLog($logData){
		$id = $logData->id;
		if(empty($id) || !isset($id)) return [
				'status'=>'fail',
				'failText'=> 'Not passed id to delete the log'
		];
		$sql = "
			DELETE FROM `logs`
			WHERE `id` = ?
		";
		$this->db->prepare($sql,'i',[$id]);
		if($this->db->errno < 0){
			return [
					'status'=>'success',
					'data'=>[
							'id'=>$id
					]
			];
		}
		return [
				'status'=>'fail',
				'failText'=>$this->db->errtext
		];

	}
	public function clear(){
		$sql = "
			DELETE FROM `logs`
		";
		$this->db->prepare($sql);
		if($this->db->errno > 0) {
			return [
					'status' => 'fail',
					'failText' => $this->db->errtext
			];
		}
	}
	public function filterLogs($logData){
		$perPage = $logData->perPage;
		$page =  $logData->page - 1;
		$page = ($perPage * $page);
		$type = $logData->type;
		$sql = "
			SELECT `id`,`title`,`desc`,`type`,`u_id`,`ip`,`add_date` 
			FROM `logs`
			WHERE `type` = ? 
			LIMIT ?,?
		";
		$logs = $this->db->prepare($sql,'sii',[$type,$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($logs)){
			return $logs;
		}
		return [];
	}
	public function searchLog($logData){
		$perPage = $logData->perPage;
		$page =  $logData->page - 1;
		$page = ($perPage * $page);
		$query = $logData->query;
		$sql = "
			SELECT `id`,`title`,`desc`,`type`,`u_id`,`ip`,`add_date` 
			FROM `logs`
			WHERE `title` LIKE ? OR `desc` LIKE ?
			LIMIT ?,?
		";
		$logs = $this->db->prepare($sql,'ssii',["%{$query}%","%{$query}%",$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($logs)){
			return $logs;
		}
		return [];
	}
	function getLogsCnt(){
	    $sql = "
	        SELECT COUNT(`id`) as `cnt`
	        FROM `logs`
	    ";
	    $response = $this->db->prepare($sql)->fetch_assoc();
	    if(!empty($response)){
	        return [
	            'status'=> 'success',
	            'data'=> [
	                'cnt'=>$response['cnt']
                ]
            ];
        }
        return [
            'status'=> 'fail'
        ];
    }
 function getSearchedCnt($data){
	    $query = $data->query;
	    $sql = "
	        SELECT COUNT(`id`) as `cnt`
			FROM `logs`
			WHERE `title` LIKE ? OR `desc` LIKE ?
			
	    ";
	    $response = $this->db->prepare($sql,'ss',["%{$query}%","%{$query}%"])->fetch_assoc();
	    if(!empty($response)){
	        return [
	            'status'=> 'success',
	            'data'=> [
	                'cnt'=>$response['cnt']
                ]
            ];
        }
        return [
            'status'=> 'fail'
        ];
    }
  function getSelectedCnt($data){
	    $type = $data->type;
	    $sql = "
	        SELECT COUNT(`id`) as `cnt`
			FROM `logs`
			WHERE `type` = ?
			
	    ";
	    $response = $this->db->prepare($sql,'s',[$type])->fetch_assoc();
	    if(!empty($response)){
	        return [
	            'status'=> 'success',
	            'data'=> [
	                'cnt'=>$response['cnt']
                ]
            ];
        }
        return [
            'status'=> 'fail'
        ];
    }

}