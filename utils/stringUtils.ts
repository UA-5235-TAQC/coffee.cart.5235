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

    /**
     * Converts a name to a data-test attribute value by replacing spaces with underscores.
     * @param name The input string to convert.
     * @returns The converted string suitable for use as a data-test attribute.
     */
    static nameToDataTest(name: string): string {
        return name.replace(/ /g, '_');
    }
}