// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>auto_deploy</h2>
    <ui-button  id="listBtn" style="width:120px">选择目录</ui-button >
    <br/>
    <span id="lab"></span>
    <br/><br/>
    <ui-input id="editBox" placeholder="提交日志"></ui-input>
    <br/>
    <ui-button id="btn">构建发布</ui-button>
    <input type="file" id="file_input" style="display:none;" webkitdirectory directory />
  `,

  // element and variable binding
  $: {
    btn: '#btn',
    file_input:"#file_input",
    listBtn:'#listBtn',
    editBox:'#editBox',
    lab:'#lab'
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {

    Editor.Ipc.sendToMain('auto_deploy:ready');
    
    Editor.Ipc.sendToMain('auto_deploy:enginePath');
    
    this.$btn.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('auto_deploy:clicked');
    });

    this.$file_input.addEventListener('change', (e) => {
      let path = e.target.files[0].path
      Editor.Ipc.sendToMain('auto_deploy:distPath', path);
      this.$lab.innerHTML = path;
    });

    this.$editBox.addEventListener('confirm', (e) => {
      Editor.Ipc.sendToMain('auto_deploy:gitLog', this.$editBox.value);
    });

    this.$listBtn.addEventListener('click', (e) => {
      this.$file_input.click();
    });
  },

  // register your ipc messages here
  messages: {
    'defaultDistPath' (arg1, arg2) {
      // Editor.log('收到消息', arg2)
      this.$lab.innerHTML = arg2;
    },
  }
});