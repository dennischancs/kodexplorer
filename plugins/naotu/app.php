<?php
class naotuPlugin extends PluginBase{
    function __construct(){
        parent::__construct();
    }
    public function regiest(){
        $this->hookRegiest(array(
            'user.commonJs.insert' => 'naotuPlugin.echoJs',
        ));
    }
    public function echoJs($st,$act){
        if($this->isFileExtence($st,$act)){
            $this->echoFile('static/main.js');
        }
    }
}
