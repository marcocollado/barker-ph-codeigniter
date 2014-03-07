<div class="memberlist_wrapper">
    <div id="list" class="loginBox">
        <div class="heading cf">
            <h3>Members</h3>
        </div>
        <div id="members">
            <?php
            $i = 0;
            echo "<table style='width:100%'>";
            foreach ($results as $data) {
                echo "<tr class='member " . (($i % 2 == 1) ? "grayrow" : "") . "'>";
//                echo "<div class='member " . (($i % 2 == 1) ? "grayrow" : "") . "'>";
                echo "<td>";
                echo "<div class='memberdet'>";
                echo $data->username;
                echo "</div>";
                echo "</td>";
                echo "<td>";
                echo "<div class='memberdet'>";
                echo $data->email;
                echo "</div>";
                echo "</td>";
                echo "<td>";
                echo "<div id='disp" . $data->id . "' class='memberdet'>";
                echo $data->ACCESS;
                echo "</div>";
                echo "</td>";
                echo "<td>";
                echo "<div class='memberdet'>";
                echo "<a href='" . base_url() . "index.php/user/access/" . $data->id . "/ADMIN' class='access'>ADMIN</a>";
                echo " &bull; ";
                echo "<a href='" . base_url() . "index.php/user/access/" . $data->id . "/USER' class='access'>USER</a>";
                echo " &bull; ";
                echo "<a href='" . base_url() . "index.php/user/access/" . $data->id . "/DISABLED' class='access'>DISABLED</a>";
                echo "</div>";
                echo "</td>";
//                echo "</div>";
                echo "</tr>";
                $i++;
            }
            echo "</table>";
            ?>
            <p><?php echo $links; ?></p>
        </div>
        <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds</p>
    </div>
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