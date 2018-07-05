import { Component } from '@angular/core';
import { DiffEditorModel, NgxEditorModel } from '../platform/editor';
import { HttpClient } from '@angular/common/http';

const url:string = "http://vongpiler:8443/";

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
  options = {
    theme: 'vs-dark'
  };

  sessionId: number;
  compiled = false;

  result: string;
  code = `was ist das für 1 code?
  halo i bims!!!
1 n🍦r!!!`;

  ngOnInit() {
    this.updateOptions();
  }

  updateOptions() {
      this.options = Object.assign({}, this.options, { language: 'javascript' });
  }

  sendSourceCode(){
      const req = this.http.post(url + "compile", {SessionId: this.sessionId, Code:this.code}).subscribe(res => {
          const buffer = JSON.parse(JSON.stringify(res));
          this.result = buffer.StdoutC + "\n";
          this.sessionId = buffer.SessionId;
          this.compiled = buffer.Compiled;
        },
        err => {
          this.result = "Connection error: " + err;
        }
      );
  }

  execSourceCode(){
    const req = this.http.post(url + "exec", {SessionId: this.sessionId}).subscribe(res => {
        const buffer = JSON.parse(JSON.stringify(res));
        this.result = buffer.StdoutR + "\n";
        this.sessionId = buffer.SessionId;
      },
      err => {
        this.result = "Connection error: " + err;
      }
    );
}

  onInit(editor) {
    this.editor = editor;
  }
};
