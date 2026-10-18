import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
import { CaseRecord } from '../types/case';
import { raFileName } from '../utils/raSheet';
import { downloadRASheet } from '../utils/raSheetPdf';

@Injectable({ providedIn: 'root' })
export class RaSheetService {
  async download(c: CaseRecord, silent = false): Promise<void> {
    if (!c.rating) {
      toast.error('Rate this case before downloading the RA sheet.');
      return;
    }
    await downloadRASheet(c);
    if (!silent) toast.success('RA sheet downloaded', { description: raFileName(c) });
  }
}
