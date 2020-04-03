import { Logger } from "./Logger";

export enum WechatSub_MsgType {
    GetFriendScore = 1,
    SubmitTopScore = 2,
    CloseTop = 3,
}
export default class WechatHelper {
    private static wxSystemInfo: any = null;  //微信系统信息
    private static wxUserInfo: any = null;    //微信用户信息
    private static isInitShareCallbackEvent: boolean = false; //是否初始化监听微信分享回调
    /**
     * 是否微信小游戏环境
     */
    public static isWechatGame() {
        // Logger.log("isWechatGame=", cc.sys.platform, cc.sys.WECHAT_GAME, cc.sys.WECHAT_GAME_SUB)
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }
    /**
     * 是否微信开放域环境
     */
    public static isWechatGameSub() {
        Logger.log("isWechatGameSub=", cc.sys.platform, cc.sys.WECHAT_GAME, cc.sys.WECHAT_GAME_SUB)
        return cc.sys.platform == cc.sys.WECHAT_GAME_SUB;
    }
    /**
     * 获取微信系统信息
     */
    public static getSystemInfo() {
        if (!this.isWechatGame()) return;
        if (!WechatHelper.wxSystemInfo) {
            WechatHelper.wxSystemInfo = wx.getSystemInfoSync();
        }
        Logger.log("wxSystemInfo=", JSON.stringify(WechatHelper.wxSystemInfo));
        return WechatHelper.wxSystemInfo;
    }
    /**
     * 获取微信用户信息
     * @param callback 
     */
    public static getUserInfo(callback: Function = null): void {
        if (!this.isWechatGame()) return;
        if (!WechatHelper.wxUserInfo) {
            wx.getSetting({
                success(res) {
                    Logger.log("WechatHelper.getSetting==", res)
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        // 必须是在用户已经授权的情况下调用
                        wx.getUserInfo({
                            success(res) {
                                const userInfo = res.userInfo
                                WechatHelper.wxUserInfo = userInfo
                                Logger.log("getUserInfo===", userInfo);
                            },
                            fail(res) {
                                Logger.warn("getUserInfo=fail==", res);
                            },
                            complete(res) {
                                Logger.log("getUserInfo=complete==", res);
                                if (callback) {
                                    callback(WechatHelper.wxUserInfo);
                                }
                            }
                        })
                    }
                }
            })
        } else {
            if (callback) {
                callback(WechatHelper.wxUserInfo);
            }
        }
    }
    /**
     * 提交排行榜信息
     * @param score 
     */
    public static submitTopScore(score: number, topName: string = "testTop") {
        if (this.isWechatGame()) {
            Logger.log("WechatHelper.submitTopScore=", score);
            wx.getOpenDataContext().postMessage({
                messageType: WechatSub_MsgType.SubmitTopScore,
                topName: topName,
                score: score,
                userinfo: WechatHelper.wxUserInfo
            });
        }
    }
    /**
     * 获取排行榜信息
     */
    public static getFriendTopScore(topName: string = "testTop") {
        if (this.isWechatGame()) {
            Logger.log("WechatHelper.getFriendTopScore=======");
            wx.getOpenDataContext().postMessage({
                messageType: WechatSub_MsgType.GetFriendScore,
                topName: topName,
                userinfo: WechatHelper.wxUserInfo
            });
        }
    }
    /**
     * 关闭微信子域排行榜
     */
    public static closeTop() {
        if (this.isWechatGame()) {
            wx.getOpenDataContext().postMessage({
                messageType: WechatSub_MsgType.CloseTop,
            });
        }
    }
    //评论游戏
    public static commentGame() {
        if (this.isWechatGame()) {
            wx.openCustomerServiceConversation({});
        }
    }
    /**
     * 初始化微信分享回调
     */
    private static initShareCallbackEvent() {
        if (this.isWechatGame()) {
            if (!WechatHelper.isInitShareCallbackEvent) {
                Logger.log("WechatHelper.initShareCallbackEvent=");
                WechatHelper.isInitShareCallbackEvent = true;
                wx.onShareAppMessage((res) => {
                    Logger.log("WechatHelper.onShareAppMessage======", res);
                });
            }
        }
    }
    /**
     * @param pictureName 
     */
    public static sharePicture(pictureName: string = "shareGroup") {
        if (this.isWechatGame()) {
            WechatHelper.initShareCallbackEvent();
            Logger.log("WechatHelper.sharePicture=", pictureName);
            let designsize = cc.view.getDesignResolutionSize();
            let framesize = cc.view.getFrameSize();
            Logger.log("sharePicture designsize====", designsize.width, designsize.height)
            Logger.log("sharePicture winsize=", cc.winSize.width, cc.winSize.height);
            Logger.log("sharePicture framesize====", framesize.width, framesize.height)
            // let width:number = designsize.width;
            // let height:number = designsize.height;
            // let width:number = framesize.width;
            // let height:number = framesize.height;
            // canvas.toTempFilePath({
            //     x: 0,
            //     y: 0,
            //     width: width,

            //     height: height,
            //     destWidth: width,
            //     destHeight: height,
            //     success (res) {
            //         //.可以保存该截屏图片
            //         Logger.log(res)
            //         wx.shareAppMessage({
            //             imageUrl: res.tempFilePath
            //         })
            //     }
            // })


            let id = 'c0iOWC96QY6FIJtaME-wIA' // 通过 MP 系统审核的图片编号
            let url = 'https://mmocgame.qpic.cn/wechatgame/iaKy1DLP4FH2BRj6SHyAmMGlROuMobnsS9bYHfCVNqkpQaTZ67HpNX3mm36libyzSR/0' // 通过 MP 系统审核的图片地址
            wx.shareAppMessage({
                imageUrlId: id,
                imageUrl: url
            })

        }
    }

    public static previewImage(picUrls: Array<string>) {
        wx.previewImage({
            urls: picUrls,               //所有要预览的图片的地址集合 数组形式
            success: function (res) {
                Logger.log("showIcon==success", res);
            },
            fail: function (res) {
                Logger.log("showIcon==fail", res);
            },
            complete: function (res) {
                Logger.log("showIcon==complete", res);
            },
        })

    }

    public static saveImageToPhotosAlbum(url: string) {
        wx.downloadFile({
            url: url, //仅为示例，并非真实的资源
            success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                Logger.log("downloadFile===", res)
                if (res.statusCode === 200) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (data) {
                            console.log("保存===", data);
                            wx.showToast({
                                title: "保存成功",
                                duration: 2000
                            })
                        },
                        fail: (res) => {
                            wx.showToast({
                                title: res,
                                duration: 2000
                            })
                        }
                    });
                }
            },
            fail(res) {

            }
        })
    }


    // create the canvas and context, filpY the image Data
    private static createCanvas(wantNode: cc.Node) {
        let camera: cc.Camera = wantNode.addComponent(cc.Camera);

        let texture = new cc.RenderTexture();
        texture.initWithSize(wantNode.width, wantNode.height);
        camera.targetTexture = texture;
        let nodeCanvas = null;
        let width = wantNode.width;
        let height = wantNode.height;
        nodeCanvas = document.createElement('canvas');
        nodeCanvas.width = width;
        nodeCanvas.height = height;
        let ctx = nodeCanvas.getContext('2d');
        camera.render(wantNode);
        let data = texture.readPixels();
        // write the render data
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }
        return nodeCanvas;
    }

    public static captureCanvas(wantNode: cc.Node) {
        let canvas = this.createCanvas(wantNode);
        let data = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            // destination file sizes
            destWidth: canvas.width,
            destHeight: canvas.height,
            fileType: 'png',
            quality: 1
        }
        // https://developers.weixin.qq.com/minigame/dev/api/render/canvas/Canvas.toTempFilePathSync.html
        let _tempFilePath = canvas.toTempFilePathSync(data);
        Logger.log(`Capture file success!${_tempFilePath}`);
        // https://developers.weixin.qq.com/minigame/dev/api/media/image/wx.previewImage.html
        wx.previewImage({
            urls: [_tempFilePath],
            success: (res) => {
                Logger.log('Preview image success.', res);
            },
            fail: (res) => {
                Logger.log('Preview image fail.', res);

            },
            complete: (res) => {
                Logger.log('Preview image complete.', res);
            }
        });
    }

}
