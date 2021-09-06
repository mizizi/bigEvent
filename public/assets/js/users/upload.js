$(function () {
    let layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    let base64data
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }
        // 1. 拿到用户选择的文件
        let file = e.target.files[0]
        // 2. 将文件，转化为路径
        let imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    $('#uploadimg').on('click', function () {
        // 创建读取文件对象
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
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
        formData.append('avatar', obj, 'image.jpg')
        if ($('#file')[0].files.length > 0) {
            let maximgsize = 2100000
            if (base64data > maximgsize) {
                return alert('图片文件超过2M,请裁剪后在上传')
            }
            else {
                $.ajax({
                    type: 'POST',
                    url: "/upload",
                    data: formData,
                    contentType: false,
                    processData: false,
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    success: function (res) {
                        if (res.status === 200) {
                            console.log(res);
                            window.parent.setHeadPic(res.avatarURL, res.name)
                        }
                    }
                })
            }
        } else {
            alert('您尚未选择图片')
        }
    })
})