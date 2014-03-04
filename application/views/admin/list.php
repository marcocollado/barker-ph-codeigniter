<div id="list">
    <h1>Members</h1>
    <div id="members">
        <?php
        foreach ($results as $data) {
            echo "<div class='member'>";
            echo "<div class='memberdet'>";
            echo $data->username;
            echo "</div>";
            echo "<div class='memberdet'>";
            echo $data->email;
            echo "</div>";
            echo "<div id='disp" . $data->id . "' class='memberdet'>";
            echo $data->ACCESS;
            echo "</div>";
            echo "<div class='memberdet'>";
            echo "<a href='" . base_url() . "index.php/user/access/" . $data->id . "/ADMIN' class='access'>ADMIN</a>";
            echo " &bull; ";
            echo "<a href='" . base_url() . "index.php/user/access/" . $data->id . "/USER' class='access'>USER</a>";
            echo " &bull; ";
            echo "<a href='" . base_url() . "index.php/user/access/" . $data->id . "/DISABLED' class='access'>DISABLED</a>";
            echo "</div>";
            echo "</div>";
        }
        ?>
        <p><?php echo $links; ?></p>
    </div>
    <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds</p>
</div>
<script type="text/javascript">
    $(document).on('click', '.access', function(e) {
        e.preventDefault();
        var access = $(this).text();
        var url = $(this).attr('href');
        $.ajax({
            type: "POST",
            url: url,
            data: {},
            success: function(id) {
                $('#disp' + id).html(access);
            },
            error: function(result) {
            }
        });
    });
</script>