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
            'LOCATION_ID' => $id,
            'LATITUDE' => $latitude,
            'LONGITUDE' => $longitude
        );
        $this->db->insert('LATLONG', $data);
    }
    
    public function getLatLong($id){
        log_message('ERROR',$id . ' getlatLong start');
        $this->db->where('LOCATION_ID',$id);
        $query = $this->db->get('LATLONG');
        if ($query->num_rows() > 0){
            $data = array();
            foreach ($query->result() as $row){
                log_message('ERROR',$id . ' getlatlong ' . $row->latitude . ' ' . $row->longitude);
                $data[] = array('LAT' => $row->latitude,'LONG' => $row->longitude);
            }
            return $data;
        }
        return null;
    }

}

?>
