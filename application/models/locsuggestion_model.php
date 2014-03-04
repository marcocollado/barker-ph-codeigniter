<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Locsuggestion_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function addLocsuggestion() {
        $data = array(
            'USER_ID' => $this->session->userdata('user_id'),
            'LOC_NAME' => $this->input->post('val'),
            'TAG' => 0
        );
        $this->db->insert('LOC_SUGGESTION', $data);
    }
    
    public function deleteSuggestion($id){
        $this->db->where('ID',$id);
        $this->db->delete('LOC_SUGGESTION');
    }

    public function record_count() {
        return $this->db->count_all("LOC_SUGGESTION");
    }
    
    public function fetch_suggestions($limit, $start) {
        $this->db->limit($limit, $start);
        $query = $this->db->get("LOC_SUGGESTION");
 
        if ($query->num_rows() > 0) {
            foreach ($query->result() as $row) {
                $data[] = $row;
            }
            return $data;
        }
        return false;
   }

}

?>
