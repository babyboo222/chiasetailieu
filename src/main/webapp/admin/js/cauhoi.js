var token = localStorage.getItem("token");

async function loadDanhSachCauHoi() {
    $('#example').DataTable().destroy();
    var sort = document.getElementById("sorts").value
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value
    var url = 'http://localhost:8080/api/public/allQuestionByAdmin?sort='+sort;
    console.log(url)
    if(start != "" && end != ""){
        url += `&start=`+start+'&end='+end
    }
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        var dm = ''
        for(j=0; j<list[i].questionCategories.length; j++){
            dm += `<a href="../index?category=${list[i].questionCategories[j].category.id}" class="tagcauhoi">.${list[i].questionCategories[j].category.name}</a> `
        }
        main += `<tr>
                    <td></td>
                    <td>#${list[i].id}</td>
                    <td><a target="_blank" class="poiter" href="../cauhoi?id=${list[i].id}">${list[i].title}</a></td>
                    <td>${list[i].user.username}</td>
                    <td>
                        <div class="listtag">
                           ${dm}
                        </div>
                    </td>
                    <td>${list[i].createdDate}</td>
                    <td>
                        <i class="fa fa-thumbs-o-up"> ${list[i].numberLike}</i>
                        <i class="fa fa-thumbs-o-down"> ${list[i].numberDislike}</i><br>
                        <a target="_blank" href="../cauhoi?id=${list[i].id}#listcautlct"><i class="fa fa-comment poiter"> ${list[i].numberComment}</i></a>
                        <i class="fa fa-eye"> ${list[i].numberView}</i>
                    </td>
                    <td class="headcol">
                        <span onclick="setGiaTri(${list[i].id},'${list[i].user.email}')" data-bs-toggle="modal" data-bs-target="#xoach" class="poiter trashxoach"><i class="fa fa-trash"></i></span><br>
                    </td>
                </tr>`
    }
    document.getElementById("listquestion").innerHTML = main
    $('#example').DataTable();
}

function setGiaTri(idcauhoi, email){
    document.getElementById("email").innerHTML = email
    document.getElementById("idcauhoi").value = idcauhoi
}

async function xoaCauHoi() {
    var idcauhoi = document.getElementById("idcauhoi").value;
    var content = tinyMCE.get('editor').getContent();
    var urlUpload = 'http://localhost:8080/api/admin/deleteQuestion?id='+idcauhoi;
    const res = await fetch(urlUpload, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
        body: content
    });
    if(res.status < 300){
        toastr.success("Xóa thành công");
        loadDanhSachCauHoi();
        tinyMCE.get('editor').setContent('');
        $('#xoach').modal('hide');
    }
    if(res.status > 300){
        toastr.error("Xóa thất bại");
    }
}