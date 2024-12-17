export class StringUtils {
    public static ReplaceBlackChars = (value) => {
        if (typeof value !== 'string') {
          throw new Error('Wartość musi być stringiem.');
        }
        
        return value.replace(/['";]/g, '');
      };
}