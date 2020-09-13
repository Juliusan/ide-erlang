//'use babel';

//import IdeErlangView from './ide-erlang-view';
//import { CompositeDisposable } from 'atom';

const {AutoLanguageClient} = require('atom-languageclient')

class ErlangLanguageClient extends AutoLanguageClient {
    getGrammarScopes () { return [ 'source.erlang' ] }
    getLanguageName () { return 'Erlang' }
    getServerName () { return 'erlang_ls' }

    constructor(){
        super();
        console.log("XXX CONSTRUCT");
    }

    startServerProcess () {
        return super.spawnChildNode([ require.resolve('omnisharp-client/languageserver/server') ])
    }

    shouldStartForEditor(editor) {
      console.log("XXX " + editor.getGrammar().scopeName);
      return this.getGrammarScopes().includes(editor.getGrammar().scopeName);
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
