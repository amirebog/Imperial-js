# Shahanshahi (Imperial) JavaScript

A lightweight JavaScript library for converting **Shahanshahi (Imperial, Persian-based)** and Gregorian calendar systems to each other.

---

## Install

### Node.js

```bash
npm install shahanshahi-calendar
```

Then import it:

```js
const imperial = require('shahanshahi-calendar');
```

---

## API

### toImperial(gy, gm, gd)

Converts a Gregorian date to Shahanshahi.

```js
imperial.toImperial(2026, 2, 18)
// { iy: 2585, im: 2, id: 18 }
```

### toImperial(date)

Converts a JavaScript `Date` object to Shahanshahi.

```js
imperial.toImperial(new Date(2026, 1, 18))
// { iy: 2585, im: 2, id: 18 }
```

---

### toGregorian(iy, im, id)

Converts a Shahanshahi date to Gregorian.

```js
imperial.toGregorian(2585, 2, 18)
// { gy: 2026, gm: 2, gd: 18 }
```

---

### isValidImperialDate(iy, im, id)

Checks whether a Shahanshahi date is valid.

```js
imperial.isValidImperialDate(2585, 12, 30)
// true
```

---

### isLeapImperialYear(iy)

Checks if a Shahanshahi year is a leap year.

```js
imperial.isLeapImperialYear(2585)
// true or false
```

---

### imperialMonthLength(iy, im)

Returns number of days in a given month of a Shahanshahi year.

```js
imperial.imperialMonthLength(2585, 12)
// 30
```

---

### imperialToDateObject(iy, im, id)

Converts a Shahanshahi date to a JavaScript `Date` object.

```js
imperial.imperialToDateObject(2585, 2, 18)
// new Date(2026, 1, 18)
```

---

### imperialWeek(iy, im, id)

Returns Saturday and Friday of the current week (week starts on Saturday).

```js
imperial.imperialWeek(2585, 2, 18)
// { 
//   saturday: { iy: 2585, im: 2, id: 14 }, 
//   friday:   { iy: 2585, im: 2, id: 20 } 
// }
```

---

## License

MIT
