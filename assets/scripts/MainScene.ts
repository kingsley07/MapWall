
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Camera)
    mapCamera: cc.Camera = null;
    @property(cc.Camera)
    gameCamera: cc.Camera = null;
    @property(cc.Sprite)
    container: cc.Sprite = null;
    @property(cc.Node)
    walls: cc.Node = null;
    @property(cc.Node)
    avatar: cc.Node = null;

    private _renderTexture: cc.RenderTexture = null;
    private _walls: cc.Rect[] = []

    onLoad () {
        let walls = this.walls.children;
        for(let i = 0; i < walls.length; i++){
            this._walls[i] = walls[i].getBoundingBox();
        }
    }

    start () {
        this._renderTexture = new cc.RenderTexture();
        this._renderTexture.initWithSize(this.container.node.width, this.container.node.height);
        this.gameCamera.targetTexture = this._renderTexture;

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(this._renderTexture);
        this.container.spriteFrame = spriteFrame;
        console.log(this._renderTexture)
        this.avatar.position = this.mapCamera.node.position

    }
    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: cc.Touch){
    }

    private onTouchMove(event: cc.Touch){
        let beginPos = event.getPreviousLocation()
        let pos = event.getLocation()

        this.mapCamera.node.x -= pos.x - beginPos.x
        this.mapCamera.node.y -= pos.y - beginPos.y
        this.gameCamera.node.position = this.mapCamera.node.position
        this.container.node.position = this.mapCamera.node.position
        this.avatar.position = this.mapCamera.node.position
    }

    private onTouchEnd(event: cc.Touch){
    }

    protected update(dt: number): void {
        let count = 0;
        let rect = this.container.node.getBoundingBox();
        let material: cc.Material = this.container.getMaterial(0);
        for(let i = 0; i < this._walls.length; i++){
            if(rect.intersects(this._walls[i])){
                let minX = (this._walls[i].x - rect.x) / rect.width
                let minY = (this._walls[i].y - rect.y) / rect.height
                let maxX = (this._walls[i].xMax - rect.x) / rect.width
                let maxY = (this._walls[i].yMax - rect.y) / rect.height
                material.setProperty("wall" + count, new cc.Vec4(Math.max(0, minX), Math.max(0, minY), Math.min(1, maxX), Math.min(1, maxY)));
                count++;
            }
        }
        material.setProperty("wallCount", count);
    }
}
