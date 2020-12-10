<?php
include_once "db.class.php";

class Goodser{
	private $db;

	function __construct(){
		$this->db = new Db();
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
}