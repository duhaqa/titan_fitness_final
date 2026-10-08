import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'searchHighlight',
  standalone: true // أضيفيها إذا كنتِ تستخدمين Angular Standalone Components
})
export class SearchHighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined, search: string): SafeHtml | string {
    if (!value) return '';
    if (!search || !search.trim()) return value;

    // تنظيف نص البحث وتكوين Regular Expression لتجاهل حالة الأحرف (Case Insensitive)
    const escapedSearch = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');

    // استبدال النص المطبوق بـ mark يحتوي على خلفية صفراء
    const highlighted = value.replace(
      regex,
      '<mark style="background-color: #fef08a; color: #854d0e; padding: 1px 4px; border-radius: 3px; font-weight: bold;">$1</mark>'
    );

    // السماح بـ HTML داخل Angular بأمان
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}