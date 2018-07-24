/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://ydzdhzct.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        uploadAudio: `${host}/weapp/uploadaudio`,

        //获取热门电影列表
        movieList: `${host}/weapp/movies`,

        // 拉取用户信息
        user: `${host}/weapp/user`,

        //上传影评
        uploadReview: `${host}/weapp/review`,

        //获取影评列表
        reviewList: `${host}/weapp/review`,

        //上传收藏影评
        collectReview: `${host}/weapp/collectedReview`,

        //获取收藏影评列表
        collectedReviewList: `${host}/weapp/collectedReview`,

    }
};

module.exports = config;
