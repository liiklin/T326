$(document).ready(function() {
    selected();
    $("#search").click(function() {
        var _this = $(this);
        var queryWords = $("#queryWords").val()
        if (!queryWords) {
            alert("请输入查询信息");
            return;
        }
        $('form').submit();
    });
});


function deleteSig(student_id, student_name) {
    var r = confirm("是否撤销" + student_name + "的签名信息？")
    if (r == true) {
        $.ajax({
            type: 'delete',
            "url": "/students/" + student_id,
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.status == 'done') {
                    $("#" + student_id).hide();
                } else {
                    alert("撤销失败");
                }
            },
            error: function(error) {
                console.error(error);
                alert("异常！");
            }
        });
    }
}

function selected() {
    var length = $("input[type='checkbox']:checked").length;
    if (length) {
        $("#export").show();
    } else {
        $("#export").hide();
    }
}

function exportPDF() {
    var ids = new Array();
    var semester = new Object();
    $("input[type='checkbox']:checked").each(function(index) {
        ids.push($(this).data("value"));
        semester[$(this).data("value")] = $(this).data("semester");
    });
    var data = {
        ids: ids,
        semester: semester
    };

    // console.log(JSON.stringify(data));
    if (!_.isEmpty(data)) {
        $.ajax({
            type: 'post',
            "url": "/index/exportpdf/",
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(data) {
                console.log(data)
                if (data.status == 'done') {
                    $.download('/index/download/', "filename=" + data.filename, 'post');
                    // downloadFile('/index/download/?filename=' + data.filename);
                } else {
                    alert("导出失败！");
                }
            },
            error: function(error) {
                console.error(error);
                alert("异常！");
            }
        });
    }
}


// Ajax 文件下载
// 获得url和data
jQuery.download = function(url, data, method) {
    if (url && data) {
        // data 是 string 或者 array/object
        data = typeof data == 'string' ? data : jQuery.param(data); // 把参数组装成 form的  input
        var inputs = '';
        jQuery.each(data.split('&'), function() {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        }); // request发送请求
        jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
            .appendTo('body').submit().remove();
    };
};

function downloadFile(url) {
    try {
        var elemIF = document.createElement("iframe");
        elemIF.src = url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    } catch (e) {

    }
}
