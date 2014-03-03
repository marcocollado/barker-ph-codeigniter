<div id="user">
    <span id="welcomeuser">Welcome <?php echo ($username != "") ? '<span data-dropdown="#dropdown-1">' . $username . '</span> | ' . anchor('user/logout/', 'logout') : 'visitor' ?> </span>
</div> 
