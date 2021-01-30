<?php

class Dater{
	public static $data;
	public static function add($sdata){
		if(!isset(self::$data)){
			self::$data =  [];
		}
		self::$data = array_merge(self::$data,$sdata);
		return self::$data;
	}
	public static function getData(){
		return self::$data;
	}
}