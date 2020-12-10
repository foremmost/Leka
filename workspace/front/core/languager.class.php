<?php
include_once "db.class.php";
class Languager{
	private $db;
	function __construct(){
		$this->db = new Db();
	}
	function checkSuper(){
		session_start();
		$groupId = $_SESSION['group_id'];
		$hasDefault = "
			WHERE `type` <> 'sys'
		";
		if ($groupId == 1) {
			$hasDefault = "";
		}
		return $hasDefault;
	}
	function getLangs()
	{
		$sql = "
			SELECT `id`,`lang`,`value` 
			FROM `languages`
		";
		$langs = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		if (!empty($langs)) {
			return $langs;
		}
		return [];
	}
	function getDefaultTranslate($wordName){
		$sql = "
			SELECT `id`,`value` as `translate`,`type`
			FROM `words`
			WHERE `value` = ?
		";
		$word = $this->db->prepare($sql, 's', [$wordName])->fetch_assoc();
		if (!empty($word)) {
			return $word;
		}
		return '';
	}
	function getLangTranslate($wordName, $langId){
		$sql = "
				SELECT `w`.id,`w`.value as `default`,`w`.`translate`,`w`.`type`
				FROM (
					SELECT `words`.id,`translate`,`words`.value,`type`
					FROM `words`
					LEFT OUTER JOIN `translates` ON `translates`.word_id = `words`.id
					WHERE ( `words`.value = ? AND `translates`.lang_id = ?)
					
					UNION ALL 
					SELECT `words`.id,NULL,`words`.value,`type`
					FROM `words`
					WHERE `words`.value = ?
				) as `w` 
		";
		$word = $this->db->prepare($sql, 'sis', [$wordName, $langId, $wordName])->fetch_assoc();
		if (!empty($word)) {
			return $word;
		}
		return '';
	}
	function getLangId($lang){
		$sql = "
			SELECT `id`
			FROM `languages`
			WHERE `lang` = ? ";
		$langId = $this->db->prepare($sql, 's', [$lang])->fetch_assoc();
		if (!empty($langId)) {
			return $langId['id'];
		}
		return 0;
	}
	function getTranslate($wordData)
	{
		$wordData = (object)$wordData;
		$wordId = strtolower($wordData->wordId);
		$langId = $this->getLangId($wordData->lang);
		if ($langId == 1) {
			return $this->getDefaultTranslate($wordId);
		} else {
			return $this->getLangTranslate($wordId, $langId);
		}
	}
	function getTranslates($wordData){
		$wordData = (object)$wordData;
		$words = $wordData->words;
		$langId = $this->getLangId($wordData->lang);
		$translatedWords = [];
		if ($langId == 1) {
			$method = 'getDefaultTranslate';
			if (property_exists($wordData, 'type')) {
				$method = 'getDefaultTranslateFromId';
			}
			foreach ($words as $word) {
				$translatedWords[] = $this->$method($word);;
			}
			return $translatedWords;
		} else {
			$method = 'getLangTranslate';
			if (property_exists($wordData, 'type')) {
				$method = 'getLangTranslateFromId';
			}
			foreach ($words as $word) {
				$rawWord = $this->$method($word, $langId);
				if (!empty($rawWord))
					$translatedWords[] = $rawWord;
			}
		}
		return $translatedWords;
	}
	function getItemsCnt($wordData)
	{
		$wordData = (object)$wordData;
		$hasDefault = $this->checkSuper();
		$sql = "
			SELECT COUNT(id) as `cnt`
			FROM `words`
			{$hasDefault}
		";
		$words = $this->db->prepare($sql)->fetch_assoc();

		if (!empty($words)) {
			return (int)$words['cnt'];
		}
		return 0;
	}
	function getLangWords($wordData){
		$hasDefault = $this->checkSuper();
		$wordData = (object)$wordData;
		$langId = $this->getLangId($wordData->lang);

		$perPage = $wordData->perPage;
		$page = $wordData->page - 1;
		$page = ($perPage * $page);
		$sql = "
			SELECT `w`.id,`w`.value,`w`.`translate`,`w`.`type`
			FROM (
				SELECT `words`.id,`translate`,`words`.value,`type`
				FROM `words`
				LEFT OUTER JOIN `translates` ON `translates`.word_id = `words`.id
				WHERE (`translates`.lang_id = ?)
				
				UNION ALL 
				SELECT `words`.id,NULL,`words`.value,`type`
				FROM `words`
			) as `w` 
			{$hasDefault}
			
			GROUP BY `id`
			ORDER BY `w`.value
			LIMIT ?,?
		";
		$words = $this->db->prepare($sql, 'iii', [$langId, $page, $perPage])->fetch_all(MYSQLI_ASSOC);
		if (!empty($words)) {
			return $words;
		}
		return [];
	}
	function getDefaultSearchedCnt($word)
	{
		$sql = "
			SELECT COUNT(`words`.id) as cnt
			FROM `words`
			WHERE `words`.value LIKE ?
		";
		$words = $this->db->prepare($sql, 's', ["%{$word}%"])->fetch_assoc();
		if (!empty($words)) {
			return $words['cnt'];
		}
		return 0;
	}
	function getSearchedCnt($wordData)
	{
		$wordData = (object)$wordData;
		$word = $wordData->word;
		$langId = $this->getLangId($wordData->lang);
		if ($langId == 1) {
			return $this->getDefaultSearchedCnt($word);
		}
		$sql = "
			SELECT COUNT(`words`.id) as cnt
			FROM `words`
			LEFT OUTER JOIN `translates` ON `translates`.word_id = `words`.id
			WHERE (`translates`.lang_id = ? OR `translate` IS NULL ) AND (`words`.value LIKE ? OR `translate` LIKE ? )
		";
		$words = $this->db->prepare($sql, 'iss', [$langId, "%{$word}%", "%{$word}%"])->fetch_assoc();
		if (!empty($words)) {
			return $words['cnt'];
		}
		return 0;
	}
	function getDefaultWords($wordData){
		$hasDefault = $this->checkSuper();
		$wordData = (object)$wordData;
		$perPage = $wordData->perPage;
		$page = $wordData->page - 1;
		$page = ($perPage * $page);

		$sql = "
			SELECT `id`,`lang_id`,`value`,`type`
			FROM `words`
			{$hasDefault}
			LIMIT ?,?
		";
		$words = $this->db->prepare($sql, 'ii', [$page, $perPage])->fetch_all(MYSQLI_ASSOC);
		if (!empty($words)) {
			return $words;
		}
		return [];
	}
	function getTranslateToFront($word, $lang = 'en')
	{
		$langId = $this->getLangId($lang);
		if ($langId == 1) {
			$outWord = $this->getDefaultTranslate($word);;
			if (empty($outWord['translate'])) return $word;
			return $outWord['translate'];
		} else {
			$outWord = $this->getLangTranslate($word, $langId);
			if (empty($outWord)) return $word;
			if (empty($outWord['translate'])) return $outWord['default'];
			return $outWord['translate'];
		}
	}
	function getDefaultTranslateFromId($wordId){
		$sql = "
			SELECT `id`,`value` as `translate`,`type`
			FROM `words`
			WHERE `id` = ?
		";
		$word = $this->db->prepare($sql, 'i', [$wordId])->fetch_assoc();
		if (!empty($word)) {
			return $word;
		}
		return '';
	}
	function getLangTranslateFromId($wordId, $langId){
		$sql = "
				SELECT `w`.id,`w`.value as `default`,`w`.`translate`,`w`.`type`
				FROM (
					SELECT `words`.id,`translate`,`words`.value,`type`
					FROM `words`
					LEFT OUTER JOIN `translates` ON `translates`.word_id = `words`.id
					WHERE ( `words`.id = ? AND `translates`.lang_id = ?)
					
					UNION ALL 
					SELECT `words`.id,NULL,`words`.value,`type`
					FROM `words`
					WHERE `words`.id = ?
				) as `w` 
		";
		$word = $this->db->prepare($sql, 'iii', [$wordId, $langId, $wordId])->fetch_assoc();
		if (!empty($word)) {
			return $word;
		}
		return '';
	}
	function getTranslateToFrontFromId($wordId, $lang = 'en'){
		$langId = $this->getLangId($lang);
		if ($langId == 1) {
			$outWord = $this->getDefaultTranslateFromId($wordId);
			echo $outWord;
			return $outWord['translate'];
		} else {
			$outWord = $this->getLangTranslateFromId($wordId, $langId);
			if (empty($outWord)) return $this->getDefaultTranslateFromId($wordId);
			if (empty($outWord['translate'])) return $outWord['default'];
			return $outWord['translate'];
		}
	}
	function hasTranslateWord($lang_id, $wordId)
	{
		$sql = "
			SELECT `id`
			FROM  `translates`
			WHERE  `lang_id`= ? AND `word_id` = ?
		";
		$word = $this->db->prepare($sql, 'is', [$lang_id, $wordId])->fetch_assoc();
		if (!empty($word)) {
			return true;
		}
		return false;
	}
	function searchWord($wordData)
	{
		$wordData = (object)$wordData;
		$hasDefault = $this->checkSuper();
		$word = $wordData->word;
		$langId = $this->getLangId($wordData->lang);
		$perPage = $wordData->perPage;
		$page = $wordData->page - 1;
		$page = ($perPage * $page);
		$sql = "
			SELECT `id`,`translate`,`value`,`type`
			FROM (
			SELECT `translates`.word_id as `id`,`translate`,`words`.value,`type`
				FROM `words`
				LEFT OUTER JOIN `translates` ON `translates`.word_id = `words`.id
				WHERE (`translates`.lang_id = ? ) AND (`words`.value LIKE ? OR `translate` LIKE ? )
				
				UNION ALL 
				SELECT `words`.id,NULL,`words`.value,`type`
				FROM `words`
				WHERE (`words`.value LIKE ?)
			) as `s`
			{$hasDefault}
			GROUP BY `value`
			ORDER BY `value`
				LIMIT ?,?		
		";
		$words = $this->db->prepare($sql, 'isssii', [$langId, "%{$word}%", "%{$word}%", "%{$word}%", $page, $perPage])->fetch_all(MYSQLI_ASSOC);
		if (!empty($words)) {
			return $words;
		}
		return [];
	}
	function searchDefaultWord($wordData)
	{
		$wordData = (object)$wordData;
		$word = $wordData->word;
		$perPage = $wordData->perPage;
		$page = $wordData->page - 1;
		$page = ($perPage * $page);
		$sql = "
		SELECT `id`,`value`,`type`
			FROM `words`
			WHERE (`words`.value LIKE ?  )
			LIMIT ?,?";
		$words = $this->db->prepare($sql, 'sii', ["%{$word}%", $page, $perPage])->fetch_all(MYSQLI_ASSOC);
		if (!empty($words)) {
			return $words;
		}
		return [];
	}
	function saveDefaultWord($wordData)
	{
		$wordData = (object)$wordData;
		$lang_id = 1;
		$value = $wordData->value;
		$type = $wordData->type;
		$sql = "
			INSERT INTO `words` (`lang_id`,`value`,`type`)
			VALUES (?,?,?)
		";
		$this->db->prepare($sql, 'iss', [$lang_id, $value, $type]);
		$id = $this->db->insert_id;
		if (!empty($id)) {
			return [
					'status' => 'success',
					'data' => [
							'id' => $id
					]
			];
		}
		return [
				'status' => 'fail'
		];
	}
	function saveTranslateWord($wordData)
	{
		$wordData = (object)$wordData;
		$lang_id = $this->getLangId($wordData->lang);
		$value = $wordData->translate;
		$wordId = $wordData->wordId;
		if ($this->hasTranslateWord($lang_id, $wordId)) {
			$sql = "
				UPDATE `translates` SET `lang_id`=?,`translate`=?,`word_id`=?
				WHERE `word_id`= ? AND `lang_id` = ?
			";
			$response = $this->db->prepare($sql, 'issii', [$lang_id, $value, $wordId, $wordId, $lang_id]);
			$id = $wordId;
		} else {
			$sql = "
				INSERT INTO `translates` (`lang_id`,`translate`,`word_id`)
				VALUES (?,?,?)
			";
			$response = $this->db->prepare($sql, 'iss', [$lang_id, $value, $wordId]);
		}

		if (!isset($id))
			$id = $this->db->insert_id;
		if (!empty($id) || ($response)) {
			return [
					'status' => 'success',
					'data' => [
							'id' => $id
					]
			];
		}
		return [
				'status' => 'fail'
		];
	}
	function editDefaultWord($wordData)
	{
		$wordData = (object)$wordData;
		$wordId = $wordData->wordId;
		$value = $wordData->value;
		$type = $wordData->type;
		$sql = "
			UPDATE `words`
			SET `value`=?, `type` = ? 
			WHERE id = ?
		";
		$this->db->prepare($sql, 'ssi', [$value, $type, $wordId]);
		if (!empty($wordId)) {
			return [
					'status' => 'success',
					'data' => [
							'id' => $wordId
					]
			];
		}
		return [
				'status' => 'fail'
		];
	}
	function getWordTypes(){
		return [
				'status' => 'success',
				'types' => [
						[
								'value'=>'sys',
								'text' => 'System'
						],
						[
								'value'=>'site',
								'text' => 'Site'
						],
				]
		];
	}
}