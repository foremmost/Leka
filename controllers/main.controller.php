<?php
require_once 'abstract.controller.php';
class main extends ctrl{
	const componentName= 'main';

	public function prepareData(){
		return Dater::add([
			'title'=>'s',
			'favicon' => '/uploads/favicon.png'
		]);
	}
	public function doRender(){
		ob_start( array('self', 'replaceData'));
			$name = self::componentName;
			require_once VIEWS_DIR."{$name}/header.php";
			$this->render();
			require_once VIEWS_DIR."{$name}/footer.php";
		ob_end_flush();
	}
}
