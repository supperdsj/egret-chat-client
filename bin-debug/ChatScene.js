var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ChatScene = (function (_super) {
    __extends(ChatScene, _super);
    function ChatScene() {
        return _super.call(this) || this;
    }
    ChatScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    ChatScene.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.initWebsocket();
        this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var str = _this.et_input.text.trim();
            if (str === null || str === '' || str === '请输入文字...') {
                return;
            }
            _this.socket.writeUTF(str);
            _this.socket.flush();
            _this.et_input.text = '';
        }, this);
        this.et_input.addEventListener(egret.Event.FOCUS_IN, this.clearDefaultText, this);
        // let timer = new egret.Timer(1000, 0);
        // timer.addEventListener(egret.TimerEvent.TIMER, () => {
        //    this.addMsg(`${Math.random()}`);
        // }, this);
        // timer.start();
    };
    ChatScene.prototype.clearDefaultText = function () {
        this.et_input.removeEventListener(egret.Event.FOCUS_IN, this.clearDefaultText, this);
        this.et_input.text = '';
    };
    ChatScene.prototype.initWebsocket = function () {
        var _this = this;
        this.socket = new egret.WebSocket();
        this.socket.addEventListener(egret.Event.CONNECT, function () {
            _this.addMsg('server connected');
        }, this);
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, function () {
            var msg = _this.socket.readUTF();
            _this.addMsg(msg);
        }, this);
        this.socket.connect('localhost', 8888);
    };
    ChatScene.prototype.addMsg = function (msg) {
        var newLabel = new eui.Label();
        newLabel.width = this.sc_view.width - 25 * 2;
        newLabel.text = msg;
        newLabel.x = 25;
        newLabel.y = this.lastLabel ? (this.lastLabel.y + this.lastLabel.height + 20) : 0;
        newLabel.textColor = 0x61e5f4;
        newLabel.textAlign = 'lef';
        this.gp_view.addChild(newLabel);
        if (newLabel.y + newLabel.height > this.sc_view.height) {
            this.sc_view.viewport.scrollV = newLabel.y + newLabel.height - this.sc_view.height;
        }
        this.lastLabel = newLabel;
    };
    return ChatScene;
}(eui.Component));
__reflect(ChatScene.prototype, "ChatScene", ["eui.UIComponent", "egret.DisplayObject"]);
