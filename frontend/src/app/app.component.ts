import { Component } from '@angular/core';
import { DiffEditorModel, NgxEditorModel } from '../platform/editor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  editor: any;
  showMultiple = false;
  toggleLanguage = true;
  options = {
    theme: 'vs-dark'
  };
  code: string;
  cssCode = `.my-class {
  color: red;
}`;
  jsCode = `was ist das für 1 code?
  i bims 1 zal 💪 gönn dir 0!!!
  i bims 1 isso lauch gönn dir yup!!!

  gieb "Gib d1 umfang vong bizeps her:" her?
  💪 gönn dir 1gabe!!!

  lauch gönn dir was ist das für 1 isweniga vong 💪, 44 her?

  bist du lauch? yup
      gieb "G pumpen du Lauch!" her?
  real rap

  bist du lauch? nope
      gieb "Du bist k1 Lauch!" her?
  real rap
1 n🍦r!!!`;

  originalModel: DiffEditorModel = {
    code: 'heLLo world!',
    language: 'text/plain'
  };

  modifiedModel: DiffEditorModel = {
    code: 'hello orlando!',
    language: 'text/plain'
  };

  jsonCode = [
    '{',
    '    "p1": "v3",',
    '    "p2": false',
    '}'
  ].join('\n');

  model: NgxEditorModel = {
    value: this.jsonCode,
    language: 'json',
    uri: 'foo.json'
  };

  ngOnInit() {
    this.updateOptions();
  }

  updateOptions() {
    this.toggleLanguage = !this.toggleLanguage;
    if (this.toggleLanguage) {
      this.code = this.cssCode;
      this.options = Object.assign({}, this.options, { language: 'java' });
    } else {
      this.code = this.jsCode;
      this.options = Object.assign({}, this.options, { language: 'javascript' });
    }

  }

  updateDiffModel(){
    this.originalModel = Object.assign({}, this.originalModel, { code: 'abcd' });
    this.modifiedModel = Object.assign({}, this.originalModel, { code: 'ABCD ef' });
  }

  onInit(editor) {
    this.editor = editor;
    console.log(editor);
    // let line = editor.getPosition();
    // let range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
    // let id = { major: 1, minor: 1 };
    // let text = 'FOO';
    // let op = { identifier: id, range: range, text: text, forceMoveMarkers: true };
    // editor.executeEdits("my-source", [op]);
  }
}
