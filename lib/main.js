//'use babel';

//import IdeErlangView from './ide-erlang-view';
//import { CompositeDisposable } from 'atom';

const cp = require('child_process')
const fs = require('fs').promises
const path = require('path')
const decompress = require('decompress')
const {AutoLanguageClient, DownloadFile} = require('atom-languageclient')

const erlangLsVersion = "0.4.1"
const erlangLsDownloadUrl = "https://github.com/erlang-ls/erlang_ls/archive/" + erlangLsVersion + ".tar.gz"
const erlangLsErlScriptRelPath = "/_build/default/bin/erlang_ls"

class ErlangLanguageClient extends AutoLanguageClient {
    getGrammarScopes () { return [ 'source.erlang' ] }
    getLanguageName () { return 'Erlang' }
    getServerName () { return 'erlang_ls' }

    constructor(){
        super();
        this.statusElement = document.createElement('span')
        this.statusElement.className = 'inline-block'
    }

    startServerProcess () {
        const erlangLsHome = path.join(__dirname, '..', 'server')
        const erlangLsWorkingDir = erlangLsHome + "/erlang_ls-" + erlangLsVersion + "/"
        const erlangLsErlScript = path.join(erlangLsWorkingDir, erlangLsErlScriptRelPath)

        return this.fileExists(erlangLsErlScript)
            .catch(() => {
                const erlangLsLocalPath = path.join(erlangLsHome, "erlang_ls.tar.gz")
                return this.fileExists(erlangLsHome)
                    .catch(() => {
                        this.updateStatusBar("Creating server folder")
                        return fs.mkdir(erlangLsHome, { recursive: true })
                    })
                    .then(() => {
                        this.updateStatusBar("Downloading server file")
                        return DownloadFile(erlangLsDownloadUrl, erlangLsLocalPath)
                    })
                    .then(() => {
                        this.updateStatusBar("Decompressing server")
                        return decompress(erlangLsLocalPath, erlangLsHome)
                    })
                    .then((files) => {
                        this.updateStatusBar("Removing downloaded server file")
                        return fs.unlink(erlangLsLocalPath)
                    })
                    .then(() => {
                        return new Promise((resolve, reject) => {
                            this.updateStatusBar("Building server")
                            cp.exec("make", {cwd: erlangLsWorkingDir}, (error, stdout, stderr) => {
                                console.log("stdout: " + stdout)
                                if(error) {
                                    console.error("stderr: " + stderr);
                                    console.error(error)
                                    reject(error)
                                } else {
                                    resolve()
                                }
                            })
                        })
                    })
                    .then(() => this.fileExists(erlangLsErlScript))
            })
            .then(() => {
                this.updateStatusBar("Starting server")
                const server = cp.spawn(erlangLsErlScript, [], { cwd:erlangLsWorkingDir })
                this.captureServerErrors(server)
                this.updateStatusBar("Server started")
                return server
            })
            .catch((error) => {
                this.updateStatusBar("Failed to start server")
                atom.notifications.addError("Failed to start Erlang language server.", {
                    dismissable: true,
                    description: "<code>" + error.stack + "</code>"
                })
                return null
            })
    }

    shouldStartForEditor(editor) {
      return this.getGrammarScopes().includes(editor.getGrammar().scopeName);
    }

    fileExists (path) {
        return fs.access(path, fs.R_OK)
    }

    updateStatusBar (text) {
        this.statusElement.textContent = `${this.name} ${text}`
        if (!this.statusTile && this.statusBar) {
            this.statusTile = this.statusBar.addRightTile({ item: this.statusElement, priority: 1000 })
        }
    }

    consumeStatusBar (statusBar) {
        this.statusBar = statusBar
    }
}

module.exports = new ErlangLanguageClient();

/*export default {

  ideErlangView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.ideErlangView = new IdeErlangView(state.ideErlangViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.ideErlangView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ide-erlang:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.ideErlangView.destroy();
  },

  serialize() {
    return {
      ideErlangViewState: this.ideErlangView.serialize()
    };
  },

  toggle() {
    console.log('IdeErlang was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};*/
