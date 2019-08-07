'use strict';
var fs = require('fs')
var childProcess = require('child_process')
var process = require('process');

//courseware中对应该课件的目录
var CoursewarePath = ''
var GitLog = "CC plugin auto_deploy commit automatically."
var EnginePath = ''

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('auto_deploy');
    },
    //接收windows环境变量中Creator安装地址
    'enginePath'() {
      Editor.log("enginePath Function")
      EnginePath = process.env.CocosCreator
      Editor.log(EnginePath)
    },
    //panel界面准备完毕
    'ready'() {
      Editor.Ipc.sendToPanel('auto_deploy', 'defaultDistPath', CoursewarePath);
    },
    //设置发布路径
    'distPath'(arg1, arg2) {
      // Editor.log('收到消息', arg2)
      CoursewarePath = arg2;
      if(!Editor.isDarwin) {
        CoursewarePath = CoursewarePath.replace(/\\/g, "\\\\");
      }
      
      let scriptPath = __dirname + "/main.js";
      let script = fs.readFileSync(scriptPath, 'utf8');
      script = script.replace("var CoursewarePath = ''", "var CoursewarePath = " + "'" + CoursewarePath + "'");
      fs.writeFileSync(scriptPath, script);
    },
    //git 日志
    'gitLog'(arg1, arg2) {
      // Editor.log('收到消息', arg2)
      GitLog = "\"" + arg2 + "\"";
    },
    //构建发布
    'clicked'() {
      if (CoursewarePath == '') {
        Editor.Dialog.messageBox({
          type: 'warning',
          message: '请先选择发布目录'
        })
        return
      }

      cleanBuildDir(true, () => {
        cleanBuildDir(false, () => {
          modifyScript(true, () => {
            buildWebMobile(true, () => {
              modifyScript(false, () => {
                buildWebMobile(false, () => {
                  cleanCoursewarDir()
                })
              })
            })
          })
        })
      })
    }
  },
};

function cleanBuildDir(isTeacher, cbk) {
  let path = isTeacher ? Editor.Project.path + '/build/teacher' : Editor.Project.path + '/build/student'
  tryDeleteDir(path, cbk)
}

function tryDeleteDir(dir, cbk) {
  fs.exists(dir, (exist) => {
    if (exist) {
      Editor.log('删除目录 ' + dir)
      deleteFolderRecursive(dir)
    }
    cbk()
  })
}


function modifyScript(isTeacher, cbk) {
  Editor.log('设置ConstValue.ts ...', isTeacher ? '教师端' : '学生端');
  let scriptPath = Editor.assetdb.urlToFspath('db://assets/scripts/Data/ConstValue.ts')
  let script = fs.readFileSync(scriptPath, 'utf8');
  //Editor.log(script);
  script = script.replace('IS_EDITIONS = false', 'IS_EDITIONS = true');
  if (isTeacher) {
    script = script.replace('IS_TEACHER = false', 'IS_TEACHER = true');
  } else {
    script = script.replace('IS_TEACHER = true', 'IS_TEACHER = false');
  }
  //Editor.log(script)
  fs.writeFileSync(scriptPath, script)

  cbk();
}

function buildWebMobile(isTeacher, cbk) {
  Editor.log('构建 ...', isTeacher ? '教师端' : '学生端');
  let projectPath = Editor.Project.path
  let params, buildPath, startScene, command
  let allScenes = [], excludeScenes = []
  fs.readdirSync(Editor.assetdb.urlToFspath('db://assets/scene/')).forEach((file) => {
    //Editor.log(file)
    if (!file.endsWith('.meta')) {
      allScenes.push(file)
    }
  })
  //Editor.log('allScenes', allScenes)

  buildPath = projectPath + '/build'
  if (isTeacher) {
    startScene = Editor.assetdb.urlToUuid('db://assets/scene/Teacher.fire')
    //Editor.log(startScene)
  } else {
    startScene = Editor.assetdb.urlToUuid('db://assets/scene/Student.fire')
    //Editor.log(startScene)
  }
  allScenes.forEach((sceneFile) => {
    let uuid = Editor.assetdb.urlToUuid('db://assets/scene/' + sceneFile)
    if (uuid != startScene) {
      //除了开始场景，其他场景都不参与构建
      excludeScenes.push(uuid)
    }
  })
  //Editor.log('excludeScenes', excludeScenes)

  /**
   * 命令行构建参数不支持设置参与构建的场景，通过修改builder.json来实现
   */
  let jsonPath = projectPath + '/settings/builder.json'
  let jsonStr = fs.readFileSync(jsonPath, 'utf8');
  //Editor.log(jsonStr)
  let obj = JSON.parse(jsonStr)
  obj.excludeScenes = excludeScenes
  fs.writeFileSync(jsonPath, JSON.stringify(obj))

  params = `--path ${projectPath} --build "platform=web-mobile;debug=false;md5Cache=true;buildPath=${buildPath};startScene=${startScene}"`

  if (Editor.isDarwin) {
    command = `/Applications/CocosCreator.app/Contents/MacOS/CocosCreator ${params}`
  } else {
    command = `${EnginePath} ${params}`
    Editor.log(command)
  }

  childProcess.exec(command, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    let newName
    if (isTeacher) {
      newName = buildPath + '/teacher'
    } else {
      newName = buildPath + '/student'
    }
    fs.rename(buildPath + '/web-mobile', newName, (error) => {
      if (error) {
        Editor.error(error)
        return
      }
      cbk()
    })
  })
}

function cleanCoursewarDir() {
  tryDeleteDir(CoursewarePath + '/student', () => {
    tryDeleteDir(CoursewarePath + '/teacher', () => {
      gitPull()
    })
  })

}

function gitPull() {
  Editor.log('git pull...')
  let child = childProcess.spawn('git', ['pull'], {
    cwd: CoursewarePath
  })
  child.stdout.on('data', function (data) {
    // Editor.log(data.toString());
  });
  child.on('exit', function () {
    moveFolders()
  });
}

function moveFolders() {
  Editor.log('移动文件夹...')
  let buildPath = Editor.Project.path + '/build'
  fs.rename(buildPath + '/student', CoursewarePath + '/student', (error) => {
    if (error) {
      Editor.error(error)
      return
    }
    fs.rename(buildPath + '/teacher', CoursewarePath + '/teacher', (err) => {
      if (err) {
        Editor.error(err)
        return
      }
      gitAdd()
    })
  })
}

function gitAdd() {
  Editor.log('git add...')
  childProcess.exec("git add -A", {
    cwd: CoursewarePath
  }, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    gitCommit()
  })
}

function gitCommit() {
  Editor.log('git commit...')
  //git commit -m 'msg' -a
  childProcess.exec("git commit -m " + GitLog, {
    cwd: CoursewarePath
  }, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    gitPush()
  })
}

function gitPush() {
  Editor.log('git push...')
  childProcess.exec("git push", {
    cwd: CoursewarePath
  }, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    Editor.log('完成！')
    Editor.Dialog.messageBox({
      message: '请到Jenkins点击构建'
    })
    //TODO: 自动触发构建
  })
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
