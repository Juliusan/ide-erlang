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
const erlangLsErlScriptRelPath = "erlang_ls-" + erlangLsVersion + "/_build/default/bin/erlang_ls"

class ErlangLanguageClient extends AutoLanguageClient {
    getGrammarScopes () { return [ 'source.erlang' ] }
    getLanguageName () { return 'Erlang' }
    getServerName () { return 'erlang_ls' }

    constructor(){
        super();
        console.log("XXX CONSTRUCT");
    }

    startServerProcess () {
        const erlangLsHome = path.join(__dirname, '..', 'server')
        const erlangLsErlScript = path.join(erlangLsHome, erlangLsErlScriptRelPath)

        console.log("XXX " + __dirname)
        this.fileExists(erlangLsErlScript)
            .then(() => console.log("XXX script exists"))
            .catch(() => {
                console.log("XXX script is missing ")
                const erlangLsLocalPath = path.join(erlangLsHome, "erlang_ls.tar.gz")
                this.fileExists(erlangLsHome)
                    .then(() => console.log("XXX folder exists"))
                    .catch(() => {
                        console.log("XXX folder is missing")
                        fs.mkdir(erlangLsHome, { recursive: true })
                    })
                console.log("XXX DOWNLOADING");
                DownloadFile(erlangLsDownloadUrl, erlangLsLocalPath)
                    .then(() => {console.log("XXX DECOMPRESSING"); return decompress(erlangLsLocalPath, erlangLsHome)})
                    .then((files) => {console.log("XXX CLEANING UP " + files); return fs.unlink(erlangLsLocalPath)})
                    .then(() => {
                        console.log("XXX BUILDING")
                        return new Promise(resolve => {
                            const currentWorkingDir = erlangLsHome + "/erlang_ls-" + erlangLsVersion + "/"
                            console.log("XXX BUILDING Start " + currentWorkingDir)
                            cp.exec("make", {cwd: currentWorkingDir}, (error, stdout, stderr) => {
                                console.log("stdout: " + stdout)
                                console.error("stderr: " + stderr);
                                if(error) {
                                    console.error("XXX ERROR" + error)
                                }
                                resolve()
                            })
                        })
                    })
                    .then(() => {console.log("XXX EXISTS"); return this.fileExists(erlangLsErlScript)})
                    .then(exists => console.log("XXX ? " + exists))
            })
        //return super.spawnChildNode([ require.resolve('omnisharp-client/languageserver/server') ])
    }

    shouldStartForEditor(editor) {
      console.log("XXX " + editor.getGrammar().scopeName);
      return this.getGrammarScopes().includes(editor.getGrammar().scopeName);
    }

    fileExists (path) {
        return fs.access(path, fs.R_OK)
    }
}

console.log('XXX KUKU');
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
