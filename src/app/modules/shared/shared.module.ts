import { MessageComponent } from './components/message/message.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeToggler } from './components/theme-toggler/theme-toggler.component';
import { NewtworkManagerDirective } from './directives/network-manager.directive';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { Breadcrumb } from './components/breadcrumb/breadcrumb.component';
import { PageWrapper } from './components/page-wrapper/page-wrapper.component';

@NgModule({
    declarations: [
        ThemeToggler,
        NewtworkManagerDirective,
        MessageComponent,
        CapitalizePipe,
        Breadcrumb,
        PageWrapper,
    ],
    imports: [CommonModule],
    exports: [
        ThemeToggler,
        NewtworkManagerDirective,
        Breadcrumb,
        MessageComponent,
        CapitalizePipe,
        PageWrapper,
    ],
    providers: [],
})
export class SharedModule {}
