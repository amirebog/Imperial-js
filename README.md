# Shahanshahi (Imperial) JavaScript

A few JavaScript functions for converting **Shahanshahi (Imperial, Persian-based)** and Gregorian calendar systems to each other.

## Note

If you just need to display date and time in Persian calendar, you may use `Intl` which is ECMAScript Internationalization API with [good browser support](https://caniuse.com/mdn-javascript_builtins_intl_datetimeformat_format). For example:

```js
const d = new Date(2026, 1, 18) // February 18, 2026 Gregorian

// Simple format
console.log(new Intl.DateTimeFormat('fa-IR').format(d));
// => ۲۵۸۵/۲/۱۸ (Shahanshahi year)

// Full long format
console.log(new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => ۲۵۸۵/۲/۱۸, دوشنبه، ساعت ۰:۰۰:۰۰ (‎+۳:۳۰)

// Latin numbers
console.log(new Intl.DateTimeFormat('fa-IR-u-nu-latn', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => 2585/2/18

// English US locale with Persian calendar
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => Monday, 2/18/2585 AP at 12:00:00 AM GMT+3:30
About

Shahanshahi (Imperial) calendar is a solar calendar historically used in Persia.
This library provides conversion functions between Gregorian and Shahanshahi calendars.

Install
Node.js
npm install shahanshahi-calendar


Then import it:

const imperial = require('shahanshahi-calendar');

API
toImperial(gy, gm, gd)

Converts a Gregorian date to Shahanshahi.

imperial.toImperial(2026, 2, 18) // { iy: 2585, im: 2, id: 18 }

toImperial(date)

Converts a JavaScript Date object to Shahanshahi.

imperial.toImperial(new Date(2026, 1, 18)) // { iy: 2585, im: 2, id: 18 }

toGregorian(iy, im, id)

Converts a Shahanshahi date to Gregorian.

imperial.toGregorian(2585, 2, 18) // { gy: 2026, gm: 2, gd: 18 }

isValidImperialDate(iy, im, id)

Checks whether a Shahanshahi date is valid.

imperial.isValidImperialDate(2585, 12, 30) // true

isLeapImperialYear(iy)

Check if a Shahanshahi year is a leap year.

imperial.isLeapImperialYear(2585) // true or false

imperialMonthLength(iy, im)

Number of days in a given month in a Shahanshahi year.

imperial.imperialMonthLength(2585, 12) // 30

imperialToDateObject(iy, im, id)

Convert Shahanshahi date to a JavaScript Date object.

imperial.imperialToDateObject(2585, 2, 18) // new Date(2026, 1, 18)

imperialWeek(iy, im, id)

Return Saturday and Friday of the current week for the Shahanshahi calendar.

imperial.imperialWeek(2585, 2, 18)
// { saturday: { iy: 2585, im: 2, id: 14 }, friday: { iy: 2585, im: 2, id: 20 } }
