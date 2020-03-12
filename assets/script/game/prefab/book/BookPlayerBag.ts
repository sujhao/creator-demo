import EventManager, { HaoEvent } from "../../../engine/utils/EventManager";
import GameEvent from "../../config/GameEvent";
import MaterialConfig from "../../config/MaterialConfig";
import BagModel from "../../model/BagModel";
import MaterialModel from "../../model/MaterialModel";
import PlayerInfo from "../../model/PlayerInfo";
import { PlayerSide } from "../../model/PlayerType";
import PlayerBase from "../../players/PlayerBase";
import ControlUI, { ControlUI_Event } from "../ControlUI";
import MaterialPrefab from "../MaterialPrefab";
import PlayerResourcePrefab from "../PlayerResourcePrefab";
import { Logger } from "../../../engine/utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BookPlayerBag extends cc.Component {

    @property({ type: cc.Node })
    private fingle: cc.Node = null;

    @property({ type: cc.ScrollView })
    private scrollView: cc.ScrollView = null;

    @property({ type: cc.Node })
    private itemList: Array<cc.Node> = [];

    @property({ type: cc.Node })
    private main: cc.Node = null;

    @property({ type: cc.Node })
    private detail: cc.Node = null;

    @property({ type: cc.Node })
    private playerContainer: cc.Node = null;

    @property({ type: cc.Label })
    private txtDetailMsg: cc.Label = null;

    @property({ type: cc.Node })
    private detailBagList: Array<cc.Node> = []

    private fingleLocation: Array<cc.Vec2> = [
        cc.v2(-304.077, 155.701),
        cc.v2(25.923, 155.701),
    ];

    private playerInitP: cc.Vec2 = cc.v2(-384, 46);

    private playerXSpace: number = 210;
    private playerYSpace: number = 28;


    private isPlayerFingle: boolean = false;

    private topIndex: number = 0; //0：装备 1：卸载

    private playerIndex: number = 0; //装备或卸载玩家


    private isDetail: boolean = false; //是否二级面板
    private isDetailLeft: boolean = true; //是否二级面板的左边
    private detailIndex: number = 0; //左边Index
    private startDetailMaterialIndex: number = 0; //左边开始index
    private detailLeftFingleLocation: Array<cc.Vec2> = [ //左边手指位置
        cc.v2(-388, 170),
        cc.v2(-388, 115),
        cc.v2(-388, 59),
        cc.v2(-388, 5),
        cc.v2(-388, -52),
        cc.v2(-388, -107),
    ];

    private detailRightFingleLocation: Array<cc.Vec2> = [
        cc.v2(143.718, 143.718),
        cc.v2(62.718, 110.144),
        cc.v2(23.718, 30.144),
        cc.v2(63.718, -55.856),
        cc.v2(142.718, -105.856),
        cc.v2(229.718, -55.856),
        cc.v2(280.718, 27.144),
        cc.v2(230.718, 104.144),
    ];

    onLoad() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.reInit();
    }

    private reInit() {
        this.scrollView.content.removeAllChildren();
        for (let i = 0; i < PlayerInfo.modelList.length; i++) {
            let p: PlayerInfo = PlayerInfo.modelList[i];
            let playerPrefab: cc.Prefab = PlayerResourcePrefab.getPlayerPrefab(p.playerType);
            let playerNode: cc.Node = cc.instantiate(playerPrefab);
            this.scrollView.content.addChild(playerNode)
            playerNode.getComponent(PlayerBase).setSide(PlayerSide.Down)
        }
        this.refreshPlayerFingle();
    }


    private equipItem() {
        let playerInfo: PlayerInfo = PlayerInfo.modelList[this.playerIndex];
        let bagIndex: number = this.detailIndex + this.startDetailMaterialIndex;
        let bagModel: BagModel = BagModel.modelList[bagIndex]
        if (bagModel) {
            for (let i = 0; i < this.itemList.length; i++) {
                if (playerInfo.bodyMaterial[i] == null) {
                    playerInfo.bodyMaterial[i] = bagModel.materialId;
                    BagModel.useOne(bagModel.materialId)
                    return true;
                }
            }
        }
        return false;
    }

    private unEquipItem() {
        let playerInfo: PlayerInfo = PlayerInfo.modelList[this.playerIndex];
        if (playerInfo.bodyMaterial[this.detailIndex] != null) {
            playerInfo.bodyMaterial[this.detailIndex] = null;
            BagModel.addOne(playerInfo.bodyMaterial[this.detailIndex])
            return true;
        }

    }

    private onControlUIEvent(event:HaoEvent,keyType: number) {
        if (!this.node.active) {
            return;
        }
        if (keyType == ControlUI_Event.B) {
            if (this.isDetail) { //子面板
                this.isDetail = false;
                this.refreshPlayerFingle();
            } else { //父面板
                if (!this.isPlayerFingle) { //回到主面板
                    EventManager.instance.dispatchEvent(GameEvent.Event_Book_Back_Main);
                } else { //回到装备或者卸载
                    this.isPlayerFingle = false;
                    this.refreshPlayerFingle();
                }
            }
        } else if (keyType == ControlUI_Event.A) {
            if (this.isDetail) {
                if (this.isDetailLeft) {
                    let equipOk: boolean = this.equipItem();
                    if (equipOk) {
                        this.initLeftDetail();
                        this.initRightDetail();
                    }
                } else {
                    let unEquipOk: boolean = this.unEquipItem();
                    if (unEquipOk) {
                        this.initLeftDetail();
                        this.initRightDetail();
                    }
                }
            } else {
                if (!this.isPlayerFingle) {
                    this.isPlayerFingle = true;
                    this.playerIndex = 0;
                    this.refreshPlayerFingle();
                } else { //进入二级面板
                    this.initDetailPlayer();
                }
            }
        }
        else if (keyType == ControlUI_Event.Left) {
            this.onClickPre();
        } else if (keyType == ControlUI_Event.Right) {
            this.onClickNext();
        } else if (keyType == ControlUI_Event.Up) {
            this.onClickPre();
        } else if (keyType == ControlUI_Event.Down) {
            this.onClickNext();
        }
    }

    private onClickPre() {
        if (this.isDetail) {
            if (this.isDetailLeft) {
                if (this.startDetailMaterialIndex > 0 || this.detailIndex > 0) {
                    this.detailIndex--;
                    if (this.detailIndex < 0) {
                        this.startDetailMaterialIndex--;
                        this.detailIndex = 0;
                        this.initLeftDetail();
                    }
                    this.refreshPlayerFingle();
                }
            } else {
                this.detailIndex--;
                if (this.detailIndex < 0) {
                    this.detailIndex = this.itemList.length - 1;
                }
                this.refreshPlayerFingle();
            }
        } else {
            if (this.isPlayerFingle) {
                if (this.playerIndex > 0) {
                    this.playerIndex--;
                    this.refreshPlayerFingle();
                }
            } else {
                if (this.topIndex > 0) {
                    this.topIndex--;
                    this.refreshPlayerFingle();
                }
            }
        }
    }

    private onClickNext() {
        if (this.isDetail) {
            if (this.isDetailLeft) {
                if (this.startDetailMaterialIndex < BagModel.modelList.length - 1 || this.detailIndex < this.detailBagList.length - 1) {
                    this.detailIndex++;
                    if (this.detailIndex >= this.detailBagList.length) {
                        this.detailIndex--;
                        if (this.startDetailMaterialIndex+this.detailIndex < BagModel.modelList.length - 1) {
                            this.startDetailMaterialIndex++;
                            this.initLeftDetail();
                        }
                    }
                    this.refreshPlayerFingle();
                }
            } else {
                this.detailIndex++;
                if (this.detailIndex >= this.itemList.length - 1) {
                    this.detailIndex = 0;
                }
                this.refreshPlayerFingle();
            }

        } else {
            if (this.isPlayerFingle) {
                if (this.playerIndex < PlayerInfo.modelList.length - 1) {
                    this.playerIndex++;
                    this.refreshPlayerFingle();
                }
            } else {
                if (this.topIndex < 1) {
                    this.topIndex++;
                    this.refreshPlayerFingle();
                }
            }
        }
    }

    private initDetailPlayer() {
        this.isDetail = true;
        if (this.topIndex == 0) {
            this.isDetailLeft = true;
        } else {
            this.isDetailLeft = false;
        }
        this.startDetailMaterialIndex = 0;
        this.detailIndex = 0;
        let playerInfo: PlayerInfo = PlayerInfo.modelList[this.playerIndex];
        this.playerContainer.removeAllChildren();
        let playerPrefab: cc.Prefab = PlayerResourcePrefab.getPlayerPrefab(playerInfo.playerType);
        let playerNode: cc.Node = cc.instantiate(playerPrefab);
        playerNode.setScale(1.5)
        this.playerContainer.addChild(playerNode)
        playerNode.setPosition(0, 0)
        playerNode.getComponent(PlayerBase).setSide(PlayerSide.Down)
        this.initRightDetail();
        this.initLeftDetail();
        this.refreshPlayerFingle();
    }

    private initRightDetail() {
        this.startDetailMaterialIndex = 0;
        let playerInfo: PlayerInfo = PlayerInfo.modelList[this.playerIndex];
        for (let i = 0; i < this.itemList.length; i++) {
            let view: cc.Sprite = this.itemList[i].getChildByName("view").getComponent(cc.Sprite)
            if (playerInfo.bodyMaterial[i] != null) {
                view.node.active = true;
                let materialId: number = playerInfo.bodyMaterial[i];
                let mateiral: MaterialModel = MaterialConfig.getMaterialById(materialId);
                view.getComponent(cc.Sprite).spriteFrame = MaterialPrefab.getMaterialView(mateiral.id);
            } else {
                view.node.active = false;
            }
        }
    }

    private initLeftDetail() {
        this.startDetailMaterialIndex = 0;
        for (let i = 0; i < this.detailBagList.length; i++) {
            let detailBag: cc.Node = this.detailBagList[i];
            let bagIndex: number = this.startDetailMaterialIndex + i;
            let bagModel: BagModel = BagModel.modelList[bagIndex]
            if (bagModel) {
                detailBag.active = true;
                let view: cc.Sprite = detailBag.getChildByName("view").getComponent(cc.Sprite);
                let mateiral: MaterialModel = MaterialConfig.getMaterialById(bagModel.materialId);
                view.spriteFrame = MaterialPrefab.getMaterialView(mateiral.id);
                let txtName: cc.Label = detailBag.getChildByName("txtName").getComponent(cc.Label);
                txtName.string = mateiral.name;
                let txtNum: cc.Label = detailBag.getChildByName("txtNum").getComponent(cc.Label);
                txtNum.string = "" + bagModel.materialNum;
            } else {
                detailBag.active = false;
            }
        }
    }


    private refreshPlayerFingle() {
        this.txtDetailMsg.string = ""
        if (!this.isDetail) {
            this.main.active = true;
            this.detail.active = false;
            if (this.isPlayerFingle) {
                this.scrollView.node.active = true;
                let oneRowNum: number = 4;
                let row: number = Math.floor(this.playerIndex / oneRowNum);
                let col: number = this.playerIndex % oneRowNum;
                let tx: number = this.playerXSpace * col + this.playerInitP.x;
                let ty: number = this.playerYSpace * row + this.playerInitP.y;
                this.fingle.setPosition(tx, ty);
            } else {
                this.fingle.setPosition(this.fingleLocation[this.topIndex])
                this.scrollView.node.active = false;
            }
        } else {
            this.main.active = false;
            this.detail.active = true;
            if (this.isDetailLeft) {
                this.fingle.setPosition(this.detailLeftFingleLocation[this.detailIndex])
                let bagIndex: number = this.detailIndex + this.startDetailMaterialIndex;
                let bagModel: BagModel = BagModel.modelList[bagIndex]
                if (bagModel) {
                    let materialModel: MaterialModel = MaterialConfig.getMaterialById(bagModel.materialId)
                    this.txtDetailMsg.string = materialModel.desc
                }
            } else {
                this.fingle.setPosition(this.detailRightFingleLocation[this.detailIndex])
                let playerInfo: PlayerInfo = PlayerInfo.modelList[this.playerIndex];
                if (playerInfo.bodyMaterial[this.detailIndex] != null) {
                    let materialModel: MaterialModel = MaterialConfig.getMaterialById(playerInfo.bodyMaterial[this.detailIndex])
                    this.txtDetailMsg.string = materialModel.desc
                }
            }
        }
    }

    onDestroy() {
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }
}
