<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Findaway extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function index() {
//        if (($this->session->userdata('user_name') == "")) {
//        }
        $this->load->view('header_view');
        $this->load->view('fromto');
        $this->load->view('footer_view');
    }

    public function route() {
        $this->load->model('locref_model');
        $this->load->model('route_model');
        $this->load->model('suggestion_model');
        $this->load->model('user_model');
        $this->load->model('comments_model');


        $from = $this->locref_model->getId($this->input->post('from'));
        $to = $this->locref_model->getId($this->input->post('to'));
        $routeid = $this->route_model->getRouteId($from, $to);
        if ($routeid != -1) {
            $query = $this->suggestion_model->getAllSuggestions($routeid);
            if($query->num_rows() > 0){
                $data = array();
                foreach($query->result() as $suggestion){
                    $query2 = $this->user_model->getUser($suggestion->USER_ID);
                    if($query2->num_rows() > 0){
                        foreach ($query2->result() as $user){
                            $commentlist = array();
                            $comments =  $this->comments_model->getComments($suggestion->ID);
                            if($comments->num_rows() > 0){
                                foreach($comments->result() as $comment){
                                    $commenter = "";
                                    $commenter_q = $this->user_model->getUser($comment->USER_ID);
                                    if($commenter_q->num_rows() > 0){
                                        foreach ($commenter_q->result() as $commenter_r){
                                            $commenter = $commenter_r->username;
                                        }
                                    }
                                    $commentlist[] = array(
                                        'USERNAME'      =>  ($commenter == "") ? "anonymous":$commenter,
                                        'DATE_CREATED'  =>  $comment->DATE_CREATED,
                                        'CONTENT'       =>  $comment->CONTENT
                                    );
                                }
                            }
                            $data[] = array(
                                        'ID'            =>  $suggestion->ID,
                                        'USERNAME'      =>  $user->username,
                                        'TITLE'         =>  $suggestion->TITLE,
                                        'DATE_CREATED'  =>  $suggestion->DATE_CREATED,
                                        'RATING'        =>  $suggestion->RATING_AVE,
                                        'CONTENT'       =>  $suggestion->CONTENT,
                                        'COMMENTS'      =>  json_encode($commentlist)
                                    );
                        }
                    }
                }
                $data['status'] = array('LOGGED_IN' => $this->session->userdata('logged_in')); 
                echo json_encode($data);
            }else{
                //if registered user, create own suggestion for specific route combination
                echo "<p>No Results Found." . anchor('#','Suggest?');
            } 
        } else {
            //suggest new route combination
            if($from == -1 OR $to == -1){
                if($from == -1){
                    echo "<p>Input in the FROM field is not yet in our database. Send as a suggestion? " . anchor('search/suggest_location','yes');
                }
                if($to == -1){
                    echo "<p>Input in the TO field is not yet in our database. Send as a suggestion? " . anchor('search/suggest_location','yes');
                }
            }else{
                echo "<p>Route combination not yet available. Send as a suggestion? " . anchor('search/newroute/?from=' . $from . '&to=' . $to, 'yes');
            }
        }
    }

}

?>
