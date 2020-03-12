import CommonTips from "../../../engine/uicomponent/CommonTips";
import EventManager, { HaoEvent } from "../../../engine/utils/EventManager";
import GameEvent from "../../config/GameEvent";
import MagicConfig from "../../config/MagicConfig";
import MaterialConfig from "../../config/MaterialConfig";
import MagicModel from "../../model/MagicModel";
import MaterialModel from "../../model/MaterialModel";
import PlayerInfo from "../../model/PlayerInfo";
import { PlayerSide } from "../../model/PlayerType";
import PlayerBase from "../../players/PlayerBase";
import ControlUI, { ControlUI_Event } from "../ControlUI";
import MagicPrefab from "../MagicPrefab";
import MaterialPrefab from "../MaterialPrefab";
import PlayerResourcePrefab from "../PlayerResourcePrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BookPlayer extends cc.Component {

    @property({ type: cc.Node })
    private playerContainer: cc.Node = null;

    @property({ type: cc.Node })
    private playerContainerDetail: cc.Node = null;

    @property({ type: cc.Node })
    private rightArrow: cc.Node = null;

    @property({ type: cc.Node })
    private leftArrow: cc.Node = null;

    @property({ type: cc.Label })
    private txtName: cc.Label = null;

    @property({ type: cc.Label })
    private txtLevel: cc.Label = null;

    @property({ type: cc.Label })
    private txtExp: cc.Label = null;

    @property({ type: cc.Label })
    private txtNowLife: cc.Label = null;

    @property({ type: cc.Label })
    private txtLife: cc.Label = null;

    @property({ type: cc.Label })
    private txtNowPower: cc.Label = null;

    @property({ type: cc.Label })
    private txtPower: cc.Label = null;

    @property({ type: cc.Label })
    private txtAttack: cc.Label = null;

    @property({ type: cc.Label })
    private txtDefend: cc.Label = null;

    @property({ type: cc.Label })
    private txtSpeed: cc.Label = null;

    @property({ type: cc.Node })
    private mainNode: cc.Node = null;

    @property({ type: cc.Node })
    private detailNode: cc.Node = null;

    @property({ type: cc.Node })
    private detailFinger: cc.Node = null;

    @property({ type: [cc.Node] })
    private detailItemList: Array<cc.Node> = [];

    @property({ type: cc.Label })
    private txtDetailMsg: cc.Label = null;

    private curPlayerIndex: number = 0;
    private nowPlayer: PlayerInfo;
    private isRightDetail: boolean = false;
    private leftFingleDetailIndex: number = 0;
    private rightFingleDetailIndex: number = 0;



    private leftDetailFinglePosition: Array<cc.Vec2> = [
        cc.v2(-410.092, 153.91),
        cc.v2(-410.092, 63.91),
    ]

    private rightDetailFinglePosition: Array<cc.Vec2> = [
        cc.v2(-188.776, 175.622),
        cc.v2(-188.776, 142.622),
        cc.v2(-188.776, 95.622),
        cc.v2(-188.776, 55.622),
        cc.v2(-188.776, 7.622),
        cc.v2(-188.776, -32.378),
        cc.v2(-188.776, -81.378),
        cc.v2(-188.776, -121.378),
    ]


    private playerInfo: PlayerInfo;

    onLoad() {
        EventManager.instance.addListener(ControlUI.Event_ControlUI, this.onControlUIEvent, this)
        this.nowPlayer = PlayerInfo.getPlayerInfoByIndex(this.curPlayerIndex)
        this.init(this.nowPlayer)
        this.mainNode.active = true;
        this.detailNode.active = false;
        this.refreshDetailMsg();
    }

    start() {
    }

    private init(playerInfo: PlayerInfo) {
        this.leftArrow.active = true;
        this.rightArrow.active = true;
        if (this.curPlayerIndex == 0) {
            this.leftArrow.active = false;
        }
        if (this.curPlayerIndex == PlayerInfo.modelList.length - 1) {
            this.rightArrow.active = false;
        }
        this.playerInfo = playerInfo;
        this.txtName.string = playerInfo.name;
        this.playerContainer.removeAllChildren();
        let playerPrefab: cc.Prefab = PlayerResourcePrefab.getPlayerPrefab(playerInfo.playerType);
        let playerNode: cc.Node = cc.instantiate(playerPrefab);
        this.playerContainer.addChild(playerNode)
        playerNode.setPosition(0, 0)
        playerNode.getComponent(PlayerBase).setSide(PlayerSide.Down)
        this.txtLevel.string = playerInfo.level + ""
        this.txtExp.string = playerInfo.exp + ""
        this.txtNowLife.string = playerInfo.life + ""
        this.txtLife.string = playerInfo.life + ""
        this.txtNowPower.string = playerInfo.power + ""
        this.txtPower.string = playerInfo.power + ""
        this.txtAttack.string = playerInfo.attack + ""
        this.txtDefend.string = playerInfo.defend + ''
        this.txtSpeed.string = playerInfo.speed + ""

        this.playerContainerDetail.removeAllChildren();
        let detailPlayer: cc.Node = cc.instantiate(playerPrefab);
        this.playerContainerDetail.addChild(detailPlayer)
        detailPlayer.setPosition(0, 0)
        detailPlayer.getComponent(PlayerBase).setSide(PlayerSide.Down)
        this.refreshDetailFingle();
    }

    private onClickLeftPlayer() {
        if (this.mainNode.active) {
            if (this.curPlayerIndex > 0) {
                this.curPlayerIndex--;
                this.nowPlayer = PlayerInfo.getPlayerInfoByIndex(this.curPlayerIndex)
                this.init(this.nowPlayer)
            }
        }
    }

    private onClickRightPlayer() {
        if (this.mainNode.active) {
            if (this.curPlayerIndex + 1 < PlayerInfo.modelList.length) {
                this.curPlayerIndex++;
                this.nowPlayer = PlayerInfo.getPlayerInfoByIndex(this.curPlayerIndex)
                this.init(this.nowPlayer)
            }
        }
    }

    private onControlUIEvent(event:HaoEvent,keyType: number) {
        if (!this.node.active) {
            return;
        }
        if (keyType == ControlUI_Event.B) {
            if (this.mainNode.active) {
                EventManager.instance.dispatchEvent(GameEvent.Event_Book_Back_Main);
            }
            this.backMain();
        } else if (keyType == ControlUI_Event.Left) {
            if (this.mainNode.active) {
                this.onClickLeftPlayer();
            } else if (this.detailNode.active) {
                if (this.isRightDetail) {
                    this.isRightDetail = false;
                    this.rightFingleDetailIndex = 0;
                    this.detailFinger.setPosition(this.leftDetailFinglePosition[this.leftFingleDetailIndex])
                    this.refreshDetailMsg();
                }
            }
        } else if (keyType == ControlUI_Event.Right) {
            if (this.mainNode.active) {
                this.onClickRightPlayer();
            } else if (this.detailNode.active) {
                if (!this.isRightDetail) {
                    this.isRightDetail = true;
                    this.rightFingleDetailIndex = 0;
                    this.refreshDetailFingle();
                    this.refreshDetailMsg();
                }
            }
        } else if (keyType == ControlUI_Event.A) {
            this.detailNode.active = true;
            this.mainNode.active = false;
            this.refreshDetailItems();
        } else if (keyType == ControlUI_Event.Up) {
            if (this.detailNode.active) {
                if (!this.isRightDetail) {
                    if (this.leftFingleDetailIndex > 0) {
                        this.leftFingleDetailIndex--;
                        this.detailFinger.setPosition(this.leftDetailFinglePosition[this.leftFingleDetailIndex])
                        this.refreshDetailFingle();
                        this.refreshDetailItems();
                    }
                } else {
                    if (this.rightFingleDetailIndex > 0) {
                        this.rightFingleDetailIndex--;
                        this.refreshDetailFingle();
                    }
                }
                this.refreshDetailMsg();
            }
        } else if (keyType == ControlUI_Event.Down) {
            if (this.detailNode.active) {
                if (!this.isRightDetail) {
                    if (this.leftFingleDetailIndex < this.leftDetailFinglePosition.length - 1) {
                        this.leftFingleDetailIndex++;
                        this.refreshDetailFingle();
                        this.refreshDetailItems();
                    }
                } else {
                    if ((this.leftFingleDetailIndex == 0 && this.rightFingleDetailIndex < this.playerInfo.bodyMaterial.length - 1)
                        || (this.leftFingleDetailIndex == 1 && this.rightFingleDetailIndex < this.playerInfo.magic.length - 1)) {
                        this.rightFingleDetailIndex++;
                        this.refreshDetailFingle();
                    }
                }
                this.refreshDetailMsg();
            }
        }
    }

    private backMain() {
        this.mainNode.active = true;
        this.detailNode.active = false;
        this.isRightDetail = false;
        this.leftFingleDetailIndex = 0;
        this.detailFinger.setPosition(this.leftDetailFinglePosition[this.leftFingleDetailIndex])
    }

    private refreshDetailFingle() {
        if (this.isRightDetail) {
            this.detailFinger.setPosition(this.rightDetailFinglePosition[this.rightFingleDetailIndex])
        } else {

            this.detailFinger.setPosition(this.leftDetailFinglePosition[this.leftFingleDetailIndex])
        }
    }

    private refreshDetailItems() {
        for (let i = 0; i < this.detailItemList.length; i++) {
            let detailItem: cc.Node = this.detailItemList[i];
            detailItem.active = false;
            let view: cc.Node = detailItem.getChildByName("view");
            let txtName: cc.Label = detailItem.getChildByName("txtName").getComponent(cc.Label);
            if (this.leftFingleDetailIndex == 0 && this.playerInfo.bodyMaterial[i] != null) {
                detailItem.active = true;
                let materialId: number = this.playerInfo.bodyMaterial[i];
                let mateiral: MaterialModel = MaterialConfig.getMaterialById(materialId);
                view.getComponent(cc.Sprite).spriteFrame = MaterialPrefab.getMaterialView(mateiral.id);
                txtName.string = mateiral.name;
            }
            else if (this.leftFingleDetailIndex == 1 && this.playerInfo.magic[i] != null) {
                detailItem.active = true;
                let magicId: number = this.playerInfo.magic[i];
                let magic: MagicModel = MagicConfig.getMagicById(magicId);
                view.getComponent(cc.Sprite).spriteFrame = MagicPrefab.getMagicView(magic.id);
                txtName.string = magic.name;
            }
        }
    }

    private refreshDetailMsg() {
        this.txtDetailMsg.string = "";
        if (this.isRightDetail) {
            if (this.leftFingleDetailIndex == 0) {
                let materialId: number = this.playerInfo.bodyMaterial[this.rightFingleDetailIndex];
                let mateiral: MaterialModel = MaterialConfig.getMaterialById(materialId);
                if (mateiral) {
                    this.txtDetailMsg.string = mateiral.desc;
                }
            } else if (this.leftFingleDetailIndex == 1) {
                let magicId: number = this.playerInfo.magic[this.rightFingleDetailIndex];
                let magic: MagicModel = MagicConfig.getMagicById(magicId);
                if (magic) {
                    this.txtDetailMsg.string = magic.desc;
                }
            }
        }
    }

    private onClickNextPage() {
        CommonTips.showMsg("下一页")
    }

    onDestroy() {
        EventManager.instance.removeListener(ControlUI.Event_ControlUI, this.onControlUIEvent)
    }

}
