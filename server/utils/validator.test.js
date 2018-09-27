const expect = require('expect');
const {isRealString} = require('./validator');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var res = isRealString(456);
        expect(res).toBe(false);
    });
    
    it('should reject empty values', () => {    
        var res = isRealString('   ');
        expect(res).toBe(false);
    });
    
    it('should allow strings with spaces', () => {    
        var res = isRealString('  Luca   ');
        expect(res).toBe(true);
    });
});