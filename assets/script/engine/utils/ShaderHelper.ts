import ShaderMaterialPrefab from "../../game/prefab/ShaderMaterialPrefab";
import { Logger } from "./Logger";

export default class ShaderHelper {

    /**
     * 清除所有shader
     * @param showNode 
     * @param material 
     */
    public static clearAllEffect(showNode: cc.Node, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).default) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            renderComponent.setMaterial(0, material)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                renderComponent.setMaterial(0, material)
            });
        });
    }


    /**
     * 设置图片灰白程度
     * @param showNode 
     * @param material 
     * @param grayLevel  [0.0, 1.0]
     */
    public static setGrayEffect(showNode: cc.Node, grayLevel: number = 1, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).grayMaterial) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
            materialVariant.setProperty("grayLevel", grayLevel);
            renderComponent.setMaterial(0, materialVariant)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
                materialVariant.setProperty("grayLevel", grayLevel);
                renderComponent.setMaterial(0, materialVariant)
            });
        });
    }


    /**
     * 播放变灰过程动画
     */
    public static showGrayMv(showNode: cc.Node) {
        let grayValue: number = 0.5;
        let intervalId = setInterval(() => {
            grayValue += 0.01;
            if (grayValue >= 1) {
                grayValue = 1;
                clearInterval(intervalId)
            }
            if (showNode) {
                ShaderHelper.setGrayEffect(showNode, grayValue)
            }
        }, 1)
    }


    /**
     * 设置图片老化
     * @param showNode 
     * @param grayLevel  [0.0, 1.0]
     * @param material 
     */
    public static setOldPhotoEffect(showNode: cc.Node, grayLevel: number = 1, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).oldPhoto) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
            materialVariant.setProperty("oldLevel", grayLevel);
            renderComponent.setMaterial(0, materialVariant)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
                materialVariant.setProperty("oldLevel", grayLevel);
                renderComponent.setMaterial(0, materialVariant)
            });
        });
    }


    /**
     * 播放变灰过程动画
     */
    public static showOldPhotoMv(showNode: cc.Node) {
        let grayValue: number = 0;
        let intervalId = setInterval(() => {
            grayValue += 0.01;
            if (grayValue >= 1) {
                grayValue = 1;
                clearInterval(intervalId)
            }
            if (showNode) {
                ShaderHelper.setOldPhotoEffect(showNode, grayValue)
            }
        }, 1)
    }


    /**
    * 增加内发光特效
    * showNode:要增加特效的节点或者他的子节点
    * material:发光特效材质 
    * materialParam: {}
    * materialParam.glowColor:cc.v4(r,g,b,a)  颜色rbga值的结构体
    * materialParam.glowColorSize:这里为约束一下值发光宽度值在 [0.0, 0.1] 因为 0.1+ 之后的效果可能不明显，也可以自己尝试修改,个人测试感觉0.01效果最佳
    * materialParam.glowThreshold:这里为约束一下值发光阈值值在 [0.0, 0.5] 因为 0.5+ 之后的效果可能就是其他效果，个人感觉0.1效果最佳
    */
    public static setGlowInner(showNode: cc.Node, materialParam: any, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).glowInner) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
            materialVariant.setProperty("glowColor", materialParam.glowColor);
            materialVariant.setProperty("glowColorSize", materialParam.glowColorSize);
            materialVariant.setProperty("glowThreshold", materialParam.glowThreshold);
            renderComponent.setMaterial(0, materialVariant)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
                materialVariant.setProperty("glowColor", materialParam.glowColor);
                materialVariant.setProperty("glowColorSize", materialParam.glowColorSize);
                materialVariant.setProperty("glowThreshold", materialParam.glowThreshold);
                renderComponent.setMaterial(0, materialVariant)
            });
        });
    }

    /**
     * 设置不同颜色的发光
     * @param showNode 
     * @param color 
     */
    public static setCommonGlowInner(showNode: cc.Node, color: cc.Color = cc.Color.WHITE) {
        this.setGlowInner(showNode, { "glowColor": color, "glowColorSize": 0.015, "glowThreshold": 0.1 })
    }



    /**
     * 播放被攻击闪烁过程动画
     */
    public static showGreenHatFlash(showNode: cc.Node, callback: Function, totalFlashTimes: number = 1, color: cc.Color = cc.Color.GREEN) {
        let timeCount: number = 0;
        let intervalId = setInterval(() => {
            timeCount += 1;
            // let value:number = timeCount*0.01;
            let greenValue:number =  0.08 * timeCount + 0.05;
            Logger.log("showGreenHatFlash====", timeCount, greenValue)
            ShaderHelper.setGlowInner(showNode, { "glowColor": cc.Color.GREEN, "glowColorSize":greenValue, "glowThreshold": 0.1 });
            if(timeCount >= 12){
                clearInterval(intervalId);
                callback && callback();
            }
        }, 2000/12)
    }


    /**
     * 播放被攻击闪烁过程动画
     */
    public static showFlash(showNode: cc.Node, totalFlashTimes: number = 1, color: cc.Color = cc.Color.GREEN) {
        let timeCount: number = 0;
        // let color: cc.Color = cc.Color.WHITE;
        let flashTimes: number = 0;
        let intervalId = setInterval(() => {
            timeCount += 1;
            if (timeCount % 50 == 0) {
                let tempCount: number = timeCount / 50;
                if (tempCount % 2 == 0) {
                    color.setA(100)
                    this.setGlowInner(showNode, { "glowColor": color, "glowColorSize": 0.1, "glowThreshold": 0 })
                } else {
                    flashTimes++;
                    this.setGlowInner(showNode, { "glowColor": color, "glowColorSize": 0, "glowThreshold": 0 })
                    if (flashTimes > totalFlashTimes) {
                        clearInterval(intervalId)
                    }
                }
            }
        }, 1)
    }

    /**
     * 马赛克
     * @param showNode 
     * @param materialParam 
     * @param material 
     */
    public static setMosaic(showNode: cc.Node, materialParam: any, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).mosaic) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
            materialVariant.setProperty("xBlockCount", materialParam.xBlockCount);
            materialVariant.setProperty("yBlockCount", materialParam.yBlockCount);
            renderComponent.setMaterial(0, materialVariant)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
                materialVariant.setProperty("xBlockCount", materialParam.xBlockCount);
                materialVariant.setProperty("yBlockCount", materialParam.yBlockCount);
                renderComponent.setMaterial(0, materialVariant)
            });
        });
    }


    /**
   * 播放被攻击闪烁过程动画
   */
    public static showMosaicMv(showNode: cc.Node, callback: Function = null) {
        let masaicTimes: number = 50;
        let intervalId = setInterval(() => {
            masaicTimes -= 2;
            this.setMosaic(showNode, { "xBlockCount": masaicTimes, "yBlockCount": masaicTimes })
            if (masaicTimes <= 0) {
                clearInterval(intervalId)
                if (callback) {
                    callback();
                }
            }
        }, 80)
    }

    /**
     * 设置圆角剪切
     * @param showNode 
     * @param roundCornerRadius [0, 1] 
     */
    public static setRoundCornerCrop(showNode: cc.Node, roundCornerRadius: number = 0.1, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).roundCornerCrop) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
            materialVariant.setProperty("xRadius", roundCornerRadius);
            materialVariant.setProperty("yRadius", roundCornerRadius);
            renderComponent.setMaterial(0, materialVariant)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
                materialVariant.setProperty("xRadius", roundCornerRadius);
                materialVariant.setProperty("yRadius", roundCornerRadius);
                renderComponent.setMaterial(0, materialVariant)
            });
        });
    }

    /**
     * 设置闪光
     * @param showNode 
     * @param lightColor  光颜色
     * @param lightWidth 光的宽度
     * @param lightAngle 光的角度
     * @param enableGradient 
     * @param cropAlpha 
     * @param enableFog 
     * @param material 
     */
    public static setFlashLight(showNode: cc.Node, lightColor: cc.Color, lightWidth: number, lightAngle: number = 0, enableGradient: boolean = true, cropAlpha: boolean = true, enableFog: boolean = false, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).flashLight) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
            materialVariant.setProperty("lightColor", lightColor);
            materialVariant.setProperty("lightWidth", lightWidth);
            materialVariant.setProperty("lightAngle", lightAngle);
            materialVariant.setProperty("enableGradient", enableGradient);
            materialVariant.setProperty("cropAlpha", cropAlpha);
            materialVariant.setProperty("enableFog", enableFog);
            renderComponent.setMaterial(0, materialVariant)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
                materialVariant.setProperty("lightColor", lightColor);
                materialVariant.setProperty("lightWidth", lightWidth);
                materialVariant.setProperty("lightAngle", lightAngle);
                materialVariant.setProperty("enableGradient", enableGradient);
                materialVariant.setProperty("cropAlpha", cropAlpha);
                materialVariant.setProperty("enableFog", enableFog);
                renderComponent.setMaterial(0, materialVariant)
            });
        });
    }

    /**
     * 玩家升级shader动画
     * @param showNode 
     * @param callback 
     */
    public static showFlashLightMv(showNode: cc.Node, callback: Function = null) {
        let nowClor: cc.Color = cc.color(0, 0, 0, 255);
        let colorIndex: number = 0;
        let lightAngle: number = 0;
        let intervalId = setInterval(() => {
            if (colorIndex == 0) {
                nowClor.setR(nowClor.getR() + 2)
                if (nowClor.getR() >= 255) {
                    colorIndex += 1;
                }
            } else if (colorIndex == 1) {
                nowClor.setG(nowClor.getG() + 2)
                if (nowClor.getG() >= 255) {
                    colorIndex += 1;
                }
            } else {
                nowClor.setB(nowClor.getB() + 2)
                if (nowClor.getB() >= 255) {
                    clearInterval(intervalId)
                    ShaderHelper.clearAllEffect(showNode)
                    if (callback) {
                        callback();
                    }
                    return;
                }
            }
            lightAngle += 1;
            this.setFlashLight(showNode, nowClor, 1, lightAngle);
        }, 1)
    }


    public static setFlag(showNode: cc.Node, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).flag) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            renderComponent.setMaterial(0, material)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                renderComponent.setMaterial(0, material)
            });
        });
    }

    /**
     * 设置高斯模糊
     * @param showNode 
     * @param material 
     */
    public static setGaussian(showNode: cc.Node, material: cc.Material = ShaderMaterialPrefab.instance.getComponent(ShaderMaterialPrefab).gaussian) {
        showNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
            let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
            materialVariant.setProperty("textureSize", cc.v2(renderComponent.node.width, renderComponent.node.height));
            renderComponent.setMaterial(0, materialVariant)
        });
        showNode.children.forEach(childNode => {
            childNode.getComponents(cc.RenderComponent).forEach((renderComponent: cc.RenderComponent) => {
                let materialVariant:cc.MaterialVariant = cc.MaterialVariant.create(material, renderComponent);
                materialVariant.setProperty("textureSize", cc.v2(renderComponent.node.width, renderComponent.node.height));
                renderComponent.setMaterial(0, materialVariant)
            });
        });
    }
}