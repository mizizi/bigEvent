$(function () {
    function render() {
        $.ajax({
            type: "GET",
            url: '/label?offset=0&limit=100',
            success: function (res) {
                let tmphtml = template("tpl-table", res)
                $('tbody').html(`${tmphtml}`)
            }
        })
    }
    render()
    let layer = layui.layer

    $('#addcategory').on('click', function () {
        let index = layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#addcate-form').html()
        })
        $('#btn-addcate').on('click', function (e) {
            e.preventDefault()
            let data = {
                name: $('#category1').val(),
            }
            if ($('#category1').val().trim() !== '') {
                $.ajax({
                    type: 'POST',
                    url: '/label',
                    headers: {
                        Authorization: sessionStorage.getItem('token')
                    },
                    data,
                    success: function (res) {
                        console.log(res);
                        if (res.status == 200) {
                            console.log(res.msg);
                            layer.close(index)
                            render()
                        }
                    }
                })
            }
            else {
                alert('数据不能为空')
            }
        })

    })
    // 删除分类
    $('.layui-table').on('click', '#delete', function (e) {
        e.preventDefault()
        let data = {
            category: $(this).parents('td').siblings().eq(0).html()
        }
        console.log(data);
        $.ajax({
            type: "post",
            url: '/article/delete',
            data,
            success: function (res) {
                console.log(res);
                render()
            }
        })
    })
    // 编辑分类
    $('.layui-table').on('click', '#edit', function (e) {
        let data = {

        }
        data.oldcate = $(this).parents('td').siblings().eq(0).html()
        e.preventDefault()
        let oldhtml = $(this).parents('tr').html()
        let oldcate = $(this).parents('td').siblings().eq(0).html()
        let oldacate = $(this).parents('td').siblings().eq(1).html()
        $(this).parents('tr').html(`
        <td><input type="text" id="newcate"></td>
        <td><input type="text" id="newacate"></td>
        <td><button type="button" id="sure" class="layui-btn layui-btn-xs">确认修改</button>
            <button type="button" id="cancel" class="layui-btn layui-btn-danger layui-btn-xs">取消</button>
        </td>
        </td>
        `)
        $('#newcate').val(`${oldcate}`).focus()
        $('#newacate').val(`${oldacate}`)
        $('#cancel').on('click', function (e) {
            e.preventDefault()
            $(this).parents('tr').html(`${oldhtml}`)
        })
        $('#sure').on('click', function (e) {
            e.preventDefault()
            data.category = $('#newcate').val()
            data.anothercategory = $('#newacate').val()
            console.log(data);
            $.ajax({
                type: "post",
                url: '/article/cateedit',
                data,
                success: function (res) {
                    console.log(res);
                    render()
                }
            })
        })

    })
})