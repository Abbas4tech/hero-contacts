import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
    private makeFirstCap(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    transform(value: string, prefix?: string) {
        if (prefix && value.split(prefix).length > 1) {
            return value
                .split(prefix)
                .map((e) => this.makeFirstCap(e))
                .join(' ');
        } else {
            return this.makeFirstCap(value);
        }
    }
}
