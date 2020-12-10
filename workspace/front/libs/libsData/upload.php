<?
	$filename = $_SERVER['HTTP_X_FILE_NAME'];
	$filesize = $_SERVER['HTTP_X_FILE_SIZE'];
	if(isset($_POST['path']) && !empty($_POST['path'])){
		$n_path = '/'.$_POST['path'];
	}
	$destination_path ="../../../../uploads";
	$files = $_FILES['file_name']['name'];  // имя файла
	if(!empty($files)){
		$file_name = $files;
		$file_type = '';
		$temp_file_name = $_FILES['file_name']['tmp_name']; // временное место хранения файла
		switch( mime_content_type($temp_file_name)){
			case 'image/jpeg':$file_type='.jpg';break;
			case 'image/png':$file_type='.png';break;
			case 'image/gif':$file_type='.gif';break;
			case 'image/svg+xml':$file_type='.svg';break;
			case 'application/pdf':$file_type='.pdf';break;
		};
		if(file_exists($destination_path.$n_path.'/'.$file_name)){
			$pos = strripos($file_name,'.');
			$name = substr($file_name,0,$pos);
			$ty = substr($file_name,$pos);
			$file_name=   $name.'('.substr(uniqid("gr_"),15).')'.$ty;
		}
		switch($file_type){
			case '.jpg':{
				$im = imagecreatefromjpeg($temp_file_name);
					imagejpeg($im,$destination_path.$n_path.'/'.$file_name,9);
			}break;
			case '.png':{
				$im = imagecreatefrompng($temp_file_name);
				put_watermark($file_name,$im,''/*'.png'*/,$destination_path.$n_path,'./watermark.png');
			};break;
			case '.gif':{
				$u_file_name = $file_name.$file_type;
				move_file($temp_file_name,$u_file_name,$destination_path.$n_path);
			}break;
			case '.pdf':{
				$u_file_name = $file_name.$file_type;
				move_file($temp_file_name,$u_file_name,$destination_path.$n_path);
			}break;
			case '.svg':{
				$u_file_name = $file_name;
				move_file($temp_file_name,$u_file_name,$destination_path.$n_path);
			}
			default:{
				$u_file_name = $file_name;
				move_file($temp_file_name,$u_file_name,$destination_path.$n_path);
			}
		};


		$fullFileName = $file_name;//.$file_type;
		echo $fullFileName;

	}

function put_watermark($file_name,$im,$file_type,$path,$watermark_path){
	$stamp = imagecreatefrompng($watermark_path);

	//  $im = imagecreatefromjpeg($tempFileName);

// Установка полей для штампа и получение высоты/ширины штампа
	$marge_right = 20;
	$marge_bottom = 20;
	$sx = imagesx($stamp);
	$sy = imagesy($stamp);

// Копирование изображения штампа на фотографию с помощью смещения края
// и ширины фотографии для расчета позиционирования штампа.
	imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right, imagesy($im) - $sy - $marge_bottom, 0, 0, imagesx($stamp), imagesy($stamp));

// Вывод и освобождение памяти
	imagejpeg($im,$path."/".$file_name.$file_type,75);
	imagedestroy($im);

//    move_uploaded_file($tempFileName,$destinationPath."/".$fileName.$fileType); // перемещение файла в папку core/uploads

}

function move_file($file_name,$u_file_name,$path){
	//  $full_file_name =$file_name.$file_type;
	$u_name = $path.'/'.$u_file_name;
	//echo $u_file_name;
	move_uploaded_file($file_name,$u_name);
}

?>