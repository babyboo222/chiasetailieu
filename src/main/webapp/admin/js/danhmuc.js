var token = localStorage.getItem("token");

async function loadDanhMuc(type) {
    var url = 'http://localhost:8080/api/public/findCategoryByType?type='+type;
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].name}</td>
                    <td>
                        <i onclick="deleteCategory(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <i onclick="loadThongTinDanhMuc(${list[i].id}, '${list[i].name}')" data-bs-toggle="modal" data-bs-target="#themdanhmuc" class="fa fa-edit iconaction"></i>
                    </td>
                </tr>`
    }
    document.getElementById("listdanhmuc").innerHTML = main
    $('#example').DataTable();
}

function loadThongTinDanhMuc(id, tenDanhMuc){
    document.getElementById("idcate").value = id
    document.getElementById("catename").value = tenDanhMuc
}

function clearInput(){
    document.getElementById("idcate").value = ""
    document.getElementById("catename").value = ""
}

async function luuDanhMuc(type) {
    var url = 'http://localhost:8080/api/admin/addOrUpdateCategory';
    var idcate = document.getElementById("idcate").value
    var tencategory = document.getElementById("catename").value
    if(tencategory == ""){
        alert("tên danh mục không được để trống");return;
    }
    category = {
        "id":idcate,
        "name": tencategory,
        "categroryType":type
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(category)
    });
    if (response.status < 300) {
        swal({
            title: "Thông báo", 
            text: "thêm/sửa danh mục thành công!", 
            type: "success"
          },
        function(){ 
            window.location.reload();
        });
    }
    if (response.status == exceptionCode)  {
        var result = await response.json()
        toastr.warning(result.errorMessage);
    }
}

async function deleteCategory(id) {
    var con = confirm("Bạn chắc chắn muốn xóa danh mục này?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/admin/deleteCategory?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa danh mục thành công!");
        await new Promise(r => setTimeout(r, 1000));
        window.location.reload();
    }
    if (response.status == exceptionCode)  {
        var result = await response.json()
        toastr.warning(result.errorMessage);
    }
}
