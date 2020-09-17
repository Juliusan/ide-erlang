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
    getConnectionType() { return 'stdio' }

    constructor(){
        super();
        atom.config.set('core.debugLSP', true)
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
                            const buildProcess = cp.spawn("make", [], {cwd: erlangLsWorkingDir})
                            buildProcess.stdout.on('data', (data) => {
                                const message = "Building server: " + data
                                console.log(message)
                                this.updateStatusBar(message)
                            })
                            buildProcess.stderr.on('data', (data) => console.error(data))
                            buildProcess.on('close', code => {
                                if (code == 0) {
                                    resolve()
                                } else {
                                    reject("Error building server: " + code)
                                }
                            })
                        })
                    })
                    .then(() => this.fileExists(erlangLsErlScript))
            })
            .then(() => {
                return new Promise(resolve => {
                    this.updateStatusBar("Starting server")
                    const server = cp.spawn(erlangLsErlScript, ["-tstdio", "-ldebug"], { cwd:erlangLsWorkingDir })
                    server.stderr.on('data', (data) => console.error(data))
                    this.captureServerErrors(server)
                    this.updateStatusBar("Server started")
                    resolve(server)
                })
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
        this.statusElement.textContent = `IdeErl: ${text}`
        if (!this.statusTile && this.statusBar) {
            this.statusTile = this.statusBar.addRightTile({ item: this.statusElement, priority: 1000 })
        }
    }

    consumeStatusBar (statusBar) {
        this.statusBar = statusBar
    }
}

module.exports = new ErlangLanguageClient();
