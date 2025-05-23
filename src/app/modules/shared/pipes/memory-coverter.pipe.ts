import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'memoryConverter',
})
export class MemoryConverterPipe implements PipeTransform {
    transform(value: number): string {
        if (value === 0) return '0 Bytes';
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const index = Math.floor(Math.log(value) / Math.log(1024));
        const formattedSize = (value / Math.pow(1024, index)).toFixed(2);

        return `${formattedSize} ${units[index]}`;
    }
}
