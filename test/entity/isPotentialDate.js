const assert = require('assert')
const { isPotentialDate } = require('./../../src/parsers/isPotentialDate')

// Define valid dates as an array
const validDates = [
    '00-00-00',
    '22-03-29',
    '0000-00-00',
    '2022-03-29',
    '00/00/00',
    '03/29/22',
    '00/00/0000',
    '03/29/2022',
    '29/03/2022',
    '0000/00/00',
    '2022/03/29',
    'AAA 00, 00',
    'Mar 29, 22',
    'AAA 00, 0000',
    'Mar 29, 2022',
    'AAAAA 00, 0000',
    'March 29, 2022',
    'AAAAA 00, 00',
    'March 29, 22',
    '00 AAA 0000',
    '29 Mar 2022',
    '00 AAA 00',
    '29 Mar 22',
    '00 AAAAA 0000',
    '29 March 2022',
    '00-00-00T00:00:00.000Z',
    '22-03-29T00:00:00.000Z',
    '0000-00-00T00:00:00.000Z',
    '2022-03-29T00:00:00.000Z',
    '00-00-00T00:00:00Z',
    '22-03-29T00:00:00Z',
]


// Define invalid dates as an array
const invalidDates = [
    1,
    Number(1),
    '1',
    true,
    false,
    Boolean(true),
    [1],
    Array.of(1),
    Object(1),
    Date(1),
    '2022-03-',
    '2022/03',
    'March 29 2022',
    '29 March',
    '22-03-29T00:00:00.000X',
    '2022-03-29T00:00:00.000',
    '22-03-29T00:00:00',
    '2022-03-29T00:00:00',
    '2022-03-29T00:00:00.000',
    '00-00-0',
    '22-0-29',
    '2-0-29',
    '000-00-00',
    '0000-00--00',
    '0-00-00',
    'A000-00-00',
    '0000-A0-00',
    'A000-00-A0',
    '00000000',
    '0000/00/000',
    '0000/0A/00',
    '0000/00/0A',
    '000A/00/00',
    '0000/00-00',
    '0000/00 00',
    'AA 00, 00',
    'A0A 00, 00',
    'AAA A0, 00',
    'AAA 00, 0A',
    'AAA 000, 00',
    'AAA 00, 000',
    'AAA 00, 0',
    '1AAA 00, 0',
    '1AAAAA 00, 0000',
    '00000 00, 0000',
    'AAAAA 0A, 0000',
    'AAAAA 00, A000',
    '00 AAA 000',
    '00 AAA 000A',
    '00 AA0 0000',
    '0A AAA 0000',
    '00 AAAA0 0000',
    '0A AAAAA 0000',
    '00 AAAAA 000A',
    '00 AAAAA 000',
    '0A-00-00T00:00:00.000Z',
    '00-0A-00T00:00:00.000Z',
    '00-00-A0T00:00:00.000Z',
    '00-00-00TA0:00:00.000Z',
    '00-00-00T00:A0:00.000Z',
    '00-00-00T00:00:A0.000Z',
    '00-00-00T00:00:00.A00Z',
    '000-00-00T00:00:00.000Z',
    '000A-00-00T00:00:00.000Z',
    '0A-00-00T00:00:00Z',
]

describe('isPotentialDate', function () {
    describe('valid dates', function () {
        it('should return true for valid dates', function () {
            for (let date of validDates) {
                assert.strictEqual(isPotentialDate(date), true)
            }
        })
    })

    describe('invalid dates', function () {
        it('should return false for invalid dates', function () {
            for (let date of invalidDates) {
                assert.strictEqual(isPotentialDate(date), false)
            }
        })
    })
})
