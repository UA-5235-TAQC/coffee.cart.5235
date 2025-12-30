export class StringUtils {
    //Extracts all digits from a string and returns them as a number.
    static extractNumbers(text: string): number {
        const match = text.match(/\d+(\.\d+)?/);
        if (!match) {
            return 0;
        }
        const result = parseFloat(match[0]);
        return isNaN(result) ? 0 : result;
    }
}