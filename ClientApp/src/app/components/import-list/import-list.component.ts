import { ImportError } from './../../shared/dtos/importError';
import { ErrorModalComponent } from './../../shared/error-modal/error-modal.component';
import { ImportResponse } from './../../shared/dtos/importResponse';
import { ImportService } from './../../shared/services/import.service';
import { Component, OnInit } from '@angular/core';
import { Import } from './../../shared/models/import';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-import-list',
  templateUrl: './import-list.component.html',
  styleUrls: ['./import-list.component.css']
})
export class ImportListComponent implements OnInit {
  importResponse: ImportResponse;
  imports: Import[];
  file: File;
  displayedColumns = ['id', 'date', 'amount', 'closestDate', 'total', 'action'];

  constructor(private importService: ImportService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.importService.getImports().subscribe(imports => {
      this.imports = imports;
    });
  }

  onFileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList.item(0);
      const extension: string = this.file.name.split('.').pop();
      if (extension !== 'xls' && extension !== 'xlsx') {
        this.importService.showMessage('Extensão de arquivo inválida');
        (<HTMLInputElement>document.getElementById('file-input')).value = null;
      }
    }
  }

  onSubmitFile() {
    if (this.file) {
      this.importService.uploadImport(this.file)
        .subscribe(res => {
          if (res.success) {
            this.importService.showMessage('Planilha importada com sucesso!');
            (<HTMLInputElement>document.getElementById('file-input')).value = null;
            this.ngOnInit();
          }
          else {
            this.importService.showMessage('Erro inesperado, por favor tente novamente')
          }
        }, reason => {
          this.openDialog(reason.error.errors);
        });
    }
  }

  openDialog(errors: ImportError[]) {
    let dialog = this.dialog.open(ErrorModalComponent, {
      data: errors
    });
    dialog.afterClosed().subscribe(res => {
      this.ngOnInit();
    })
  }
}