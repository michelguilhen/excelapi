import { Product } from './../../shared/models/product';
import { Import } from './../../shared/models/import';
import { ImportService } from './../../shared/services/import.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  import: Import;
  products: Product[];

  displayedColumns = ['date', 'name', 'amount', 'unitPrice', 'total']

  constructor(private route: ActivatedRoute,
              private importService: ImportService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.importService.getImportById(id).subscribe(res => {
      this.import = res;
      this.products = res.products;
    });
  }

  onLoadImport(id: string) {
    
  }
}
