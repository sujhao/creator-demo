import { Logger } from "./Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CaptureHelper {

    public static captureNode(wantNode: cc.Node) {
        // let temp
        // let tempAnchor: cc.Vec2 = wantNode.getAnchorPoint()
        let camera: cc.Camera = wantNode.addComponent(cc.Camera);
        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;
        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样        camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        // texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        texture.initWithSize(wantNode.width, wantNode.height);
        camera.targetTexture = texture;
        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        camera.render(wantNode);
        let textureData: Uint8Array = new Uint8Array(wantNode.width * wantNode.height * 4);
        texture.readPixels(textureData);
        let picData: Uint8Array = this.filpYImage(textureData, texture.width, texture.height);
        return picData
    }

    private static filpYImage(data: Uint8Array, width: number, height: number) {
        // create the data array
        let picData: Uint8Array = new Uint8Array(width * height * 4);
        let rowBytes: number = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }
        return picData;
    }

    public static saveDataToFile(picData: Uint8Array, width: number, height: number, filePath: string) {
        if (cc.sys.isNative) {
            let success = jsb.saveImageData(picData, width, height, filePath)
            if (success) {
                // Logger.log("saveDataToFile success, file: " + filePath);
            }
        }
        else if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this;
            let data = {
                x: 0,
                y: 0,
                width: width,
                height: height,
                // destination file sizes
                destWidth: width,
                destHeight: height,
                fileType: 'png',
                quality: 1
            }
            // https://developers.weixin.qq.com/minigame/dev/api/render/canvas/Canvas.toTempFilePathSync.html
            // let _tempFilePath = picData.toTempFilePathSync(data);
            // Logger.log(`Capture file success!${_tempFilePath}`);
            // self.label.string = '图片加载完成，等待本地预览';
            // https://developers.weixin.qq.com/minigame/dev/api/media/image/wx.previewImage.html
            // wx.previewImage({
            //     urls: [_tempFilePath],
            //     success: (res) => {
            //         cc.log('Preview image success.');
            //         self.label.string = '';
            //     }
            // });
        }
    }

    public static showBase64Img(base64StrImg: string, sprite: cc.Sprite) {
        let img = new Image();
        img.src = base64StrImg
        let texture = new cc.Texture2D();
        texture.initWithElement(img);
        texture.handleLoadedTexture();
        sprite.spriteFrame = new cc.SpriteFrame(texture);
    }


    public static loadAndShowLocalPic(picPath: string, picView: cc.Sprite) {
        cc.loader.load(picPath, (err, loadedTexture: cc.Texture2D) => {
            if (!err) {
                picView.spriteFrame = new cc.SpriteFrame(loadedTexture);
                picView.node.width = picView.node.width;
                picView.node.height = picView.node.height
            }
            else {
                Logger.warn("loadAndShowLocalPic error=", err);
            }
        });
    }

}
