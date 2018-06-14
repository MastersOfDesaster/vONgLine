import { Component } from '@angular/core';
import { DiffEditorModel, NgxEditorModel } from '../platform/editor';
import { HttpClient } from '@angular/common/http';

const url:string = "http://localhost:3000/vongline";

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
  i bims 1 zal lauch1 gönn dir 0!!!
  i bims 1 zal lauch2 gönn dir 1!!!
  i bims 1 zal erg gönn dir 0!!!
  i bims 1 zal max gönn dir 0!!!
  i bims 1 zal zähl gönn dir 0!!!
  i bims 1 isso 🦄 gönn dir nope!!!

  max gönn dir 10!!!

  #start
  🦄 gönn dir was ist das für 1 isweniga vong zähl, max her?
  bist du 🦄? yup
      erg gönn dir was ist das für 1 sume vong lauch1, lauch2 her?
      gieb "Fibonacci " + zähl +" :" + lauch1 + " + " + lauch2 + " = " + erg her?
      lauch1 gönn dir lauch2!!!
      lauch2 gönn dir erg!!!
      zähl gönn dir was ist das für 1 sume vong zähl, 1 her?
      g zu #start du larry!!!
  real rap
1 n🍦r!!!`;

  ngOnInit() {
    this.updateOptions();
  }

  updateOptions() {
      this.options = Object.assign({}, this.options, { language: 'javascript' });
  }

  sendSourceCode(){
      const req = this.http.post(url, {Code:this.code}).subscribe(res => {
          const buffer = JSON.parse(JSON.stringify(res));
          this.result = buffer.StdoutC + "\n" + buffer.StdoutR;
        },
        err => {
          this.result = "Error";
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
};
