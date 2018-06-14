import { Component } from '@angular/core';
import { DiffEditorModel, NgxEditorModel } from '../platform/editor';
import { HttpClient } from '@angular/common/http';

const url:string = "http://localhost:3000/vongline/";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient){
  }

  editor: any;
  showMultiple = false;
  toggleLanguage = true;
  options = {
    theme: 'vs-dark'
  };

  result: string;
  code = `was ist das für 1 code?
  i bims 1 zal 💪 gönn dir 43!!!
  i bims 1 isso lauch gönn dir yup!!!

  lauch gönn dir was ist das für 1 isweniga vong 💪, 44 her?

  bist du lauch? yup
      gieb "G pumpen du Lauch!" her?
  real rap

  bist du lauch? nope
      gieb "Du bist k1 Lauch!" her?
  real rap
1 n🍦r!!!`;

  model: NgxEditorModel = {
    value: this.code,
    language: 'json',
    uri: 'foo.json'
  };

  ngOnInit() {
    this.updateOptions();
  }

  updateOptions() {
      this.options = Object.assign({}, this.options, { language: 'javascript' });
  }

  sendSourceCode(){
      this.result = this.code;
      const sourceCode = JSON.parse('{"Code":"' + this.code +'"}');
      this.result = sourceCode;
      const req = this.http.post(url, sourceCode).subscribe(res => {
          this.result = JSON.stringify(res);
        },
        err => {
          this.result = "Error";
          console.log("Error occured");
        }
      );
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
