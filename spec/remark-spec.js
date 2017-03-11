'use babel';

import Remark from '../lib/remark';
import * as Mocks from './mocks';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Remark', () => {
  let workspaceElement;
  let activationPromise;
  let validMarkdownText = Mocks.ValidMarkdown();
  let validMarkdownLines = validMarkdownText.split('\n');
  // let validMarkdownLineReader = Mocks.validMarkdownLineReader;
  let editor;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('remark');
    editor = atom.workspace.buildTextEditor();
    spyOn(atom.workspace, 'getActiveTextEditor').andReturn(editor);
  });

  describe('when the remark:reflow event is triggered', () => {
    describe('when already valid',() => {
      beforeEach(() => {
        editor.setText(validMarkdownText);
        let i = 0;
        let string = '';
        while (i < 73) {
          string += 'a';
          i += 1;
        }
        editor.insertText(string);
      });

      it('does not alter the file on save', () => {
        // console.log(editor.getText());
        // atom.commands.dispatch(atom.views.getView(editor), 'remark:reflow');
        waitsForPromise(() => {
          return activationPromise;
        });
        atom.commands.dispatch(atom.views.getView(editor), 'remark:reflow');

        runs(() => {
          const text = editor.getText().split('\n');
          console.log(text);
          text.forEach(el => {
            console.log(el.length);
          })
          let value = true;
          for (let i = 0; i < text.length; i += 1) {
            const row = text[i];
            if (row.length > 72) {
              value = false;
              break;
            }
          }
          expect(value).toEqual(true);
        });
      });
    });
    xit('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.remark')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'remark:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.remark')).toExist();

        let remarkElement = workspaceElement.querySelector('.remark');
        expect(remarkElement).toExist();

        let remarkPanel = atom.workspace.panelForItem(remarkElement);
        expect(remarkPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'remark:toggle');
        expect(remarkPanel.isVisible()).toBe(false);
      });
    });

    xit('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.remark')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'remark:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let remarkElement = workspaceElement.querySelector('.remark');
        expect(remarkElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'remark:toggle');
        expect(remarkElement).not.toBeVisible();
      });
    });
  });
});
