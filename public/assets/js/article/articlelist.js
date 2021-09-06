$(function () {
    const data = {
        offset: 1,
        size: 2,
        // cate: '',
        // isrelease: ''
    }
    render()
    function render() {
        $.ajax({
            type: 'GET',
            url: '/moment',
            data,
            success: function (res) {
                console.log(res);
                let htmstr = template('tpl-table', res)
                $('tbody').html(htmstr)
                renderPage(res.result[0].MomentCount)
            }
        })
    }
    renderSelect()

    // 初始化文章分类的方法
    function renderSelect() {
        var form = layui.form
        $.ajax({
            type: "GET",
            url: '/label?offset=0&limit=100',
            success: function (res) {
                let tmphtml = template("tpl-cate", res)
                $('[name=cate_id]').html(`${tmphtml}`)
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        data.cate = $('[name=cate_id]').val()
        data.isrelease = $('#choicestate').val()
        render()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        let laypage = layui.laypage
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: data.size, // 每页显示几条数据
            curr: data.offset, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            jump: function (obj, first) {
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                console.log(obj.curr);
                data.offset = obj.curr
                data.size = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    render()
                }
            }
        })
    }
    // 编辑文章列表
    $('.layui-table').on('click', '#edit', function (e) {
        let data = {
        }
        data.id = $(this).parents('td').siblings().eq(0).html()
        console.log(data);
        e.preventDefault()
        let oldhtml = $(this).parents('tr').html()
        let oldcontent = $(this).parents('td').siblings().eq(1).html()
        $(this).parents('td').siblings('td').eq(1).html(`
                <input type="text" id="content">    
        `)
        $(this).parents('td').html(`
            <button type="button" id="sure" class="layui-btn layui-btn-xs">确认修改</button>
            <button type="button" id="cancel" class="layui-btn layui-btn-danger layui-btn-xs">取消</button>
        `)
        $('#content').val(`${oldcontent}`)
        $('#cancel').on('click', function (e) {
            e.preventDefault()
            $(this).parents('tr').html(`${oldhtml}`)
        })
        $('#sure').on('click', function (e) {
            const data1 = {}
            e.preventDefault()
            data1.content = $('#content').val()
            console.log(data1);
            $.ajax({
                type: "PATCH",
                url: `/moment/${data.id}`,
                headers: {
                    Authorization: sessionStorage.getItem('token')
                },
                data: data1,
                success: function (res) {
                    if (res.status === 200) {
                        console.log(res.msg);
                        render()
                    } else {
                        console.log(res.message);
                    }
                }
            })
        })

    })
    // 删除文章列表
    $('.layui-table').on('click', '#delete', function (e) {
        e.preventDefault()
        let data1 = {
            id: $(this).parents('td').siblings().eq(0).html()
        }
        console.log(data1);
        $.ajax({
            type: "DELETE",
            url: `/moment/${data1.id}`,
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            success: function (res) {
                if (res.status == 200) {
                    console.log('删除动态成功');
                    if ($('tr').length == 2) {
                        console.log(data.offset);
                        if (data.offset !== 1) {
                            data.offset--
                            render()
                        } else {
                            render()
                        }
                    } else {
                        render()
                    }
                }
                else if (res.status == 401) {
                    console.log(res.message);
                }

            }
        })
    })
})
