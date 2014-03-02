/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function ajaxComments(from, to, start, end) {
    var loggedin = false;
    $.ajax({
        type: "POST",
        url: "findaway/suggestions/",
        data: {from: from, to: to, start: start, end: end},
        success: function(result) {
            try {
//                    json format
//                    $data[] = array('ID','USERNAME','DATE_CREATED','TITLE','RATING','CONTENT','COMMENTS')     
                var jsonData = JSON.parse(result);
                
                var flagJSON = jsonData['flag'];
                var flag = flagJSON['FLAG'];
                
                if(flag == 1){
                    var output = "<div id='accordion-resizer' class='ui-widget-content'>" +
                            "<div id='accordion'>";
                    var stat = jsonData['status'];
                    loggedin = stat['LOGGED_IN'];
                    var pages = jsonData['paging'];
                    var paging = "<span>" + pages['pageof']['VALUE'] + " | </span>";
                    for (var i in pages){
                        if(i != 'pageof'){
                            var value = pages[i]['VALUE'];
                            var id = pages[i]['ID'];
                            if(id != -1){
                                //url string
                                paging += "<span class='page pages' onclick=\"" + value + "\" style='cursor:pointer'><u>" + id + "</u></span>"
                            }else{
                                paging += "<span class='pages'>" + value + "</span>";
                            }
                        }
                    }
                    var firstcommset = false;
                    for (var i in jsonData) {
                        if (i != 'status' && i != 'paging' && i != 'flag' && i != 'suggest' && i != 'modes') {
                            var row = jsonData[i];

                            output += "<h3 class='title'><a href='" + row['ID'] + "' class='suggestion'>" + row['TITLE'] + "</a></h3>" +
                                    "<div>" +
    //                                    "<input id='" + row['ID'] + "' type='text' value='" + row['CONTENT'] + "' style='display:none;'/>" +
                                    "<p class='createdby'>Created by: " + row['USERNAME'] + "</p>" +
//                                    "<div id='rating" + row['ID'] + "' class='rating'>Ratings: " + row['RATING'] + "</div>" +
                                    "<div id='rating" + row['ID'] + "' class='rating'></div>" +
                                    "<p class='createddate'>Date Created: " + row['DATE_CREATED'] + "</p>";

                            var commentdiv = "";
                            if (!firstcommset) {
                                getComments(row['ID']);
                                getRoute(row['ID']);
                                commentdiv = "<div id='" + row['ID'] + "' class='commentlist" + row['ID'] + " activecomment'>";
                                firstcommset = true;
                            } else {
                                commentdiv = "<div id='" + row['ID'] + "' class='commentlist" + row['ID'] + "' style='display:none;'>";
                            }
                            commentdiv += "</div>";
                            output += commentdiv;
                            //star ratings

                            output += "</div>";
                        } 
                    }
                    output += "</div></div>";
                    $('#SearchOutput').html(output);
                    $('#pagingOutput').html(paging);
                    //portion to set rating
                    for (var i in jsonData) {
                        if (i != 'status' && i != 'paging' && i != 'flag' && i != 'suggest' && i != 'modes') {
                            var row = jsonData[i];
                            $('#rating' + row['ID']).rating('findaway/rating/' + row['ID'] + '/', {maxvalue:5, curvalue:row['RATING']});
                        }
                    }
                }else if(flag == 2){
                    var outputJSON = jsonData['output'];
                    var outputString = "<span class='noresult'>" + outputJSON['OUTPUT'] + "</span>";
                    var suggestJSON = jsonData['suggest'];
                    var cansuggest = suggestJSON['SUGGEST'];
                    var suggestString = "";
                    if(cansuggest){
                        var modesJSON = jsonData['modes'];
                        var inputtitlestring = buildInputTitle(-1);
                        var addroutestring = buildAddRouteString(modesJSON);
                        var routeeditstring = buildRouteDetailString('routeeditdetails','');
                        suggestString = "<div class='editrouteauth'><a class='editroute' href='#'>Suggest</a></div>";
                    }
                    $('#SearchOutput').html(outputString);
                    $('#routeEdit').html(inputtitlestring + routeeditstring + addroutestring);
                    $('#pagingOutput').html('');
                    $('#routeOutput').html('');
                    $('#editauth').html(suggestString);
                    $('#routeEditTemplate').html('');
                    initEditRouteDialog();
                    initEditButtons();
                }else if (flag == 3){
                    for (var i in jsonData) {
//                        if
                    }
                }
            } catch (err) {
                $('#SearchOutput').html(result);
                $('#pagingOutput').html('');
                $('#routeOutput').html('');
                $('#editauth').html('');
                $('#routeEditTemplate').html('');
            }
        }
    }).done(function() {
        $("a.suggestion").on('click', function(event) {
            event.preventDefault();
            $('.activecomment').slideUp();
            $('.activecomment').html('');
            $('.activecomment').removeClass('activecomment');
            var id = $(this).attr('href');
            $('#' + id).addClass('activecomment');
            $('#' + id).hide();
            getComments(id);
            getRoute(id)
        });
    });
}

function getAddRoute(travelmodes) {
    var addroutestring = "";
    try {
        var modes = JSON.parse(travelmodes);
        var modeoptions = "";
        for (var i in modes) {
            var mode = modes[i];
            modeoptions += "<option value='" + mode['ID'] + "_" + mode['COLOR'] + "'>" + mode['NAME'] + "</option>";
        }
        addroutestring += "<select id='newmode'>" + modeoptions + "</select>";
        addroutestring += "<textarea id='newmoderemark' placeholder='Write description for the mode of transportation' value=''/>";
        addroutestring += "<textarea id='newtravelremark' placeholder='Write description during travel or where to alight' value=''/>";
        addroutestring += "<input type='text' id='newfare' value=''/>";
        addroutestring += "<input type='text' id='neweta' value=''/>";
        addroutestring += "<span class='newroute'>Add</span>";
    } catch (err) {
        alert(err);
    }
    return addroutestring;
}

function buildRouteDetail(mode_name, mode_id,mode_color, mode_desc, travel_desc, fare, eta, editmode) {
    var tempstring = "";
    tempstring += "<div class='transpomode' style='color:" + mode_color + "' modeid='" + mode_id + "'>" +
            mode_name + "</div>";
    tempstring += "<div class='transpomode_desc'>" +
            mode_desc + "</div>";
    tempstring += "<div class='travel_desc'>" +
            travel_desc + "</div>";
    tempstring += "<div class='fare'>" +
            fare + "</div>";
    tempstring += "<div class='ETA'>" +
            eta + "</div>";
    if (editmode) {
        tempstring += "<div class='moveupdown'>";
        tempstring += "<div class='moveup'><span class='moveupbtn'>up</span></div>";
        tempstring += "<div class='movedown'><span class='movedownbtn'>down</span></div>";
        tempstring += "</div>";
        tempstring += "<div class='removebtn'><span class='removeroutebtn'>delete</span></div>";
    }
    return tempstring;
}
function getRoute(sug_id) {
    $.ajax({
        type: "POST",
        url: "findaway/route/",
        data: {sug_id: sug_id},
        success: function(result) {
            var routestring = "";
            var routeeditstring = "";
            var inputtitlestring = "";
            var owner = false;
            var addRouteString = "";
            try {
                var routes = JSON.parse(result);
                owner = routes['SUG_OWNER'];
                for (var i in routes) {
                    var route = routes[i];
                    if (i != 'SUG_OWNER' && i != 'MODES') {
                        var tempstring = buildRouteDetail(route['TRANSPOMODE_NAME'],route['TRANSPOMODE_ID'],
                                route['TRANSPOMODE_COLOR'], route['TRANSPOMODE_DESC'], route['TRAVEL_DESC'],
                                route['FARE'], route['ETA'], false);
                        if (owner) {
                            routeeditstring += "<div class='routedetail'>";
                            '    '
                            routeeditstring += buildRouteDetail(route['TRANSPOMODE_NAME'],route['TRANSPOMODE_ID'],
                                    route['TRANSPOMODE_COLOR'], route['TRANSPOMODE_DESC'], route['TRAVEL_DESC'],
                                    route['FARE'], route['ETA'], true);
                            routeeditstring += "</div>";
                        }
                        routestring += "<div class='routedetail'>";
                        routestring += tempstring;
                        routestring += "</div>";
                    }
                }
                inputtitlestring = buildInputTitle(sug_id);
                addRouteString = buildAddRouteString(routes['MODES']);
            } catch (err) {
            }
//            var from = $('#from').val();
//            var to = $('#to').val();
//            routestring = "<div class='routedetails'>" + routestring + "</div><div class='fromto'> To: " + to + "</div>";
//            routestring = "<div class='fromto'> From: " + from + "</div>" + routestring;
            routestring = buildRouteDetailString('routedetails',routestring);

//            routeeditstring = "<div class='routeeditdetails'>" + routeeditstring + "</div><div class='fromto'> To: " + to + "</div>";
//            routeeditstring = "<div class='fromto'> From: " + from + "</div>" + routeeditstring;
            routeeditstring = buildRouteDetailString('routeeditdetails',routeeditstring);

            var editroute = "";
            if (owner) {
                editroute = "<div id='editrouteauth'><a class='editroute' href='#'>Edit</a></div>";
                $('#routeEdit').html(inputtitlestring + routeeditstring + addRouteString);
                $('#routeEditTemplate').html(routeeditstring);
            } else {
                editroute = "<div id='editrouteauth'>You can not edit this!</div>";
                $('#routeEdit').html('');
                $('#routeEditTemplate').html('');
            }
            $('#routeOutput').html(routestring);
            $('#editauth').html(editroute);
        }
    }).done(function() {
        initEditButtons();
        initEditRouteDialog();
    });
}
function initEditRouteDialog(){
    $("#routeEdit").dialog({
            autoOpen: false,
            modal: true,
            buttons: {
                save: function() {  
                        var newroutes = [];
                        var sug_id = $('.routetitle').attr('id');
                        var newtitle = $('.routetitle').val();
                        alert('sug_id: ' + sug_id);
                        alert('rout title: ' + newtitle);
                    $('#routeEdit .routeeditdetails .routedetail').each(function(index,element){
                        var elementclass = $(element).attr('class');
                        var modeid = "";
                        var modedesc = "";
                        var traveldesc = "";
                        var fare = "";
                        var eta = "";
                        $(element).children().each(function(index,child){
//                            alert("child attr " + $(child).attr);
                            if($(child).attr('class') == 'transpomode'){
                                modeid = $(child).attr('modeid');
                            }else if($(child).attr('class') == 'transpomode_desc'){
                                modedesc = $(child).html();
                            }else if($(child).attr('class') == 'travel_desc'){
                                traveldesc = $(child).html();
                            }else if($(child).attr('class') == 'fare'){
                                fare = $(child).html();
                            }else if($(child).attr('class') == 'ETA'){
                                eta = $(child).html();
                            } 
                            
                        });
                        
                        var newroute = {};
                        newroute.modeid = modeid;
                        newroute.modedesc = modedesc;
                        newroute.traveldesc = traveldesc;
                        newroute.fare = fare;
                        newroute.eta = eta;
//                        newroutes.push(JSON.stringify(newroute));
                        newroutes.push(newroute);
//                        alert(modeid + " " + modedesc + " " + traveldesc + " " + fare + " " + eta);
                    });
                    alert("Stringify: " + JSON.stringify(newroutes));
                    updateRoute(newroutes,sug_id,newtitle);
                    $(this).dialog("close");
                },
                cancel: function() {
                    var newtitleinput = "<div id='routetitlediv'>" + $('#routetitlediv').html() + "</div>";
                    var newroutetemplate = "<div id='newroutediv'>" + $('#newroutediv').html() + "</div>";
                    $('#routeEdit').html(newtitleinput + $('#routeEditTemplate').html() + newroutetemplate);
                    $(this).dialog("close");
                }
            }
        });
}
function buildInputTitle(sug_id){
    var inputval = "";
    if(sug_id != -1){
        $('a.suggestion').each(function(index,element){
            if($(element).attr('href') == sug_id){
                inputval = $(element).text();
            }
        });
    }
    return "<div id='routetitlediv'><span class='routetitleclass'>Title:</span><input id='" + sug_id + "' class='routetitle' type='text' value='" + inputval + "'/></div>";
}
function buildRouteDetailString(classname,routestring){
    var from = $('#from').val();
    var to = $('#to').val();
    routestring = "<div class='" + classname + "'>" + routestring + "</div><div class='fromto'> To: " + to + "</div>";
    return routestring = "<div class='fromto'> From: " + from + "</div>" + routestring;
}
function buildAddRouteString(modes){
    return "<div id='newroutediv'>" + getAddRoute(modes) + "</div>";
}
function updateRoute(newroutes,sug_id,newtitle){
//    var sug_id = $('.activecomment').attr('id');
    var from = $('#from').val();
    var to = $('#to').val();
    $.ajax({
        type: "POST",
        url: "findaway/update/",
        data: {sug_id: sug_id,from: from,to: to, newroutes: newroutes,newtitle: newtitle},
        success: function(result) {
            if(result == "Success"){
                //update template
                $('#routeOutput .routedetails').html('');                     
                $('#routeEditTemplate .routedetails').html('');
                $('#routeEdit .routeeditdetails .routedetail').each(function(index,element){
                    var routedetail = $(element).html();  
                    routedetail = "<div class='routedetail'>" + routedetail + "</div>";
                    $('#routeOutput .routedetails').append(routedetail);
                    $('#routeEditTemplate .routedetails').append(routedetail);
                    initEditButtons();
                });
                $('#routeOutput .routedetails').children().each(function(index,element){
                    alert('here: ' + index);
                    $(element).children().each(function(index2,child){
                        alert('class: ' + $(child).attr('class'));
                        if($(child).attr('class') == 'moveupdown' || $(child).attr('class') == 'removebtn'){
                            $(child).remove();
                        }
                    });
                });
                $('#routeEditTemplate .routedetails').children().each(function(index,element){
                    alert('here: ' + index);
                    $(element).children().each(function(index2,child){
                        alert('class: ' + $(child).attr('class'));
                        if($(child).attr('class') == 'moveupdown' || $(child).attr('class') == 'removebtn'){
                            $(child).remove();
                        }
                    });
                });
                if(sug_id != -1){
                    $('a.suggestion').each(function(index,element){
                        if($(element).attr('href') == sug_id){
                            $(element).text(newtitle);
                        }
                    });
                }else{
                    var from = $("#from").val();
                    var to = $("#to").val();
                    ajaxComments(from, to, 0, 4);
                }
                alert(result + " in updating route.");
            }else{
                //restore edit dialog
                var inputtitlediv = "<div id='routetitlediv'>" + $('#routetitlediv').html() + "</div>";
                var newroutetemplate = "<div id='newroutediv'>" + $('#newroutediv').html() + "</div>";
                $('#routeEdit').html(inputtitlediv + $('#routeEditTemplate').html() + newroutetemplate);
                alert(result + " in updating route.");
            }
        },
        error: function(result){
            //restore edit dialog
            var inputtitlediv = "<div id='routetitlediv'>" + $('#routetitlediv').html() + "</div>";
            var newroutetemplate = "<div id='newroutediv'>" + $('#newroutediv').html() + "</div>";
            $('#routeEdit').html(inputtitlediv + $('#routeEditTemplate').html() + newroutetemplate);
            alert("Error in updating routes");
        }
    });
}

function initEditButtons() {
    $(".newroute").button({
        icons: {
            primary: "ui-icon-circle-plus",
        },
        text: false
    });
    $(".moveupbtn").button({
        icons: {
            primary: "ui-icon-carat-1-n",
        },
        text: false
    });
    $(".movedownbtn").button({
        icons: {
            primary: "ui-icon-carat-1-s",
        },
        text: false
    });
    $(".removeroutebtn").button({
        icons: {
            primary: "ui-icon-close",
        },
        text: false
    });
}

function getComments(sug_id) {
    $.ajax({
        type: "POST",
        url: "findaway/comments/",
        data: {SUG_ID: sug_id},
        success: function(result) {
            var commentstring = "<p>Comments:</p><div id='existingcomments'>";
            try {
                var comments = JSON.parse(result);
                for (var j in comments) {
                    if (j != 'status') {
//                        $commentlist[] = array('USERNAME','DATE_CREATED','CONTENT');
                        var comment = comments[j];
                        commentstring += "<p class='comment_cont'>" + comment['CONTENT'];
                        +"</p><br/>";
                        commentstring += "<span class='comment_uname'> - " + comment['USERNAME'] + "</span>";
                        commentstring += "<span class='comment_dateposted'> [" + comment['DATE_CREATED'] + "]</span>";
                    }
                }
                commentstring += "</div>";
                if (comments['status']['LOGGED_IN']) {
                    commentstring += "<textarea class='text-holder newcomment' placeholder='Write a comment..' ></textarea><div id='charleft'></div>";
                } else {
                    commentstring += "<p>No you can't post a comment. <a href='user/'>Login</a> first</p>";
                }
            } catch (err) {
                commentstring += "</div>";
                if (comments['status']['LOGGED_IN']) {
                    commentstring += "<textarea class='text-holder newcomment' placeholder='Write a comment..' ></textarea><div id='charleft'></div>";
                } else {
                    commentstring += "<p>No you can't post a comment. <a href='user/'>Login</a> first</p>";
                }
            }
            $('#' + sug_id).html(commentstring);
            $('#' + sug_id).slideDown();
            if (comments['status']['LOGGED_IN']) {
                $(".newcomment").limiter(100, $('#charleft'));
            }
        }
    });

}

$(function() {
    function split(val) {
        return val.split(/,\s*/);
//        return val;
    }
    function extractLast(term) {
        return split(term).pop();
    }
    $(".search").bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).data("ui-autocomplete").menu.active) {
            event.preventDefault();
        }
    }).autocomplete({
        source: function(request, response) {
            $.getJSON("search/", {
                term: extractLast(request.term)
            }, response);
        },
        search: function() {
            if (this.value.length < 2) {
                return false;
            }
        },
        focus: function() {
            return false;
        },
        messages: {
            noResults: '',
            results: function() {
            }
        }
    });

    $("#FindRoute").click(function() {
        var from = $("#from").val();
        var to = $("#to").val();

//        ajaxComments("findaway/suggestions/", from, to, 0, 4);
        ajaxComments(from, to, 0, 4);
//        ajaxPaging(from,to);
    });
    $(document).on('click', '.movedownbtn', function(event) {
        var source = $(this).parent().parent().parent();
        var nextElement = source.next();
        var sourcehtml = source.html();
        if (nextElement.html()) {
            nextElement.after("<div class='routedetail'>" + sourcehtml + "</div>");
            source.remove();
        } else {
            alert('This is the last element already!');
        }
    });
    $(document).on('click', '.moveupbtn', function(event) {
        var source = $(this).parent().parent().parent();
        var previousElement = source.prev();
        var sourcehtml = source.html();
        if (previousElement.html()) {
            previousElement.before("<div class='routedetail'>" + sourcehtml + "</div>");
            source.remove();
        } else {
            alert('This is the first element already!');
        }
//                alert($(this).parent().parent().parent().attr('class'));
//                var content = $(this).parent().parent().parent().prev().html();
    });
    $(document).on('click', '.removeroutebtn', function(event) {
        $(this).parent().parent().remove();
    });
    $(document).on('click','a.editroute',function(event){
        event.preventDefault();
        $("#routeEdit").dialog("open");
    }); 
    $(document).on('click', '.newroute', function(event) {
        alert('add new route');
        var newmodearr = $('#newmode').val().split("_");
        var newmode = $('#newmode :selected').text();
        var newmoderemark = $('#newmoderemark').val();
        var newtravelremark = $('#newtravelremark').val();
        var newfare = $('#newfare').val();
        var neweta = $('#neweta').val();

        var newroutedetail = buildRouteDetail(newmode, newmodearr[0],newmodearr[1], newmoderemark,
                newtravelremark, newfare, neweta, true);

        var newroutedetaildiv = "<div class='routedetail'>" + newroutedetail + "</div>";

        $('#newroutediv').prev().prev().append(newroutedetaildiv);
        initEditButtons();
    });
    $(document).on('keypress', '.newcomment', function(e) {
        if (e.which == 13) {
            var msg = $(this).val();
            var sug_id = $('.activecomment').attr('id');
            $.ajax({
                url: 'post/comment/',
                type: 'POST',
                data: {sug_id: sug_id, msg: msg},
                success: function(data) {
                    $('.newcomment').val('');
                    $('.newcomment').css('height', '14px');
                    var commentstring = "";
                    try {
                        var comments = JSON.parse(data);
                        for (var j in comments) {
                            alert(j); 
                            var comment = comments[j];
                            commentstring += "<p class='comment_cont'>" + comment['CONTENT'];
                            +"</p><br/>";
                            commentstring += "<span class='comment_uname'> - " + comment['USERNAME'] + "</span>";
                            commentstring += "<span class='comment_dateposted'> [" + comment['DATE_CREATED'] + "]</span>";
                        }
                    } catch (err) {

                    }
                    alert(commentstring);
                    $('#existingcomments').append(commentstring);
                }
            });
        }
    });
//    $(document).on('change',':radio',function(e){
//        alert($(this).parent().attr('id'));
//         $('.choice').text( this.value + ' stars' );
//    });
});

(function($) {
    $.fn.extend({
        limiter: function(limit, elem) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html(limit - chars);
            }
            setCount($(this)[0], elem);
        }
    });
})(jQuery);