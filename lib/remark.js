'use babel';

import { CompositeDisposable } from 'atom';
import reflowText from './reflow-text';

export default {
  remarkView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    maxSize: {
      type: 'integer',
      default: 72,
      minimum: 1,
    },
  },

  activate(state) {
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
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const buffer = editor.getBuffer();
      const lines = buffer.getLines();
      const originalCursorPos = editor.getCursorBufferPosition();
      const maxSize = atom.config.get('Remark.maxSize');
      const { text, cursorPos } = reflowText(lines, originalCursorPos, maxSize);
      editor.setText(text);
      editor.setCursorBufferPosition(cursorPos);
    }
  }
};
