<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User extends CI_Controller {

    private $loginsuccess;
    public function __construct() {
        parent::__construct();
        $this->load->model('user_model');
    }

    public function index() {
        $data['username'] = $this->session->userdata('user_name');
        $data['title']= 'Signin/Register';
        $this->load->view('header_view',$data);
        $this->load->view('user',$data);
        $this->load->view("registration_view.php", $data);
        $this->load->view('footer_view',$data);
//        if($this->loginsuccess == 'loginsuccess'){
//            $this->load->view('/alert/loginsuccess');
//            $this->loginsuccess = '';
//        }else if($this->loginsuccess == 'loginfailed'){
//            $this->load->view('/alert/loginfailed');
//            $this->loginsuccess = '';
//        }
        if($this->session->userdata('ACCESS')){
            $this->load->view('/dropdwn/dropdwn');
        }
    }
    
    public function home() {
        
//		if($this->session->userdata('user_name')!="")
//		{
//			$this->welcome();
//		}
//		else{
//			$data['title']= 'Home';
        $data['username'] = $this->session->userdata('user_name');
        $this->load->view('header_view',$data);
        $this->load->view('user',$data);
        $this->load->view("index.php", $data);
        $this->load->view('footer_view',$data);
//        if($this->loginsuccess == 'loginsuccess'){
//            $this->load->view('/alert/loginsuccess');
//            $this->loginsuccess = '';
//        }else if($this->loginsuccess == 'loginfailed'){
//            $this->load->view('/alert/loginfailed');
//            $this->loginsuccess = '';
//        }
        if($this->session->userdata('ACCESS')){
            $this->load->view('/dropdwn/dropdwn');
        }
//		}
    }

    function welcome() {
        $data['title'] = 'Welcome';
        $this->load->view('header_view', $data);
        $this->load->view('welcome_view.php', $data);
        $this->load->view('footer_view', $data);
    }

    public function login() {
        $email = $this->input->post('email');
        $password = md5($this->input->post('pass'));

        $result = $this->user_model->login($email, $password);
        if ($result){
            $this->loginsuccess = 'loginsuccess'; 
            $this->home();
        }else{
            $this->loginsuccess = 'loginfailed';
            $this->index();
        }
    }

    function thank() {
        $data['title'] = 'Thank';
        $this->load->view('header_view', $data);
        $this->load->view('thank_view.php', $data);
        $this->load->view('footer_view', $data);
    }

    public function registration() {
        $this->load->library('form_validation');
        // field name, error message, validation rules
        $this->form_validation->set_rules('user_name', 'User Name', 'trim|required|min_length[4]|xss_clean|callback_check_user_ci');
        $this->form_validation->set_rules('email_address', 'Your Email', 'trim|required|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[4]|max_length[32]');
        $this->form_validation->set_rules('con_password', 'Password Confirmation', 'trim|required|matches[password]');

        if ($this->form_validation->run() == FALSE) {
//            $this->index();
        } else {
            $this->user_model->add_user();
            $this->home();
        }
    }

    public function logout() {
        $newdata = array(
            'user_id' => '',
            'user_name' => '',
            'user_email' => '',
            'logged_in' => FALSE,
        );
        $this->session->unset_userdata($newdata);
        $this->session->sess_destroy();
        $this->home();
    }

    public function check_user_ci() {
        $usr = $this->input->post('user_name');
        $result = $this->user_model->check_user_exist($usr);
        if ($result) {
            $this->form_validation->set_message('check_user', 'User Name already exit.');
            return false;
        } else {
            return true;
        }
    }

    public function check_user() {
        $usr = $this->input->post('name');
        $result = $this->user_model->check_user_exist($usr);
        if ($result) {
            echo false;
        } else {

            echo true;
        }
    }

}

?>