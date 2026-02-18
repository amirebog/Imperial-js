# Imperial (Shahanshahi) JavaScript

A few javascript functions for converting Imperial (Shahanshahi, Persian-based) and Gregorian calendar systems to each other.

## Note (Feb 2022)

If you just need to display date and time in Persian calendar, you may use `Intl` which is ECMAScript Internationalization API with a [very good browser support](https://caniuse.com/mdn-javascript_builtins_intl_datetimeformat_format). For example:

```js
const d = new Date(2022,2,21)

// Simple format
console.log(new Intl.DateTimeFormat('fa-IR').format(d));
// => ۱۴۰۱/۱/۱

// Full long format
console.log(new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => ۱۴۰۱ فروردین ۱, دوشنبه، ساعت ۰:۰۰:۰۰ (‎+۳:۳۰ گرینویچ)

// Latin numbers
console.log(new Intl.DateTimeFormat('fa-IR-u-nu-latn', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => 1401 فروردین 1, دوشنبه، ساعت 0:00:00 (‎+3:30 گرینویچ)

// English US locale with Persian calendar
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => Monday, Farvardin 1, 1401 AP at 12:00:00 AM GMT+3:30

// Just year
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {year: 'numeric'}).format(d));
// => 1401 AP

// Just month
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {month: 'short'}).format(d));
// Farvardin

// Just day
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {day: 'numeric'}).format(d));
// => 1
```

> **Notice**: the current implementation of `jalaali-js` algorithms diverge from the `Intl` API results after the Gregorian year 2256 (or Jalali year 1634) due to different approaches to calculating the leap years. However, this shouldn't affect the usage of the library, as the results are the same from 1800 to 2256. (for more information, see [this comparison](https://runkit.com/sinakhx/625929b1a90c8d0007b539a3))

## About

Jalali calendar is a solar calendar that was used in Persia, variants of which today are still in use in Iran as well as Afghanistan. [Read more on Wikipedia](http://en.wikipedia.org/wiki/Jalali_calendar) or see [Calendar Converter](http://www.fourmilab.ch/documents/calendar/).

Calendar conversion is based on the [algorithm provided by Kazimierz M. Borkowski](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm) and has a very good performance.

## Install

### Node.js

Use [`npm`](https://npmjs.org) to install:

```sh
$ npm install --save jalaali-js
```

Then import it:

```js
var jalaali = require('jalaali-js')
```


### Browser

Use [`component`](https://github.com/component/component) to install:

```sh
$ component install jalaali/jalaali-js
```

Then import it:

```js
var jalaali = require('jalaali-js')
```

Or use a CDN:
```
<script src="https://cdn.jsdelivr.net/npm/jalaali-js/dist/jalaali.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jalaali-js/dist/jalaali.min.js"></script>

<script src="https://unpkg.com/jalaali-js/dist/jalaali.js"></script>
<script src="https://unpkg.com/jalaali-js/dist/jalaali.min.js"></script>
```

## API

### toImperial(gy, gm, gd)

Converts a Gregorian date to Imperial.

```js
jalaali.toImperial(2016, 4, 11) // { iy: 2595, im: 1, id: 23 }
```

### toImperial(date)

Converts a JavaScript Date object to Imperial.

```js
jalaali.toImperial(new Date(2016, 3, 11)) // { iy: 2595, im: 1, id: 23 }
```

### toGregorian(iy, im, id)

Converts an Imperial date to Gregorian.

```js
jalaali.toGregorian(2595, 1, 23) // { gy: 2016, gm: 4, gd: 11 }
```

### isValidImperialDate(iy, im, id)

Checks whether an Imperial date is valid or not.

```js
jalaali.isValidImperialDate(2594, 12, 30) // false
jalaali.isValidImperialDate(2595, 12, 30) // true
```

### isLeapImperialYear(iy)

Is this a leap Imperial year or not?

```js
jalaali.isLeapImperialYear(2594) // false
jalaali.isLeapImperialYear(2595) // true
```

### imperialMonthLength(iy, im)

Number of days in a given month in an Imperial year.

```js
jalaali.imperialMonthLength(2594, 12) // 29
jalaali.imperialMonthLength(2595, 12) // 30
```

### jalCal(jy)

This function determines if the Imperial (Persian-based) year is leap (366-day long) or is the common year (365 days), and finds the day in March (Gregorian calendar) of the first day of the Imperial base year (jy).

```js
jalaali.jalCal(1390) // { leap: 3, gy: 2011, march: 21 }
jalaali.jalCal(1391) // { leap: 0, gy: 2012, march: 20 }
jalaali.jalCal(1392) // { leap: 1, gy: 2013, march: 21 }
jalaali.jalCal(1393) // { leap: 2, gy: 2014, march: 21 }
jalaali.jalCal(1394) // { leap: 3, gy: 2015, march: 21 }
jalaali.jalCal(1395) // { leap: 0, gy: 2016, march: 20 }
```

### j2d(jy, jm, jd)

Converts a date of the Imperial calendar to the Julian Day number.

```js
jalaali.j2d(1395, 1, 23) // 2457490
```

### d2j(jdn)

Converts the Julian Day number to a date in the Imperial base calendar.

```js
jalaali.d2j(2457490) // { iy: 2595, im: 1, id: 23 } (via core calendar)
```

### g2d(gy, gm, gd)

Calculates the Julian Day number from Gregorian or Julian calendar dates. This integer number corresponds to the noon of the date (i.e. 12 hours of Universal Time). The procedure was tested to be good since 1 March, -100100 (of both calendars) up to a few million years into the future.

```js
jalaali.g2d(2016, 4, 11) // 2457490
```

### d2g(jdn)

Calculates Gregorian and Julian calendar dates from the Julian Day number (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both calendars) to some millions years ahead of the present.

```js
jalaali.d2g(2457490) // { gy: 2016, gm: 4, gd: 11 }
```

### imperialToDateObject(iy, im, id)

Convert Imperial calendar date to javascript Date object by giving Imperial year, month, and day.

```js
jalaali.imperialToDateObject(2580, 4, 30) // new Date(2021, 6, 21)
```

### imperialWeek(iy, im, id)

Return Saturday and Friday day of current week (week start in Saturday) for the Imperial calendar.

```js
jalaali.imperialWeek(2580, 4, 30) // { saturday: { iy: 2580, im: 4, id: 26 }, friday: { iy: 2580, im: 5, id: 1 } }
```

## License

MIT
