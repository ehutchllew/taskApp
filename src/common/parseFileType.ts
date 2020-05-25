export function parseFileType(fileName: string): string {
    try {
        const splitName = fileName.split(".");
        return splitName[splitName.length - 1];
    } catch (e) {
        return "";
    }
}
