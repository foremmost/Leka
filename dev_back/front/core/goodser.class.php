<?php
include_once "db.class.php";
include_once "frontDb.class.php";

class Goodser{
	private $db;
	private static $frontDb;

	function __construct(){
		$this->db = new Db();
		self::$frontDb = new Db();
	}
	function getGoods($goodsData){
		$goodsData = (object)$goodsData;
		$perPage = $goodsData->perPage;
		$page = $goodsData->page - 1;
		$page = ($perPage * $page);
		$sql = "
			SELECT `id`,`title`,`model`,`article`,`manufac`,`c_id`,`price`,`sale`,`avail`,`weight`,`sort`,`description`,`meta_keywords`,`meta_description`,`image`,`images`
			FROM `goods` 
			LIMIT ?,?";
		$goods = $this->db->prepare($sql,'ii',[$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		if(!empty($goods)){
			return $goods;
		}
		return [];
	}
	function getItem($goodsId){
			$sql = "
				SELECT `id`,`title`,`model`,`article`,`manufac`,`c_id`,`price`,`sale`,`avail`,`weight`,`sort`,`description`,`meta_keywords`,`meta_description`,`image`,`images`
				FROM `goods`
					WHERE `id` = ?
				";
			$item = $this->db->prepare($sql,'i',[$goodsId])->fetch_assoc();
			if(!empty($item)){
				return $item;
			}
			return [];
	}
	function getGoodsProps($goodsId){
		if(is_object($goodsId))	$goodsId= $goodsId->id;
		$sql = "
			SELECT `id`,`prop_id`,`prop_value`
			FROM `goods_props`
			WHERE `goods_id` = ?
		";
		$props = $this->db->prepare($sql,'i',[$goodsId])->fetch_all(MYSQLI_ASSOC);
		if(!empty($props)){
			return $props;
		}
		return [];
	}
	function getGoodsFull($goodsData){
		$itemId= $goodsData->id;
		$curentItem = $this->getItem($itemId);
		$curentItem['images'] = unserialize($curentItem['images']);
		$curentItem['props'] = $this->getGoodsProps($itemId);
		if(!empty($curentItem)){
			return $curentItem;
		}
		return [];
	}
	function save($goodsData){
		$goodsData->images = serialize($goodsData->images);
		$goodsId = $this->db->insert([
				'tableName'=>'goods',
				'insertData'=>$goodsData,
				'fieldsToInsert'=> [
						['s'=>'title'],
						['s'=>'article'],
						['s'=>'model'],
						['s'=>'manufac'],
						['s'=>'c_id'],
						['s'=>'price'],
						['s'=>'sale'],
		//				['s'=>'avail'],
						['s'=>'weight'],
						['s'=>'sort'],
						['s'=>'description'],
						['s'=>'image'],
						['s'=>'images'],
						['s'=>'meta_keywords'],
						['s'=>'meta_description'],
				]
		]);
		if(!is_null($goodsId)){
			$props = $this->saveProps($goodsId,$goodsData->props);
			return [
					'status'=>'success',
					'data'=>[
							'goodsId'=>$goodsId,
							'props'=>$props
					]
			];
		}
		return [
				'status'=>'fail',
				'failText'=>'Goods creating error',
				'errorText'=>$this->db->errtext,
				'errorNo'=>$this->db->errno
		];
	}
	function saveProps($goodsId,$props){
		$propsArr = [];
		foreach ($props as $key=>$prop){
			foreach ($prop as $k=>$v){
				$propData =(object) [
						'goods_id' => $goodsId,
						'prop_id' => $k,
						'prop_value' => $v,
				];
				$propId = $this->db->insert([
						'tableName'=>'goods_props',
						'insertData'=>$propData,
						'fieldsToInsert'=> [
								['i'=>'goods_id'],
								['i'=>'prop_id'],
								['s'=>'prop_value'],
						]
				]);
				$propsArr[] = $propId;
			}
		}
		return $propsArr;
	}

	//

	public static function get($goodsId){
		$sql = "
				SELECT `id`,`title`,`model`,`article`,`manufac`,`c_id`,`price`,`sale`,`avail`,`weight`,`sort`,`description`,`meta_keywords`,`meta_description`,`image`,`images`
				FROM `goods`
					WHERE `id` = ?
				";
		$item = frontDb::prepare($sql,'i',[$goodsId])->fetch_assoc();
		if(!empty($item)){
			return $item;
		}
		return [];
	}
	public static function getProps($goodsId){
		$sql = "
			SELECT `id`,`prop_id`,`prop_value`
			FROM `goods_props`
			WHERE `goods_id` = ?
		";
		$props = frontDb::prepare($sql,'i',[$goodsId])->fetch_all(MYSQLI_ASSOC);
		if(!empty($props)){
			return $props;
		}
		return [];
	}
	public static function getFull($goodsId){
		$itemId= $goodsId;
		$curentItem = self::get($itemId);
		$curentItem['images'] = unserialize($curentItem['images']);
		$curentItem['props'] = self::getProps($itemId);
		if(!empty($curentItem)){
			return $curentItem;
		}
		return [];
	}
}