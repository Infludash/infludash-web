import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  public fileName = '';
  @Input() accept = '*';
  @Input() icon = 'attach_file';
  @Input() formName = 'file';
  @Input() InfluFormGroupName: FormGroup | undefined;
  files: FileList | undefined;
  constructor() {}

  ngOnInit(): void {}

  addFileName(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    console.log(files);
    console.log(this.fileName);
    if (files) {
      this.files = files;
      console.log(files[0].name);
      this.fileName = files[0].name;
      console.log(this.fileName);
    }
  }

  getFiles(): FileList {
    if (this.files) {
      return this.files;
    } else {
      return new FileList();
    }
  }
}
