<?php

    if (isset($_POST['text']) && !empty($_POST['text']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
        
        $path = '../txt/';
        $fileName = 'txt_crypt_' . mt_rand(1000, 10000) . '_' . time() . '.txt';
        file_put_contents($path.$fileName, $_POST['text']);
        
        echo 'txt/'.$fileName;
        
    }

?>