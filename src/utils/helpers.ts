import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDateTime(dateString: string): string {
    const date = parseISO(dateString);
    return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
}

export function formatDate(dateString: string): string {
    const date = parseISO(dateString);
    return format(date, 'd MMMM yyyy', { locale: fr });
}

export function formatTime(dateString: string): string {
    const date = parseISO(dateString);
    return format(date, 'HH:mm', { locale: fr });
}

export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h${remainingMinutes}`;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
}

export function exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
