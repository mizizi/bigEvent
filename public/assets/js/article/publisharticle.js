$(function () {
    let momentId = 0
    // 初始化富文本编辑器
    initEditor()
    renderSelect()
    // 初始化下拉选择框
    function renderSelect() {
        var layer = layui.layer
        var form = layui.form
        $.ajax({
            type: "GET",
            url: '/label?offset=0&limit=100',
            success: function (res) {
                console.log(res);
                let tmphtml = template("tpl-cate", res)
                $('[name=cate_id]').html(`${tmphtml}`)
                form.render()
            }
        })
    }
    // 封面裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 300 / 400,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击文件上传
    $('#choicecover').on('click', function (e) {
        e.preventDefault()
        $('#choicefile').click()
        // 监听上传文件
    })
    $('#choicefile').on('change', function (e) {
        let files = e.target.files
        if (files.length < 0) {
            return
        }
        let newImgURL = URL.createObjectURL(files[0])
        $image.cropper("destroy").attr('src', newImgURL).cropper(options)
    })
    let isrelease = 1
    $('#btnSave').on('click', function (e) {
        e.preventDefault()
        isrelease = 0
    })
    $('#form-data').on('submit', function (e) {
        e.preventDefault()
        console.log($(this)[0]);
        let data = {}
        let content = $('#articlecontent').val().replace(/<[\/]{0,1}p>/g, '')
        console.log(content);
        data.content = content
        data.title = $('#articletitle').val()
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 300,
                height: 400
            })
            .toDataURL('image/png')
        // base64转图片
        // 获取base64数据
        base64data = dataURL
        // 以逗号为分隔转换为数组
        var arr = base64data.split(',');
        // 去除符号
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var obj = new Blob([u8arr], { type: mime });
        const formData = new FormData()
        formData.append('picture', obj, 'image.jpg')
        const data1 = [$('#scategory').val()]
        console.log(data1);
        $.ajax({
            type: "POST",
            url: "/moment",
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            data,
            success: function (res) {
                if (res.status === 200) {
                    momentId = res.result[0].insertId
                    // 为动态添加标签
                    addLabel(momentId, data1)
                    updatePic(momentId, formData)
                }
            }
        })
    })
    function addLabel(id, data1) {
        $.ajax({
            type: "POST",
            url: `/moment/${id}/labels`,
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            data: {
                labels: data1
            },
            success: function (res) {
                console.log(res);
            }
        })
    }
    function updatePic(id, formData) {
        $.ajax({
            type: 'POST',
            url: `/upload/pictures?momentId=${id}`,
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            success: function (res) {
                console.log(res);
            }
        })
    }
})