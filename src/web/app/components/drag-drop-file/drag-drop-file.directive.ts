import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[ocmDragDropFile]'
})
export class DragDropFileDirective {

  @Output()
  readonly filesDropped = new EventEmitter<FileList>()

  @Output()
  @HostBinding('$.class.drop-active')
  @HostListener('$.class.drop-active')
  readonly dropActive = new EventEmitter()

  @HostBinding('class.drag-drop-file')
  readonly classList = true;

  constructor() {
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    this.dropActive.next(true)
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    this.dropActive.next(false)
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    this.dropActive.next(false)
    const files = e.dataTransfer?.files
    if (!!files && files.length > 0) {
      this.filesDropped.emit(files)
    }
  }

}
