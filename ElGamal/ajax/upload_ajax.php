<?php 

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$input_name = 'file';
$allow_extensions = array('txt');
$path = '../txt/';
$max_filesize = '5242880';


if (isset($_FILES[$input_name])) {
    
    $extension = explode('.',$_FILES[$input_name]['name']);
    $extension = $extension[count($extension)-1];
    if ($_FILES[$input_name]['type'] !== 'text/plain' || $extension !== 'txt')  {
        
        $res = array(
            'status' => 0,
            'msg' => 'Файл должен иметь расширение txt!'
        );
        
    } else if ($_FILES[$input_name]['size'] > $max_filesize) {
        
        $res = array(
            'status' => 0,
            'msg' => 'Файл не должен иметь размер более 5 МБ!'
        );
        
    } else {
        
        $fileName = 'txt_'. mt_rand(1000, 10000) . '_' . time();
        $fullFilePath = $path . $fileName . '.' . $extension;
        if (move_uploaded_file($_FILES[$input_name]['tmp_name'], $fullFilePath)) {
            
            $fileContent = file_get_contents($fullFilePath);
            
            require_once('db.php');
            $conn = new PDO('mysql:host='.$config['db_host'].';dbname='.$config['db_name'],$config['db_user'],$config['db_pass']);
            $conn->query('SET NAMES `utf8`');
            $conn->query('INSERT INTO `user_files` (text, ip) VALUES ("'.addslashes($fileContent).'","'.$_SERVER['REMOTE_ADDR'].'")');
            
            $res = array(
                'status' => 1,
                'msg' => 'Файл успешно загружен! Текст из файла вставлен в поле "Сообщение"!',
                'fileContent' => $fileContent
            );
            
        } else {
            
            $res = array(
                'status' => 0,
                'msg' => 'Файл не загружен из-за неизвестной ошибки!'
            );
            
        }
        
    }
    
    echo json_encode($res, JSON_UNESCAPED_UNICODE);
    
}