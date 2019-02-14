class ChatScene extends eui.Component implements eui.UIComponent {
   public btn_send: eui.Button;
   public et_input: eui.EditableText;
   public sc_view: eui.Scroller;
   public gp_view: eui.Group;

   private socket: egret.WebSocket;
   private lastLabel: eui.Label;

   public constructor() {
      super();
   }

   protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
   }


   protected childrenCreated(): void {
      super.childrenCreated();

      this.initWebsocket();

      this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
         let str = this.et_input.text.trim();
         if (str === null || str === '' || str==='请输入文字...') {
            return;
         }
         this.socket.writeUTF(str);
         this.socket.flush();
         this.et_input.text = '';
      }, this);
      this.et_input.addEventListener(egret.Event.FOCUS_IN, this.clearDefaultText, this);
      // let timer = new egret.Timer(1000, 0);
      // timer.addEventListener(egret.TimerEvent.TIMER, () => {
      //    this.addMsg(`${Math.random()}`);
      // }, this);
      // timer.start();
   }

   private clearDefaultText() {
      this.et_input.removeEventListener(egret.Event.FOCUS_IN, this.clearDefaultText, this);
      this.et_input.text = '';
   }

   private initWebsocket() {
      this.socket = new egret.WebSocket();
      this.socket.addEventListener(egret.Event.CONNECT, () => {
         this.addMsg('server connected');
      }, this);
      this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, () => {
         let msg: string = this.socket.readUTF();
         this.addMsg(msg);
      }, this);
      this.socket.connect('localhost', 8888);
   }

   private addMsg(msg: string) {
      let newLabel: eui.Label = new eui.Label();
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
   }

}
