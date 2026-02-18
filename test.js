require('should')
var j = require('./index')

describe('toImperial', function () {
  it('should convert Gregorian to Imperial correctly', function () {
    j.toImperial(1981, 8, 17).should.be.eql({iy: 2540, im: 5, id: 26})
    j.toImperial(2013, 1, 10).should.be.eql({iy: 2571, im: 10, id: 21})
    j.toImperial(2014, 8, 4).should.be.eql({iy: 2573, im: 5, id: 13})
  })

  it('should convert Date object to Imperial', function () {
    j.toImperial(new Date(1981, 8 - 1, 17)).should.be.eql({iy: 2540, im: 5, id: 26})
    j.toImperial(new Date(2013, 1 - 1, 10)).should.be.eql({iy: 2571, im: 10, id: 21})
    j.toImperial(new Date(2014, 8 - 1, 4)).should.be.eql({iy: 2573, im: 5, id: 13})
  })
})

describe('toGregorian', function () {
  it('should convert Imperial to Gregorian correctly', function () {
    j.toGregorian(2540, 5, 26).should.be.eql({gy: 1981, gm: 8, gd: 17})
    j.toGregorian(2571, 10, 21).should.be.eql({gy: 2013, gm: 1, gd: 10})
    j.toGregorian(2573, 5, 13).should.be.eql({gy: 2014, gm: 8, gd: 4})
  })
})

describe('isValidImperialDate', function () {
  it('should check validity of an Imperial date', function () {
    j.isValidImperialDate(1118, 12, 29).should.be.false
    j.isValidImperialDate(1118, 12, 29).should.be.false
    j.isValidImperialDate(1119, 1, 1).should.be.true
    j.isValidImperialDate(4358, 1, 1).should.be.false
    j.isValidImperialDate(4357, 12, 29).should.be.true
    j.isValidImperialDate(2573, 0, 1).should.be.false
    j.isValidImperialDate(2573, 13, 1).should.be.false
    j.isValidImperialDate(2573, 1, 0).should.be.false
    j.isValidImperialDate(2573, 1, 32).should.be.false
    j.isValidImperialDate(2573, 1, 31).should.be.true
    j.isValidImperialDate(2573, 11, 31).should.be.false
    j.isValidImperialDate(2573, 11, 30).should.be.true
    j.isValidImperialDate(2573, 12, 30).should.be.false
    j.isValidImperialDate(2573, 12, 29).should.be.true
    j.isValidImperialDate(2575, 12, 30).should.be.true
  })
})

describe('isLeapImperialYear', function () {
  it('should check if an Imperial year is leap or common', function () {
    j.isLeapImperialYear(2573).should.be.false
    j.isLeapImperialYear(2574).should.be.false
    j.isLeapImperialYear(2575).should.be.true
    j.isLeapImperialYear(2576).should.be.false
  })
})

describe('imperialMonthLength', function () {
  it('should return number of days in a given Imperial year and month', function () {
    j.imperialMonthLength(2573, 1).should.be.exactly(31)
    j.imperialMonthLength(2573, 4).should.be.exactly(31)
    j.imperialMonthLength(2573, 6).should.be.exactly(31)
    j.imperialMonthLength(2573, 7).should.be.exactly(30)
    j.imperialMonthLength(2573, 10).should.be.exactly(30)
    j.imperialMonthLength(2573, 12).should.be.exactly(29)
    j.imperialMonthLength(2574, 12).should.be.exactly(29)
    j.imperialMonthLength(2575, 12).should.be.exactly(30)
  })
})

describe('imperialToDateObject', function () {
  it('should return javascript Date object for Imperial date in a given Imperial year, month and day', function () {
    j.imperialToDateObject(2580, 4, 30).should.be.eql(new Date(2021, 6, 21));
    j.imperialToDateObject(2579, 12, 20).should.be.eql(new Date(2021, 2, 10));
    j.imperialToDateObject(2577, 5, 13).should.be.eql(new Date(2018, 7, 4));
  })
})

describe("imperialToDateObject with time params", function () {
  it("should return javascript Date object for Imperial date in a given Imperial year, month, and day and also time params like hours, minutes, seconds, and milliseconds", function () {
    j.imperialToDateObject(2580, 4, 30, 3).should.be.eql(new Date(2021, 6, 21, 3));
    j.imperialToDateObject(2579, 12, 20, 23, 20).should.be.eql(new Date(2021, 2, 10, 23, 20));
    j.imperialToDateObject(2577, 5, 13, 25, 52, 100).should.be.eql(new Date(2018, 7, 4, 25, 52, 100));
  })
})

// نمونه‌های نمایشی برای چاپ روی کنسول
// این بخش تست نیست، فقط کمک می‌کند خروجی‌ها را ببینی.
;(function showSampleImperialDates () {
  var today = new Date(2026, 1, 18) // مثال: 18 فوریه 2026 (ماه‌ها از 0 شروع می‌شوند)
  var imperial = j.toImperial(today)
  var backToGregorian = j.toGregorian(imperial.iy, imperial.im, imperial.id)

  console.log('Gregorian:', today.getFullYear(), today.getMonth() + 1, today.getDate())
  console.log('Imperial:', imperial)
  console.log('Back to Gregorian:', backToGregorian)
})()
