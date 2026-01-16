var listFile = [];
var token = localStorage.getItem("token");
function loadFiles() {
    var f = document.getElementById("listfileanhch")
    listFile = [];
    for(i=0; i<f.files.length; i++){
        listFile.push(f.files[i]);
    }
    var main = ''
    for(i=0; i<listFile.length; i++){
        var urs =  URL.createObjectURL(listFile[i])
        main += `<div id="divimg${i}" class="col-6 col-md-4 col-lg-4">
                    <div class="singleimg">
                        <img class="imganhch" src="${urs}">
                        <button onclick="deleteImgPreview(${i})" class="form-control btn btn-warning">xóa</button>
                    </div>
                </div>`
    }
    document.getElementById("listanhpre").innerHTML = main;
}

// xóa ảnh tạm thời
function deleteImgPreview(i){
    listFile.splice(i, 1);
    document.getElementById("divimg"+i).remove();
}

var listDm = []
async function loadDanhMuc(type) {
    var url = 'http://localhost:8080/api/public/findCategoryByType?type='+type;
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
        listDm.push(list[i]);
    }
    document.getElementById("tags").innerHTML = main
    const ser = $("#tags");
    ser.select2({
        placeholder: "Chọn tag cho câu hỏi",
    });
}

async function loadChiTietCauHoi(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if(id != null){
        var url = 'http://localhost:8080/api/public/questionById?id='+id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        document.getElementById("tieude").value = result.title
        if(result.questionImages.length > 0){
            document.getElementById("divanhdathem").style.display = "block"
            var main = ''
            for(i=0; i<result.questionImages.length; i++){
                main += `<div id="anhdt${result.questionImages[i].id}" class="col-6 col-md-3 col-lg-3">
                            <div class="singleimg">
                                <img class="imganhch" src="${result.questionImages[i].linkImage}">
                                <button onclick="xoaAnh(${result.questionImages[i].id})" class="form-control btn btn-warning">xóa</button>
                            </div>
                        </div>`
            }
            document.getElementById("listanhdathem").innerHTML = main
        }
        var op = ''
        for(i=0; i<listDm.length; i++){
            var check = false;
            for(j=0; j<result.questionCategories.length; j++){
                if(listDm[i].id === result.questionCategories[j].category.id){
                    check = true;
                }
            }
            if(check){
                op += `<option selected value="${listDm[i].id}">${listDm[i].name}</option>`
            }
            else{
                op += `<option value="${listDm[i].id}">${listDm[i].name}</option>`
            }
        }
        document.getElementById("tags").innerHTML = op
        const ser = $("#tags");
        ser.select2({
            placeholder: "Chọn tag cho câu hỏi",
        });

        tinyMCE.get('editor').setContent(result.content)

    }
}

async function luuCauHoi(){
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id == null) id = "";
    var title = document.getElementById("tieude").value
    var listCate = $('#tags').val();
    var listCategory = []
    for(i=0; i<listCate.length; i++){
        listCategory.push(Number(listCate[i]));
    }
    var noidung = tinyMCE.get('editor').getContent();

    if(title == "") {alert("Tiêu đề không được để trống");return;}
    if(title.length < 20) {alert("Tiêu đề phải dài hơn 20 kí tự");return;}
    if(listCategory.length == 0) {alert("Chọn ít nhất 1 tag cho câu hỏi");return;}
    if(noidung.length < 30) {alert("Nội dung câu hỏi phải dài hơn 30 kí tự");return;}

    var listLink = [];
    if(listFile.length > 0){
        const formData = new FormData()
        for(i=0; i<listFile.length; i++){
            formData.append("file", listFile[i])
        }
        var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file';
        const res = await fetch(urlUpload, { 
            method: 'POST', 
            body: formData
        });
        if(res.status < 300){
            listLink = await res.json();
        }
    }
    console.log(listLink)

    var dto = {
        "id":id,
        "title":title,
        "content":noidung,
        "categoryId":listCategory,
        "listLinkImage":listLink
    }
    console.log(dto)
    var url = 'http://localhost:8080/api/user/taoCauHoi';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(dto)
    });
    if(response.status < 300){
        swal({
            title: "", 
            text: "thành công!", 
            type: "success"
          },
        function(){ 
            window.location.replace("taikhoan#cauhoi")
        });
    }
    else{
        toastr.error("Có lỗi xảy ra");
    }
    document.getElementById("loading").style.display = 'none'
}

var size = 3
var sortb = ''
async function cauHoiCuaToi(page, sortby){
    sortb = sortby;
    var url = 'http://localhost:8080/api/user/myQuestion?size='+size+'&page='+page+'&sort='+sortby+',desc';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages 
    var totalElements = result.totalElements
    document.getElementById("slcauhoitk").innerHTML = totalElements + " câu hỏi"
    var main = '';
    for (i = 0; i < list.length; i++) {
        var dm = ''
        for(j=0; j<list[i].questionCategories.length; j++){
            dm += `<a href="" class="tagcauhoi">.${list[i].questionCategories[j].category.name}</a> `
        }
        main += `<div class="singlechtk">
                    <div class="d-flex">
                        <span class="thongsochtk">${list[i].numberLike} phiếu bầu</span>
                        <span class="thongsochtk">${list[i].numberComment} câu trả lời</span>
                        <span class="thongsochtk">${list[i].numberView} lượt xem</span>
                        <span onclick="xoaCauHoi(${list[i].id})" class="thongsochtk poiter xoacauhoi">Xóa</span>
                        <span class="thongsochtk poiter xoacauhoi"><a href="taocauhoi?id=${list[i].id}"><i class="fa fa-edit"></i></a></span>
                    </div>
                    <a href="" class="tenchtk">${list[i].title}</a>
                    <div class="row">
                        <div class="listtag listtagtk col-8">
                            ${dm}
                        </div>
                        <div class="col-4 divtgdangchtk"><span class="tgdangch">${list[i].createdDate}</span></div>
                    </div>
                </div>`
    }
    document.getElementById("listch").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="cauHoiTrangChu(${Number(i)-1},'${sortb}')" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("listpage").innerHTML = mainpage

}

function locCauHoi(){
    var so = document.getElementById("sorts").value;
    cauHoiCuaToi(0, so);
}

async function xoaAnh(id) {
    var con = confirm("Bạn muốn xóa ảnh này?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/deleteImageQuestion?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        document.getElementById("anhdt"+id).remove();
    }
}

async function xoaCauHoi(id) {
    var con = confirm("Bạn muốn xóa câu hỏi này?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/deleteQuestion?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        cauHoiCuaToi(0, sortb)
    }
}

async function cauHoiTrangChu(page, sortby, em){
    sortb = sortby;
    var uls = new URL(document.URL)
    var search = uls.searchParams.get("search");
    var category = uls.searchParams.get("category");
    if(search == null){
        search = "";
    }
    var url = 'http://localhost:8080/api/public/allQuestion?size='+size+'&page='+page+'&sort='+sortby+',desc'+'&search='+search;    
    if(category != null){
        url += '&category='+category
    }
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages 
    var totalElements = result.totalElements
    var main = '';
    for (i = 0; i < list.length; i++) {
        var dm = ''
        for(j=0; j<list[i].questionCategories.length; j++){
            dm += `<a href="index?category=${list[i].questionCategories[j].category.id}" class="tagcauhoi">.${list[i].questionCategories[j].category.name}</a> `
        }
        document.getElementById("noidungtam").innerHTML = list[i].content
        var nd = $('#noidungtam').text()
        main += `<div class="col-sm-12 singlecauhoi">
                    <div class="row">
                        <div class="col-sm-2">
                            <div class="listthongsoch">
                                <p class="thongsoch">${Number(list[i].numberLike) + Number(list[i].numberDislike)} phiếu bầu</p>
                                <p class="thongsoch">${list[i].numberComment} câu trả lời</p>
                                <p class="thongsoch">${list[i].numberView} lượt xem</p>
                            </div>
                        </div>
                        <div class="col-sm-10">
                            <a href="cauhoi?id=${list[i].id}" class="tieudech">${list[i].title}</a>
                            <p class="motach">${nd}</p>
                            <div class="listtag">
                                ${dm}
                            </div>
                            <div class="nguoidangch">
                                <img src="${list[i].user.avatar}" class="imguserch">
                                <a href="" class="tenuserdangch">${list[i].user.username}</a>
                                <span class="thoigiandangch"> ${list[i].createdDate}, ${list[i].createdTime}</span>
                            </div>
                        </div>
                    </div>
                </div>`
    }
    document.getElementById("listcauhoi").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="cauHoiTrangChu(${Number(i)-1},'${sortb}',null)" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("listpage").innerHTML = mainpage

    if(em != null){
        var cs = document.getElementsByClassName("loaibvheader");
        for(j=0; j<cs.length; j++){
            cs[j].classList.remove('active');
        }
        em.classList.add('active')
    }
}

async function loadChiTietCh(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if(id == null){
        window.location.replace("index");
    }
    if(token == null){
        document.getElementById("cautraloidiv").style.display = 'none'
    }
    var url = 'http://localhost:8080/api/public/findByPublicUser?id='+id;    
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    console.log(result)
    document.getElementById("tieudechct").innerHTML = result.title
    document.getElementById("viewchct").innerHTML = result.numberView
    document.getElementById("timechct").innerHTML = result.createdDate +", " +result.createdTime
    document.getElementById("luotlike").innerHTML = result.numberLike
    document.getElementById("luotdislike").innerHTML = result.numberDislike
    document.getElementById("contentctch").innerHTML = result.content
    // if(result.unLike == false){
    //     document.getElementById("splike").classList.add('active')
    // }
    // if(result.unLike == true){
    //     document.getElementById("spunlike").classList.add('active')
    // }
    document.getElementById("splike").onclick = function(){likeCauHoi(id)}
    document.getElementById("spunlike").onclick = function(){unlikeCauHoi(id)}

    var dm = ''
    for(j=0; j<result.questionCategories.length; j++){
        dm += `<a href="index?category=${result.questionCategories[j].category.id}" class="tagcauhoi">.${result.questionCategories[j].category.name}</a> `
    }
    document.getElementById("listtag").innerHTML = dm

    if(result.questionImages.length == 0){
        document.getElementById("listanhch").style.display = 'none'
    }
    else{
        var main = `<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel"><div class="carousel-inner">`
        for(i=0; i<result.questionImages.length; i++){
            var ac = ''
            if(i==0){
                ac = 'active'
            }
            main += `<div class="carousel-item ${ac}">
                        <img src="${result.questionImages[i].linkImage}" class="d-block w-100" alt="...">
                    </div>`
        }
        main += `</div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>`
        document.getElementById("listanhch").innerHTML = main;
    }
    checkUnlike(id);
    var listch = localStorage.getItem("listch");
    if(listch == null){
        return;
    }
    listch = JSON.parse(localStorage.getItem("listch"));
    console.log(listch)
    for(i=0; i<listch.length;i++){
        if(listch[i].id == id){
            document.getElementById("pluucauhoi").innerHTML = '<span class="blue" onclick="luuTamCauHoi()"><i class="fa fa-bookmark-o"></i> Đã lưu câu hỏi</span>'
        }
    }
}

async function checkUnlike(idcauhoi){
    if(token == null){
        return;
    }
    document.getElementById("spunlike").classList.remove('active')
    document.getElementById("splike").classList.remove('active')
    var url = 'http://localhost:8080/api/public/checkUnlike?id=' + idcauhoi;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var checks = await response.text();
    if(checks === "true"){
        document.getElementById("spunlike").classList.add('active')
    }
    if(checks === "false"){
        document.getElementById("splike").classList.add('active')
    }
}


async function likeCauHoi(idcauhoi){
    if(token == null){
        toastr.warning("Bạn chưa đăng nhập!");
        return;
    }
    var url = 'http://localhost:8080/api/user/likeCauHoi?id=' + idcauhoi;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        var result = await response.json();
        document.getElementById("luotlike").innerHTML = result.numLike
        document.getElementById("luotdislike").innerHTML = result.numUnLike
        checkUnlike(idcauhoi)
    }
}

async function unlikeCauHoi(idcauhoi){
    if(token == null){
        toastr.warning("Bạn chưa đăng nhập!");
        return;
    }
    var url = 'http://localhost:8080/api/user/unlikeCauHoi?id=' + idcauhoi;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(response.status < 300){
        var result = await response.json();
        document.getElementById("luotlike").innerHTML = result.numLike
        document.getElementById("luotdislike").innerHTML = result.numUnLike
        checkUnlike(idcauhoi)
    }
}


async function binhLuan() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/user/addQuestionComment';
    var content = tinyMCE.get('editor').getContent()
    var comment = {
        "content": content,
        "question":{
            "id":id
        }
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(comment)
    });
    if(response.status < 300){
        toastr.success("Đã đăng bình luận của bạn");
        document.getElementById("listcautlct").innerHTML = ''
        loadBinhLuan(0,"id");
        window.location.href = '#listcautlct'
        tinyMCE.get('editor').setContent("");
    }
    else{
        toastr.error("Có lỗi xảy ra");
    }
}

var nowPage = 0
async function loadBinhLuan(page, sort) {
    nowPage = page;
    sort = document.getElementById("sorts").value
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/public/findCommnetByQuestion?id='+id+'&size=3&page='+page+'&sort='+sort;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
        })
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var lastPage = result.last
    if(lastPage == true){
        document.getElementById("xemthemctl").style.display = 'none'
    } 
    else{
        document.getElementById("xemthemctl").style.display = 'block' 
    }
    var totalElements = result.totalElements
    document.getElementById("soluongctl").innerHTML = totalElements
    console.log(result)
    var main = '';
    var iduser = -1;
    if(localStorage.getItem('user') != null){
        var user = JSON.parse(localStorage.getItem('user'));
        iduser = user.id;
    }
    for (i = 0; i < list.length; i++) {
        var sub = list[i].numSubComment > 0? `<span onclick="loadCauTraLoiCon(${list[i].id})" class="slcautl">Có ${list[i].numSubComment} câu trả lời</span>`:'';
        var edits = iduser == list[i].user.id?`<span onclick="loadCapNhat(${list[i].id})" class="slcautl">chỉnh sửa</span>`:''
        var dels = iduser == list[i].user.id?`<span onclick="xoaBinhLuan(${list[i].id})" class="slcautl xoactlct">xóa</span>`:''
        main += `<div class="singlectlct" id="singlectlct${list[i].id}">
                    <div class="row">
                        <div class="col-11">
                            <div class="d-flex nguoidangctl">
                                <img class="avtuserdangctl" src="${list[i].user.avatar}">
                                <span class="usernamedangctl">${list[i].user.username}</span>
                                <span class="ngaytraloi">${list[i].createdDate}, ${list[i].createdTime}</span>
                            </div>
                            <div class="contentctlct" id="contentctlct${list[i].id}">
                                ${list[i].content}
                            </div>
                            <div class="d-flex">
                                <span onclick="loadReplayBl(${list[i].id},'${list[i].user.username}')" class="slcautl">Trả lời</span>
                                ${edits}
                                ${dels}
                                ${sub}
                            </div>
                            <div class="replaybinhluan" id="replaybinhluan${list[i].id}">
                            </div>
                        </div>
                    </div>
                </div>`
    }
    document.getElementById("listcautlct").innerHTML += main
}

function sortCtl(){
    document.getElementById("listcautlct").innerHTML = ''
    loadBinhLuan(0,"id,desc");
}

function loadThem(){
    ++nowPage;
    loadBinhLuan(nowPage,"id,desc");
}

function huyCapNhat(){
    document.getElementById("chinhsualoidiv").style.display = 'none'
    document.getElementById("replaydiv").style.display = 'none'
    document.getElementById("cautraloidiv").style.display = 'block'
    document.getElementById("idcautraloi").value = ""
}
async function loadCapNhat(id){
    document.getElementById("chinhsualoidiv").style.display = 'block'
    document.getElementById("cautraloidiv").style.display = 'none'
    document.getElementById("replaydiv").style.display = 'none'
    document.getElementById("idcautraloi").value = id
    window.location.href = '#chinhsualoidiv'
    var url = 'http://localhost:8080/api/public/getContentComment?id='+id;
    const response = await fetch(url, { method: 'GET'});
    var content = await response.text();
    tinyMCE.get('editorupdate').setContent(content);
}

function huyReplay(){
    document.getElementById("chinhsualoidiv").style.display = 'none'
    document.getElementById("replaydiv").style.display = 'none'
    document.getElementById("cautraloidiv").style.display = 'block'
    document.getElementById("idcommentcha").value = ""
}
async function loadReplayBl(idCommentParent, username){
    document.getElementById("replaydiv").style.display = 'block'
    document.getElementById("chinhsualoidiv").style.display = 'none'
    document.getElementById("cautraloidiv").style.display = 'none'
    document.getElementById("idcommentcha").value = idCommentParent
    document.getElementById("usernamenguoinhan").value = username
    document.getElementById("nguoinhan").innerHTML = username
    window.location.href = '#replaydiv'
}

async function capNhatBinhLuan() {
    var id = document.getElementById("idcautraloi").value;
    var url = 'http://localhost:8080/api/user/updateContentComment?id='+id;
    var content = tinyMCE.get('editorupdate').getContent()
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
        body: content
    });
    if(response.status < 300){
        toastr.success("Đã cập nhật bình luận của bạn");
        document.getElementById("contentctlct"+id).innerHTML = content;
        window.location.href = '#contentctlct'+id
        huyCapNhat()
        tinyMCE.get('editorupdate').setContent("");
    }
    else{
        toastr.error("Có lỗi xảy ra");
    }
}

async function xoaBinhLuan(id) {
    var con = confirm("Bạn chắc chắn muốn xóa bình luận này?")
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/deleteComment?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa bình luận thành công");
        document.getElementById("singlectlct"+id).remove()
        // loadBinhLuan(0, "id,desc");
    }
    else {
        toastr.error("Xóa bình luận thất bại");
    }
}

async function traLoiBinhLuan() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var idcommentcha = document.getElementById("idcommentcha").value;
    var usernamenguoinhan = document.getElementById("usernamenguoinhan").value;
    var url = 'http://localhost:8080/api/user/addQuestionComment';
    var content = tinyMCE.get('editorreplay').getContent()
    var comment = {
        "content": content,
        "usernameReciver":usernamenguoinhan,
        "question":{
            "id":id
        },
        "parentComment":{
            "id":idcommentcha
        }
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(comment)
    });
    if(response.status < 300){
        toastr.success("Đã đăng bình luận của bạn");
        document.getElementById("replaybinhluan"+idcommentcha).innerHTML = ''
        loadCauTraLoiCon(idcommentcha);
        window.location.href = '#replaybinhluan'+idcommentcha

    }
    else{
        toastr.error("Có lỗi xảy ra");
    }
}

async function loadCauTraLoiCon(idcmtParent){
    var url = 'http://localhost:8080/api/public/commentByParent?id='+idcmtParent;
    const response = await fetch(url, { method: 'GET'});
    var list = await response.json();
    var main = ''
    var iduser = -1;
    if(localStorage.getItem('user') != null){
        var user = JSON.parse(localStorage.getItem('user'));
        iduser = user.id;
    }
    for(i=0; i<list.length; i++){

        var edits = iduser == list[i].user.id?`<span onclick="loadCapNhat(${list[i].id})" class="traloirpl">sửa</span>`:''
        var dels = iduser == list[i].user.id?`<span onclick="xoaBinhLuanTraLoi(${list[i].id},${list[i].parentComment.id})" class="xoactlsp"><i class="fa fa-trash-o"></i></span>`:''
        var dates = list[i].createdDate == ngayHienTai()?list[i].createdTime:list[i].createdDate
        main += `<div class="singlereplay">
                    <div class="d-flex nguoidangctl">
                        <img class="avtuserrepl" src="${list[i].user.avatar}">
                        <span class="usernamerepl">${list[i].user.username}</span>
                        <span class="ngaytraloispl">${dates}</span>
                        <span onclick="loadReplayBl(${idcmtParent},'${list[i].user.username}')" class="traloirpl">trả lời</span>
                        ${edits} ${dels}
                    </div>
                    <div class="contentreplay">
                        <span class="nguoinhansub">@${list[i].usernameReciver} </span>
                        <span class="cds" id="contentctlct${list[i].id}">${list[i].content}</span>
                    </div>
                </div>`
    }
    document.getElementById("replaybinhluan"+idcmtParent).innerHTML = main
}

async function xoaBinhLuanTraLoi(id, idcommentcha) {
    var con = confirm("Bạn chắc chắn muốn xóa bình luận này?")
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/deleteComment?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa bình luận thành công");
        document.getElementById("replaybinhluan"+idcommentcha).innerHTML = ''
        loadCauTraLoiCon(idcommentcha);
        window.location.href = '#replaybinhluan'+idcommentcha
    }
    else {
        toastr.error("Xóa bình luận thất bại");
    }
}


function ngayHienTai(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    console.log(today)
    return today;
}


async function luuTamCauHoi(){
    var list = localStorage.getItem("listch");
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if(id == null){
        window.location.replace("index");
    }
    if(token == null){
        document.getElementById("cautraloidiv").style.display = 'none'
    }
    var url = 'http://localhost:8080/api/public/findByPublicUser?id='+id;    
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    if (list === null) {
    	var lists = [];
    	lists.push(result);
    	window.localStorage.setItem('listch', JSON.stringify(lists));
        toastr.success("Đã lưu câu hỏi");
        return;
	}
    else{
        var list = JSON.parse(localStorage.getItem("listch"));
        var check = false
        for(i=0; i<list.length; i++){
            if(list[i].id == id){
				check = true;
			}
        }
        if(check == false){
            list.push(result);
            document.getElementById("pluucauhoi").innerHTML = `<span class="blue" onclick="luuTamCauHoi()"><i class="fa fa-bookmark-o"></i> Đã lưu câu hỏi</span>`
            toastr.success("Đã lưu câu hỏi");  
            window.localStorage.setItem('listch', JSON.stringify(list));  
        }
        if(check == true){
            var remainingArr = list.filter(data => data.id != id);
            document.getElementById("pluucauhoi").innerHTML = `<span onclick="luuTamCauHoi()"><i class="fa fa-bookmark-o"></i> Lưu câu hỏi</span>`
            toastr.success("Bỏ lưu thành công");  
            window.localStorage.setItem('listch', JSON.stringify(remainingArr));
        }
    }
}


async function cauHoiDaLuu(){
    var list = localStorage.getItem("listch");
    if(list == null){
        document.getElementById("listcauhoidaluu").innerHTML = ''
    }
    else{
        list = JSON.parse(localStorage.getItem("listch"));
        var main = ''
        for(i=0; i<list.length; i++){
            var dm = ''
            for(j=0; j<list[i].questionCategories.length; j++){
                dm += `<a href="index?category=${list[i].questionCategories[j].category.id}" class="tagcauhoi">.${list[i].questionCategories[j].category.name}</a> `
            }
            document.getElementById("noidungtam").innerHTML = list[i].content
            var nd = $('#noidungtam').text()
            main += `<div class="col-sm-12 singlecauhoi">
                        <div class="row">
                            <div class="col-sm-2">
                                <div class="listthongsoch">
                                    <p class="thongsoch">${Number(list[i].numberLike) + Number(list[i].numberDislike)} phiếu bầu</p>
                                    <p class="thongsoch">${list[i].numberComment} câu trả lời</p>
                                    <p class="thongsoch">${list[i].numberView} lượt xem</p>
                                </div>
                            </div>
                            <div class="col-sm-10">
                                <a href="cauhoi?id=${list[i].id}" class="tieudech">${list[i].title}</a>
                                <p class="motach">${nd}</p>
                                <div class="listtag">
                                    ${dm}
                                </div>
                                <div class="nguoidangch">
                                    <img src="${list[i].user.avatar}" class="imguserch">
                                    <a href="" class="tenuserdangch">${list[i].user.username}</a>
                                    <span class="thoigiandangch"> ${list[i].createdDate}, ${list[i].createdTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>`
        }
        document.getElementById("noidungtam").innerHTML = ''
        document.getElementById("listcauhoidaluu").innerHTML = main
    }
}