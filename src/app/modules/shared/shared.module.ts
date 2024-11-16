import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeToggler } from './components/theme-toggler/theme-toggler.component';
import { NewtworkManagerDirective } from './directives/network-manager.directive';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { Breadcrumb } from './components/breadcrumb/breadcrumb.component';
import { PageWrapper } from './components/page-wrapper/page-wrapper.component';
import { MemoryConverterPipe } from './pipes/memory-coverter.pipe';

@NgModule({
    declarations: [
        ThemeToggler,
        NewtworkManagerDirective,
        CapitalizePipe,
        Breadcrumb,
        PageWrapper,
        MemoryConverterPipe,
    ],
    imports: [CommonModule],
    exports: [
        ThemeToggler,
        NewtworkManagerDirective,
        Breadcrumb,
        CapitalizePipe,
        PageWrapper,
        MemoryConverterPipe,
    ],
    providers: [],
})
export class SharedModule {}
