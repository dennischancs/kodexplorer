<?php
    if (($data = $_FILES['content'])===FALSE){
        return LNG('zoho.Config.fail');
    }
    
    if ($data["error"] == 0){
        if (($new_office_content = file_get_contents($data['tmp_name']))===FALSE){
            return LNG('zoho.Config.fail');
        } else {
            file_put_contents($_GET['path'], $new_office_content, LOCK_EX);
        }
    }
    return LNG('zoho.Config.success');
?>