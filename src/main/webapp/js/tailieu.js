var listDm = []
async function loadDanhMuc(type) {
    listDm = [];
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
    document.getElementById("listdm").innerHTML = main
    const ser = $("#listdm");
    ser.select2({
        placeholder: "Chọn danh mục",
    });
}

var size = 9
async function taiLieuCuaToi(page){
    var sortby = document.getElementById("sorttl").value;
    var url = 'http://localhost:8080/api/user/myDocument?size='+size+'&page='+page+'&sort='+sortby;
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
    document.getElementById("sltailieu").innerHTML = totalElements
    var main = '';
    for (i = 0; i < list.length; i++) {
        var dm = ''
        for(j=0; j<list[i].documentCategories.length; j++){
            dm += `<a href="tailieu?category=${list[i].documentCategories[j].category.id}" class="tagcauhoi">.${list[i].documentCategories[j].category.name}</a> `
        }
        document.getElementById("noidungtamtl").innerHTML = list[i].description
        var noidung = $('#noidungtamtl').text();
        main += `<div class="singletltk">
        <div class="row">
            <div class="col-3 col-sm-3 col-md-2 col-lg-2">
                <img class="imgtltk" src="${list[i].linkImage}">
            </div>
            <div class="col-9 col-sm-9 col-md-7 col-lg-7">
                <a href="" class="tentltk">${list[i].name}</a>
                <span class="dnahmuctltk">${noidung}</span>
                <div class="d-flex">
                    <span><i class="fa fa-file-archive icgv"></i><span class="solu"> ${list[i].documentDetails.length}</span></span>
                    <span><i class="fa fa-eye icgv"></i><span class="solu"> ${list[i].numberView}</span></span>
                    <span><i class="fa fa-download icgv"></i><span class="solu"> ${list[i].numberDownload}</span></span>
                </div>
                <div class="d-flex">
                    <i onclick="xoaDoc(${list[i].id})" class="fa fa-trash icontltk"> Xóa</i>
                    <a href="dangtailieu?id=${list[i].id}"><i class="fa fa-edit icontltk"> Sửa</i></a>
                </div>
                <div class="listtag">
                    ${dm}
                </div>
            </div>
            <div class="col-md-3 col-lg-3">
                <span class="ngaydangtltk">Ngày đăng: ${list[i].createdDate}, ${list[i].createdTime}</span>
            </div>
        </div>
    </div>`
    }
    document.getElementById("listtailieutk").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="taiLieuCuaToi(${Number(i)-1})" class="page-item"><a class="page-link poiter">${i}</a></li>`
    }
    document.getElementById("listpagetl").innerHTML = mainpage

}

async function loadChiTietTaiLieu(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    loadDanhMuc("TAI_LIEU");
    if(id != null){
        document.getElementById("listfiledadang").style.display = 'block'
        var url = 'http://localhost:8080/api/public/documentByUser?id='+id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        document.getElementById("name").value = result.name
        document.getElementById("imgpreviewtl").src = result.linkImage
        linkbanner = result.linkImage
        var op = ''
        for(i=0; i<listDm.length; i++){
            var check = false;
            for(j=0; j<result.documentCategories.length; j++){
                if(listDm[i].id === result.documentCategories[j].category.id){
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
        document.getElementById("listdm").innerHTML = op
        const ser = $("#listdm");
        ser.select2({
            placeholder: "Chọn danh mục",
        });
        tinyMCE.get('editor').setContent(result.description)
        var ma = ''
        for(j=0; j<result.documentDetails.length; j++){
            ma += `<li id="lifile${result.documentDetails[j].id}"><a target="_blank" href="${result.documentDetails[j].linkFile}">${result.documentDetails[j].name}</a> <i onclick="xoaFile(${result.documentDetails[j].id})" class="fa fa-remove rmtailieu"></i></li>`
        }
        document.getElementById("dstldadang").innerHTML = ma
    }
}




var linkbanner = 'http://res.cloudinary.com/dyhy5jhmp/image/upload/v1693209934/zqlzyyfcbnke2bpasf8h.png'
async function taiTaiLieu(){
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id == null) id = "";
    var name = document.getElementById("name").value
    var listdm = $('#listdm').val();
    var mota = tinyMCE.get('editor').getContent();
    var listLink = [];
    var listFile = [];
    var f = document.getElementById("dsfile")
    for(i=0; i<f.files.length; i++){
        listFile.push(f.files[i]);
    }

    const filePath = document.getElementById('fileanhdaidientl')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload';
    const res = await fetch(urlUpload, {
        method: 'POST',
        headers: new Headers({
        }),
        body: formData
    });
    if(res.status < 300){
        linkbanner = await res.text();
    }
    console.log(linkbanner) 
    
    if(listFile.length > 0){
        const formData = new FormData()
        for(i=0; i<listFile.length; i++){
            console.log(listFile[i])
            formData.append("file", listFile[i])
        }
        var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file-name';
        const res = await fetch(urlUpload, { 
            method: 'POST', 
            body: formData
        });
        if(res.status < 300){
            listLink = await res.json();
        }
    }
    console.log(listLink)
    var documentDetails = []
    for(i=0; i<listLink.length; i++){
        var obj = {
            "name":listLink[i].oriName,
            "fileType":listLink[i].type,
            "linkFile":listLink[i].link
        }
        documentDetails.push(obj);
    }

    if(name == "") {alert("Tên tài liệu không được để trống");return;}
    if(name.length < 20) {alert("Tên tài liệu phải dài hơn 20 kí tự");return;}
    if(listdm.length == 0) {alert("Chọn ít nhất 1 danh mục cho tài liệu");return;}
    if(documentDetails.length == 0) {alert("Chọn ít nhất 1 file cho tài liệu");return;}
    if(mota.length < 30) {alert("Mô tả phải dài hơn 30 kí tự");return;}
    var dto = {
        "id":id,
        "name":name,
        "linkImage":linkbanner,
        "description":mota,
        "documentDetails":documentDetails,
        "listIdCategory":listdm
    }
    console.log(dto)
    var url = 'http://localhost:8080/api/user/uploadDocument';
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
            window.location.replace("taikhoan#tailieu")
        });
    }
    else{
        toastr.error();("Có lỗi xảy ra");
    }
    document.getElementById("loading").style.display = 'none'
}

async function xoaFile(id) {
    var con = confirm("Bạn muốn xóa file này?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/deleteDocDetail?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        document.getElementById("lifile"+id).remove();
    }
}


async function xoaDoc(id) {
    var con = confirm("Bạn muốn xóa tài liệu này?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/deleteDocument?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        taiLieuCuaToi(0);
    }
}


async function taiLieuPublic(page, sort, em){
    var uls = new URL(document.URL)
    var search = uls.searchParams.get("search");
    var category = uls.searchParams.get("category");
    if(search == null){search = ""}
    var url = 'http://localhost:8080/api/public/allDocumentPublic?size='+size+'&page='+page+'&sort='+sort+'&search='+search;
    if(category != null){
        url += `&category=`+category
    }
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages 
    var main = '';
    for (i = 0; i < list.length; i++) {
        var dm = ''
        for(j=0; j<list[i].documentCategories.length; j++){
            dm += `<a href="tailieu?category=${list[i].documentCategories[j].category.id}" class="tagcauhoi tagchin">.${list[i].documentCategories[j].category.name}</a> `
        }
        main += ` <div class="col-sm-6 col-md-4 col-lg-4">
                    <div class="singletailieu">
                        <a href="chitiettailieu?id=${list[i].id}"><img class="imgtl" src="${list[i].linkImage}"></a>
                        <a href="chitiettailieu?id=${list[i].id}" class="tentailieu">${list[i].name}</a><br>
                        <a href="" class="usertailieu">Tác giả: ${list[i].user.username}</a>
                        <div>
                        <span class="tstailieu">${list[i].createdDate}</span>
                            <span class="tstailieu"><i class="fa fa-eye"></i> 200</span>
                            <span class="tstailieu"><i class="fa fa-download"></i> 200</span>
                        </div>
                        <div class="listtag">
                            ${dm}
                        </div>
                    </div>
                </div>`
    }
    document.getElementById("listtailieutk").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="taiLieuPublic(${Number(i)-1})" class="page-item"><a class="page-link poiter">${i}</a></li>`
    }
    document.getElementById("listpagetl").innerHTML = mainpage
    if(em != null){
        var cs = document.getElementsByClassName("loaibvheader");
        for(j=0; j<cs.length; j++){
            cs[j].classList.remove('active');
        }
        em.classList.add('active')
    }
}

async function loadChiTietTaiLieuPublic(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if(id != null){
        var url = 'http://localhost:8080/api/public/documentPublic?id='+id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        document.getElementById("name").innerHTML = result.name
        document.getElementById("ngaydang").innerHTML = result.createdDate
        document.getElementById("userdang").innerHTML = result.user.username
        document.getElementById("soluongfile").innerHTML = ' '+result.documentDetails.length
        document.getElementById("imgnguoidang").src = result.user.avatar
        document.getElementById("numview").innerHTML = ' '+result.numberView
        document.getElementById("numberdownload").innerHTML = ' '+result.numberDownload
        document.getElementById("noidungtailieu").innerHTML = ' '+result.description
        var detail = result.documentDetails;
        var main = ''
        var mains = ''
        for(i=0; i<detail.length; i++){
            main += `<li><a onclick="uploadDownload(${id})" target="_blank" href="${detail[i].linkFile}">${detail[i].name}</a></li>`
            mains += `<li><a onclick="uploadDownload(${id})" target="_blank" href="${detail[i].linkFile}"><i class="fa fa-download"></i> ${detail[i].name}</a></li>`
        }
        document.getElementById("ullisttailieudikem").innerHTML = main;
        document.getElementById("ultailieupre").innerHTML = mains;

        url = 'http://localhost:8080/api/public/documentLienQuan?id='+id;
        const res = await fetch(url, {
            method: 'GET'
        });
        var list = await res.json();
        main = ''
        for(i=0; i<list.length; i++){
            main += `<div class="singletllq">
            <div class="row">
                <div class="col-1">
                    <i class="fa fa-file-pdf-o"></i>
                </div>
                <div class="col-11">
                    <a href="chitiettailieu?id=${list[i].id}" class="tenfilelq">${list[i].name}</a>
                    <div class="d-flex">
                        <span><i class="fa fa-file-archive icds"></i><span class="solu"> ${list[i].documentDetails.length}</span></span>
                        <span><i class="fa fa-eye icds"></i><span class="solu"> ${list[i].numberView}</span></span>
                        <span><i class="fa fa-download icds"></i><span class="solu"> ${list[i].numberDownload}</span></span>
                    </div>
                </div>
            </div>
        </div>`
        }
    document.getElementById("listtailieulq").innerHTML = main;
    }
}

async function uploadDownload(id){
    url = 'http://localhost:8080/api/public/updateDownload?id='+id;
    const res = await fetch(url, {
        method: 'POST'
    });
}

function timKiemBangDanhmuc(){
    var id = document.getElementById("listdm").value
    window.location.href='?category='+id
}

