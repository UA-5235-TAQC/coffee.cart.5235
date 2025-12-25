export class StringUtils {
    //Extracts all digits from a string and returns them as a number. Works with only one number in a srting
    static extractNumbers(text: string): number {
        const cleanedText = text.replace(/[^0-9.]/g, '');
        const result = parseFloat(cleanedText);
        return isNaN(result) ? 0 : result;
    }
}