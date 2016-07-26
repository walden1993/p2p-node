var counter = 0;
// 每页展示4个
var page_size = 5;
var page_num = 1;
$(function () {
    var counter = 0;
// 每页展示4个
    var num = 4;
    var pageStart = 0, pageEnd = 0;

// dropload
    $('.content').dropload({
        scrollArea: window,
        loadDownFn: function (me) {
            $.ajax({
                type: 'POST',
                url: '/message',
                data: {'page_size': page_size, 'page_num': page_num},
                success: function (data) {
                    counter++;
                    pageEnd = num * counter;
                    pageStart = pageEnd - num;

                    if (!data) {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData(true);
                    }else{
                        $('.lists').append(data);
                        page_num++;
                    }

                    // 每次数据加载完，必须重置
                    me.resetload();

                },
                error: function (xhr, type) {
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        },
        loadUpFn: function (me) {
            $.ajax({
                type: 'POST',
                url: '/message',
                data: {'page_size': page_size, 'page_num': 1},
                success: function (data) {
                    counter++;
                    pageEnd = num * counter;
                    pageStart = pageEnd - num;

                    if (!data) {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData(true);
                    }else{
                        $('.lists').empty().append(data);
                    }
                    // 为了测试，延迟1秒加载
                    // 每次数据加载完，必须重置
                    me.resetload();
                },
                error: function (xhr, type) {
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        }
    });
});