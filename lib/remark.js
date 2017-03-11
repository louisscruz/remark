'use babel';

import { CompositeDisposable } from 'atom';
import RemarkView from './remark-view';
import { reflowText } from './helpers';

export default {
  remarkView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.remarkView = new RemarkView(state.remarkViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.remarkView.getElement(),
      visible: false
    });
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'remark:reflow': () => this.reflow()
    }));
    this.subscriptions.add(this.handleSaveEvent());
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.remarkView.destroy();
  },

  serialize() {
    return {
      remarkViewState: this.remarkView.serialize()
    };
  },

  handleSaveEvent() {
    return atom.workspace.observeTextEditors(editor => {
      editor.getBuffer().onWillSave(() => {
        const path = editor.getPath().toLowerCase();
        if (path.slice(path.length - 3) === '.md') {
          this.reflow();
        }
      });
    });
  },

  reflow() {
    console.log('RUNNING');
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const lines = editor.getBuffer().getLines();
      const newText = reflowText(lines);
      editor.setText(newText);
    }
  }
};
