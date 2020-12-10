<?
include_once "db.class.php";
include_once "utility.class.php";
class CRM{
	private $db;
	public $orders;
	function __construct(){
		$this->db = new Db();
	}
	function checkOrder($phone,$email){
	    $sql = "
	        SELECT `id`
	        FROM `crm_orders`
	        WHERE `phone` = ? OR `email` = ?
	    ";
	    $response = $this->db->prepare($sql,'ss',[$phone,$email])->fetch_assoc();

	    if(isset($response['id'])){
	        return true;
        }
	    return false;

    }
	function createOrder($orderData){
		$orderCheck = $this->checkOrder($orderData->phone,$orderData->email);
		if($orderCheck){
		    return [
		        'status'=>  'fail',
                'failText'=> 'Order Exists'
            ];
        }
	  $orderData->ip_address = $_SERVER['SERVER_ADDR'];
		$orderData->date = date("Y-m-d H:i:s");
		$orderId = $this->db->insert([
            'tableName'=>'crm_orders',
            'insertData'=>$orderData,
            'fieldsToInsert'=> [
                ['s'=>'form_order'],
                ['s'=>'email'],
                ['s'=>'phone'],
                ['s'=>'name'],
                ['s'=>'type'],
                ['s'=>'ip_address'],
                ['s'=>'date']
            ]
		]);
		if(!is_null($orderId)){
		    return [
		        'status'=>'success',
                'data'=>$orderId
            ];
        }
        return [
            'status'=>'fail',
            'failText'=>'Order creating error',
            'data'=>$orderId
        ];
	}
	function getOrders($orderData){
		$perPage = $orderData->perPage;
		$page =  $orderData->page - 1;
		$page = ($perPage * $page);
		$sql= "
				SELECT `id`,`name`,`phone`,`email`,`form_order`,`type`,`ip_address`,`date`
				FROM `crm_orders`
				LIMIT ?,?
		";
		$orders = $this->db->prepare($sql,'ii',[$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($orders)){
				return $orders;
		}
		return [];
	}
	function getItemsCnt(){
        $sql= "
            SELECT COUNT(`id`) as `cnt`
            FROM `crm_orders`
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
            'status'=> 'fail',
						'sql'=>$sql
        ];
	}
	function deleteOrder($orderData){
		if(is_array($orderData)){
			$orderData = (object) $orderData;
		}
		$id = $orderData->id;
		$sql = "
			DELETE FROM `crm_orders` WHERE `id`= ?
		";
		$this->db->prepare($sql,'i',[$id]);
		if($this->db->errno <= 0){
			return [
					'status'=>'success'
			];
		}
		return [
				'status'=>'fail',
				'failText'=>$this->db->errtext
		];
	}
	function search($searchData){
		$perPage = $searchData->perPage;
		$page =  $searchData->page - 1;
		$page = ($perPage * $page);
		$query = $searchData->searchQuery;
		$sql = "
			SELECT `id`,`name`,`phone`,`email`,`form_order`,`type`,`ip_address`,`date`
			FROM `crm_orders`
			WHERE  (`phone` LIKE ? OR `email` LIKE ? OR `name` LIKE ?)
			LIMIT ?,?
		";
		$customers = $this->db->prepare($sql,'sssii',["%{$query}%","%{$query}%","%{$query}%",$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($customers)){
			return $customers;
		}
		return [];
	}
	function getSearchedCnt($searchData){
		$query = $searchData->searchQuery;
		$sql = "
				SELECT COUNT(`id`) as `cnt`
				FROM `crm_orders`
				WHERE  (`phone` LIKE ? OR `email` LIKE ? OR `name` LIKE ?)
			";
		$response = $this->db->prepare($sql,'sss',["%{$query}%","%{$query}%","%{$query}%"])->fetch_assoc();
		if(!empty($response)){
			return [
					'status'=> 'success',
					'data'=> [
							'cnt'=>$response['cnt']
					]
			];
		}
		return 0;
	}
}
	?>