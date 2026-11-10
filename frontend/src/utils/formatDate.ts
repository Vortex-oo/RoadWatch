// Turns "2026-11-03T09:30:00Z" into something like "3 Nov 2026".
export function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}