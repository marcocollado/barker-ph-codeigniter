<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Latlong_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function newLatLong() {
        $id = $this->input->post('id');
        $latitude = $this->input->post('lat');
        $longitude = $this->input->post('long');
        $data = array(
            'ID' => $id,
            'LATITUDE' => $latitude,
            'LONGITUDE' => $longitude
        );
        $this->db->insert('LATLONG', $data);
    }
    
    public function getLatLong($id){
        $query = $this->db->select('LATLONG');
        if($query->num_rows() > 0){
            $data = array();
            foreach($data as $row){
                $data[] = array('LAT' => $row->LATITUDE,'LONG' => $row->LONGITUDE);
            }
            return $data;
        }
        return null;
    }

}

?>
