<div id="user">
    <span id="welcomeuser">Welcome <?php echo ($username != "") ? '<span data-dropdown="#dropdown-1" data-horizontal-offset="-100">' . $username . '</span> | ' . anchor('user/logout/', 'logout',array('class' => 'button')) : 'visitor' ?> </span>
</div> 
