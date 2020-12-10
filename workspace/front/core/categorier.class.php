<?php
include_once "db.class.php";

class Categorier{
    private $db;
    function __construct(){
        $this->db = new Db();
    }

    function getAllCategories(){
        $sql = "SELECT `id`,`title`,`parent` FROM `categories`";
        $categories = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
        return (!empty($categories)) ? $categories : [];
    }
		function hasChildes($catId){
    	$sql = "
    	  SELECT `id`
    	  FROM `categories`
    	  WHERE `parent` = ?
    	";
			$categories =  $this->db->prepare($sql, 'i', [$catId])->fetch_all(MYSQLI_ASSOC);
			return (!empty($categories)) ? true : false;
		}

    function getParentCategories($data){
	    $perPage = $data->perPage;
	    $page = $data->currentPage - 1;
	    $page = ($perPage * $page);
	    $sql = "
				SELECT `id`,`title`,`parent` FROM `categories`
				WHERE `parent` = 0
				LIMIT ?,?
			";
	    $outCats = [];
	    $categories =  $this->db->prepare($sql, 'ii', [$page, $perPage])->fetch_all(MYSQLI_ASSOC);
	    foreach ($categories as $cat){
	    	$outCat = $cat;
		    $outCat['hasChild'] = $this->hasChildes($cat['id']);
	    	$outCats[] = $outCat;
	    }
	    return (!empty($outCats)) ? $outCats : [];
    }
    function getCatChildes($data){
    	$parentId= $data->parentId;
    	$sql = "
	      SELECT `id`,`title`
	      FROM `categories`
	      WHERE `parent` = ?
    	";
	    $outCats = [];
	    $categories =  $this->db->prepare($sql, 'i', [$parentId])->fetch_all(MYSQLI_ASSOC);
	    foreach ($categories as $cat){
		    $outCat = $cat;
		    $outCat['hasChild'] = $this->hasChildes($cat['id']);
		    $outCats[] = $outCat;
	    }
	    return (!empty($outCats)) ? $outCats : [];
    }
		function getParentsCnt(){
			$sql = "SELECT count(id) as 'count' FROM `categories` WHERE parent = 0";
			$lineCounts = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
			return $lineCounts[0]['count'];
		}
    function getCategories($data){
        $perPage = $data->perPage;
        $page =  $data->currentPage - 1;
        $page = ($perPage * $page);

        $sql = "
            SELECT `id`,`title`,`parent` FROM `categories` WHERE parent = 0 
            UNION ALL
            SELECT `id`, `title`, `parent` FROM `categories` WHERE parent <> 0
            ORDER BY `title` ASC
            LIMIT ?,?
        ";
        $categories = $this->db->prepare($sql, 'ii', [$page, $perPage])->fetch_all(MYSQLI_ASSOC);

        return (!empty($categories)) ? $categories : [];
    }
    function searchCatg($data){
        $perPage = $data->perPage;
        $page =  $data->page - 1;
        $page = ($perPage * $page);
        $query = $data->searchQuery;

        $sql = "
			(SELECT `id`, `title`, `parent`
			FROM `categories`
			WHERE `title` LIKE ?
			AND `parent` = 0
			LIMIT ?,?)
			UNION
			(SELECT `id`, `title`, `parent` 
			FROM `categories`  
			WHERE `title` LIKE ?
			AND `parent` != 0)
			ORDER BY `title` ASC
		";

        $categories = $this->db->prepare($sql,'siis',["%{$query}%",$page,$perPage,"%{$query}%"])->fetch_all(MYSQLI_ASSOC);

        $childes_parent_id = []; // Массив для значений поля parent у найденных поиском элементов
        $categoriesAddict = []; // Массив для сохранения выборки род. найденных поиском элементов

        foreach ($categories as $category)
            if ($category['parent'])
                array_push($childes_parent_id, $category['parent']);

        $childes_parent_id = array_unique($childes_parent_id);
        $categoriesAddict = $this->recursiveSearchChild($childes_parent_id);
        $categories = array_merge($categories, $categoriesAddict);
        $categories = array_unique($categories, SORT_REGULAR);

        $out = [];
        foreach($categories as $index=>$arr)
            $out[] = $arr;

        return (!empty($out)) ? $out : [] ;
    }

    private function recursiveSearchChild($childes_parent_id){
        if(empty($childes_parent_id)) return [];

        $sql = "SELECT `id`, `title`, `parent` FROM `categories` WHERE `id` IN (";
        $sql_params = ''; $cpi = [];

        foreach ($childes_parent_id as $child_parent_id) {
            $sql .= $child_parent_id . ',';
            $sql_params .= 'i';
        }
        $sql = mb_substr($sql, 0, -1) . ");";
        $select = $this->db->prepare($sql,$sql_params)->fetch_all(MYSQLI_ASSOC);

        foreach ($select as $category)
            if ($category['parent']) array_push($cpi, $category['parent']);

        $select = array_merge($select, $this->recursiveSearchChild($cpi));
        return $select;
    }

	function getCatProperties($catId){
		$sql = "
    	  SELECT `id`,`name`,`p_desc`,`p_type`,`sort`
    	  FROM `category_properties`
    	  WHERE `c_id` = ?
				ORDER BY `sort`
    	";
		$props = $this->db->prepare($sql,'i',[$catId])->fetch_all(MYSQLI_ASSOC);
		return (!empty($props)) ? $props : [];
	}
	function getPropsList(){
		$sql = "
    	  SELECT `id`,`title`,`sort`
    	  FROM `props_list`

				ORDER BY `sort`
    	";
		$props = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		return (!empty($props)) ? $props : [];
	}
	function searchPropList($queryData){
		$query = $queryData->searchQuery;
		$perPage = $queryData->perPage;
		$page =  $queryData->page - 1;
		$page = ($perPage * $page);
		$sql = "
    	  SELECT `id`,`title`,`sort`
    	  FROM `props_list`
				WHERE `title` LIKE ?
				ORDER BY `sort`
				LIMIT ?,?
    	";
		$props = $this->db->prepare($sql,'sii',["%{$query}%",$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		return (!empty($props)) ? $props : [];
	}
	function getCat($data){
		$catId = $data->catId;
		#print_r($data);
		$sql = "
				SELECT `id`,`title`,`c_desc`,`image`,`sort`,`parent`,`mkeys`,`mdesc`
				FROM `categories`
				WHERE `id` = ?
			";
		$outCats = [];
		$categories = $this->db->prepare($sql,'i',[$catId])->fetch_all(MYSQLI_ASSOC);
		foreach ($categories as $category){
			$outCat = $category;
			$outCat['props'] = $this->getCatProperties($category['id']);
			$outCats[] = $outCat;
		}
		return (!empty($outCats)) ? $outCats : [];
	}
	function search($queryData){
		$query = $queryData->searchQuery;
		$perPage = $queryData->perPage;
		$page =  $queryData->page - 1;
		$page = ($perPage * $page);
		$sql = "
			SELECT `id`,`title`,`c_desc`,`image`,`sort`,`parent`,`mkeys`,`mdesc`
			FROM `categories`
			WHERE `title` LIKE ?
			LIMIT ?,?
		";
		$categories = $this->db->prepare($sql,'sii',["%{$query}%",$page,$perPage])->fetch_all(MYSQLI_ASSOC);
		return (!empty($categories)) ? $categories : [];
	}
	function saveCatProps($id,$prop){
		$propIds = [];
		$iProp =  $prop;
		$iProp->c_id = $id;
		$propId= $this->db->insert([
			'tableName' => 'category_properties',
			'insertData' => $iProp,
			'fieldsToInsert' => [
				['i' => 'c_id'],
				['s' => 'name'],
				['s' => 'p_desc'],
				['s' => 'p_type'],
				['i' => 'sort']
			]
		]);
		return $propId;
	}
	function saveCat($catData){
		if(!property_exists($catData,'parent')){
			$catData->parent = 0;
		}
		$catId = $this->db->insert([
			'tableName' => 'categories',
			'insertData' => $catData,
			'fieldsToInsert' => [
				['s' => 'title'],
				['s' => 'image'],
				['i' => 'parent'],
				['s' => 'c_desc'],
				['s' => 'mdesc'],
				['s' => 'mkeys']
			]
		]);
		$listPropIdsArr = [];
		if (!is_null($catId)) {
			foreach ($catData->props as $id=>$prop){
					array_push($listPropIdsArr,$this->saveCatProps($catId,$prop));
			}
			return [
					'status' => 'success',
					'data' =>['catId'=>$catId]
			];
		}

		return [
			'status' => 'fail',
			'failText' => 'Category creating error',
			'data' => $catId
		];
	}
	function checkCatProp($propId){
    	$sql = "
    		SELECT `id` FROM `category_properties`
				WHERE `id` = ?
    	";
    	$response = $this->db->prepare($sql,'i',[$propId])->fetch_assoc();
    	if(!empty($response['id'])){
    		return true;
			}
    	return false;
	}
	function updateCat($catData){
		if(!property_exists($catData,'parent')){
			$catData->parent = 0;
		}
		$this->db->update([
			'tableName' => 'categories',
			'updateData' => $catData,
			'fieldsToUpdate' => [
				['s' => 'title'],
				['s' => 'image'],
				['i' => 'parent'],
				['s' => 'c_desc'],
				['s' => 'mdesc'],
				['s' => 'mkeys']
			],
				'condition'=> ' WHERE `id` = ?',
				'conditionFields'=>[['i'=>'id']]
		]);
		$listPropIdsArr = [];
		foreach ($catData->props as $id=>$prop){

			if( $this->checkCatProp($prop->id)){
				array_push($listPropIdsArr,$this->updateCatProps($catData->id, $prop));
			}else{
				array_push($listPropIdsArr,$this->saveCatProps($catData->id,$prop));
			}
		}
		if(!empty($catData->deleted) ){
			foreach ($catData->deleted as $id=>$prop){
				$this->deleteCatChar($prop);
			}
		}
		return [
			'status' => 'success',
		//	'failText' => 'Category creating error',
			'data' =>$listPropIdsArr
		];
	}
	function deleteCatChar($propId){
    	echo $propId;
    	$sql = "DELETE FROM `category_properties`
			WHERE `id` = ? 
		";
		$this->db->prepare($sql,'i',[$propId]);
	}
	function updateCatProps($id,$prop){
		$propIds = [];
		$iProp =  $prop;
		$iProp->c_id = $id;
		$propId = $this->db->update([
				'tableName' => 'category_properties',
				'updateData' => $iProp,
				'fieldsToUpdate' => [
						['i' => 'c_id'],
						['s' => 'name'],
						['s' => 'p_desc'],
						['s' => 'p_type'],
						['i' => 'sort']
				],
				'condition'=> ' WHERE `id` = ?',
				'conditionFields'=>[['i'=>'id']]
		]);
		return $prop->id;
	}
	function getPropertiesLists(){
    	$sql = "
    		SELECT `id`,`title`,`sort`
    		FROM `props_list`
				ORDER BY `sort`
    	";
			$outLists = [];
    	$lists = $this->db->prepare($sql)->fetch_all(MYSQLI_ASSOC);
		foreach ($lists as $list){
			$outList = $list;
			$outList['props'] = $this->getPropertiesListsVals($list['id']);
			$outLists[] = $outList;
		}
			return (!empty($outLists)) ? $outLists : [];
	}
	function getCurrentPropList($listData){
    	$listId = $listData->id;
    	$sql = "
    		SELECT `id`,`title`,`sort`
    		FROM `props_list`
				WHERE `id` = ?
    	";
			$list = $this->db->prepare($sql,'i',[$listId])->fetch_assoc();
			$list['props'] = $this->getPropertiesListsVals($listId);
			return $list;
	}
	function getPropertiesListsVals($listId){
		$sql = "
    		SELECT `id`,`value`,`sort`,`prop_id`
    		FROM `props_list_vals`	
				WHERE `prop_id` = ? 
				ORDER BY  `sort` ASC 
    	";
		$lists = $this->db->prepare($sql,'i',[$listId])->fetch_all(MYSQLI_ASSOC);
		return $lists;
	}
	function savePropertyList($propertyListData){
			$listPropIdsArr = [];
    	$listId = $this->db->insert([
					'tableName' => 'props_list',
					'insertData' => $propertyListData,
					'fieldsToInsert' => [
							['s' => 'title']
					]
			]);
    	if($listId > 0){
    		foreach ($propertyListData->props as $id=>$prop){
					array_push($listPropIdsArr,$this->savePropVal($listId,$prop));
				}
				return [
						'status'=>'success',
						'data'=> [
								'listId'=> $listId,
								'propsId' => $listPropIdsArr
						]
				];
			}else{
				return [
						'status'=>'fail',
						'errorText'=> $this->db->errtext
				];
			}

	}
	function savePropVal($listId,$prop){
		$propObj = [
			'prop_id' => $listId,
			'sort'=>$prop->sort,
			'value'=>$prop->value
		];
		$propObj = (object) $propObj;
		$propertyValueId = $this->db->insert([
				'tableName' => 'props_list_vals',
				'insertData' => 	$propObj,
				'fieldsToInsert' => [
						['i' => 'prop_id'],
						['s' => 'value'],
						['i' => 'sort']
				]
		]);
		return $propertyValueId;
	}
	function updatePropertyList($propertyListData){
			$listPropIdsArr = [];
    	$listId = $this->db->update([
					'tableName' => 'props_list',
					'updateData' => $propertyListData,
					'fieldsToUpdate' => [
							['s' => 'title']
					],
					'condition'=> ' WHERE `id` = ?',
					'conditionFields'=>[['i'=>'id']]
			]);
    	if($listId ){
    		foreach ($propertyListData->props as $id=>$prop){
    			if(property_exists($prop,'id')){
						array_push($listPropIdsArr,$this->updatePropVal($prop));
					}else{
						array_push($listPropIdsArr,$this->savePropVal($propertyListData->id,$prop));
					}
				}
			}
    	if(!empty($propertyListData->deleted) ){
    		foreach ($propertyListData->deleted as $id=>$prop){
    			$this->deletePropVal($prop);
				}
			}
    	return [
				'status'=>'success',
				'data'=> [
						'listId'=> $listId,
						'propsId' => $listPropIdsArr
				]
			];
	}
	function updatePropVal($prop){
		$propertyValueId = $this->db->update([
				'tableName' => 'props_list_vals',
				'updateData' => 	$prop,
				'fieldsToUpdate' => [
						['s' => 'value'],
						['i' => 'sort']
				],
				'condition'=> ' WHERE `id` = ?',
				'conditionFields'=>[['i'=>'id']]
		]);
		return $prop->id;
	}
	function deletePropVal($prop){
    	$sql = "
    		DELETE  FROM `props_list_vals`
				WHERE `id` = ?
    	";
    	$this->db->prepare($sql,'i',[$prop->id]);
	}

	function deleteProperty($propertyData){
    	$id = $propertyData->id;
    	$sql = "DELETE FROM `props_list` WHERE `id` = ? ";
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
}