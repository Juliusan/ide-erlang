//'use babel';

//import IdeErlangView from './ide-erlang-view';
//import { CompositeDisposable } from 'atom';

const cp = require('child_process')
const fs = require('fs')
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
            .then(exists => {console.log("XXX script exists " + exists); if (!exists) {
                const erlangLsLocalPath = path.join(erlangLsHome, "erlang_ls.tar.gz")
                return this.fileExists(erlangLsHome)
                    .then(exists => {console.log("XXX " + erlangLsHome + " exists " + exists); if(!exists) fs.mkdirSync(erlangLsHome, { recursive: true }) })
                    .then(() => {console.log("XXX DOWNLOADING"); DownloadFile(erlangLsDownloadUrl, erlangLsLocalPath)})
                    .then(() => {console.log("XXX DECOMPRESSING"); decompress(erlangLsLocalPath, erlangLsHome)})
                    .then(() => {console.log("XXX CLEANING UP"); fs.unlinkSync(erlangLsLocalPath)})
                    //.then(() => {console.log("XXX BUILDING"); return new Promise(resolve => {cp.exec("make", {cwd: erlangLsHome + "erlang_ls-" + erlangLsVersion}, (error, stdout, stderr) => {console.log("stdout: " + stdout); console.error("stderr: " + stderr); if(error) console.error("XXX" + error); resolve()})})})
                    .then(() => {console.log("XXX BUILDING"); cp.exec("make", {cwd: erlangLsHome + "erlang_ls-" + erlangLsVersion}, (error, stdout, stderr) => {console.log("stdout: " + stdout); console.error("stderr: " + stderr); if(error) console.error("XXX" + error)})})
            }})
        //return super.spawnChildNode([ require.resolve('omnisharp-client/languageserver/server') ])
    }

    shouldStartForEditor(editor) {
      console.log("XXX " + editor.getGrammar().scopeName);
      return this.getGrammarScopes().includes(editor.getGrammar().scopeName);
    }

    fileExists (path) {
        return new Promise(resolve => {
            fs.access(path, fs.R_OK, error => {
                resolve(!error || error.code !== 'ENOENT')
            })
        })
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
