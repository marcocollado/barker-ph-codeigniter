<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
class maps extends CI_Controller{
    public function __construct() {
        parent::__construct();
    }
    
    public function index(){
//        echo 'yeabah!!';
    }
    
    public function latlong(){
        $this->load->model('locref_model');
        $this->load->model('latlong_model');

        $from = $this->locref_model->getId($this->input->post('from'));
        $to = $this->locref_model->getId($this->input->post('to'));
        $data = array();
        $data['from'] = $this->latlong_model->getLatLong($from);
        $data['to'] = $this->latlong_model->getLatLong($to);
        echo json_encode($data);
    }
}

?>
