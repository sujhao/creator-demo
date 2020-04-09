import { Logger } from "./Logger";

export default class ImageHelper {


    public static loadAndShowHttpPic(picUrl: string, picView: cc.Sprite, picWidth: number = 200, picHeight: number = 200) {
        cc.loader.load(picUrl, (err, loadedTexture: cc.Texture2D) => {
            if (!err) {
                picView.spriteFrame = new cc.SpriteFrame(loadedTexture);
                if (loadedTexture.width >= loadedTexture.height) { //拉伸高
                    picView.node.width = picWidth
                    picView.node.height = (picWidth / loadedTexture.width) * loadedTexture.height
                    Logger.info("拉伸高 =", picUrl, loadedTexture.width, loadedTexture.height, picView.node.width, picView.node.height, picWidth, picHeight);
                } else { //拉伸宽
                    picView.node.width = (picHeight / loadedTexture.height) * loadedTexture.width;
                    picView.node.height = picHeight;
                    Logger.info("拉伸宽 =", picUrl, loadedTexture.width, loadedTexture.height, picView.node.width, picView.node.height, picWidth, picHeight);
                }
            }
            else {
                Logger.warn("loadAndShowLocalPic err=", err);
            }
        });
    }

}