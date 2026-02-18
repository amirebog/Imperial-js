/*
  Expose Imperial (Shahanshahi) calendar functions.
*/
module.exports =
  { toImperial: toImperial
  , toGregorian: toGregorian
  , isValidImperialDate: isValidImperialDate
  , isLeapImperialYear: isLeapImperialYear
  , imperialMonthLength: imperialMonthLength
  , imperialToDateObject: imperialToDateObject
  , imperialWeek: imperialWeek
  }

/*
  Imperial years starting the 33-year rule.
*/
var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
  , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
  ]

/*
  Converts a Gregorian date to Imperial core (internal base calendar).
*/
function toImperialCore(gy, gm, gd) {
  if (Object.prototype.toString.call(gy) === '[object Date]') {
    gd = gy.getDate()
    gm = gy.getMonth() + 1
    gy = gy.getFullYear()
  }
  return d2j(g2d(gy, gm, gd))
}

/*
  Converts a Gregorian date to Imperial (Shahanshahi).
  Imperial year is calculated as an offset from the base solar calendar.
*/
function toImperial(gy, gm, gd) {
  var j = toImperialCore(gy, gm, gd)
  return { iy: j.jy + 1180, im: j.jm, id: j.jd }
}

/*
  Converts an Imperial date (internally represented) to Gregorian.
*/
function jalaaliToGregorian(jy, jm, jd) {
  return d2g(j2d(jy, jm, jd))
}

/*
  Converts an Imperial date to Gregorian.
  Imperial year is offset by 1180 from the internal base year.
*/
function toGregorian(iy, im, id) {
  var jy = iy - 1180
  return jalaaliToGregorian(jy, im, id)
}

/*
  Checks whether an Imperial core date (internally represented) is valid or not.
*/
function isValidImperialCoreDate(jy, jm, jd) {
  return  jy >= -61 && jy <= 3177 &&
          jm >= 1 && jm <= 12 &&
          jd >= 1 && jd <= jalaaliMonthLength(jy, jm)
}

/*
  Checks whether an Imperial date is valid or not.
*/
function isValidImperialDate(iy, im, id) {
  var jy = iy - 1180
  return isValidImperialCoreDate(jy, im, id)
}

/*
  Is this a leap Imperial core year or not? (internal representation)
*/
function isLeapImperialCoreYear(jy) {
  return jalCalLeap(jy) === 0
}

/*
  Is this a leap Imperial year or not?
*/
function isLeapImperialYear(iy) {
  var jy = iy - 1180
  return isLeapImperialCoreYear(jy)
}

/*
  Number of days in a given month in an Imperial core year (internal representation).
*/
function imperialCoreMonthLength(jy, jm) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  if (isLeapImperialCoreYear(jy)) return 30
  return 29
}

/*
  Number of days in a given month in an Imperial year.
*/
function imperialMonthLength(iy, im) {
  var jy = iy - 1180
  return imperialCoreMonthLength(jy, im)
}

/*
    This function determines if the Imperial (Persian) base year is
    leap (366-day long) or is the common year (365 days)

    @param jy Imperial calendar year (-61 to 3177)
    @returns number of years since the last leap year (0 to 4)
 */
function jalCalLeap(jy) {
  var bl = breaks.length
    , jp = breaks[0]
    , jm
    , jump
    , leap
    , n
    , i

  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error('Invalid Imperial year ' + jy)

  for (i = 1; i < bl; i += 1) {
    jm = breaks[i]
    jump = jm - jp
    if (jy < jm)
      break
    jp = jm
  }
  n = jy - jp

  if (jump - n < 6)
    n = n - jump + div(jump + 4, 33) * 33
  leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }

  return leap
}

/*
  This function determines if the Imperial (Persian) year is
  leap (366-day long) or is the common year (365 days), and
  finds the day in March (Gregorian calendar) of the first
  day of the Imperial year (jy).

  @param jy Imperial calendar year (-61 to 3177)
  @param withoutLeap when don't need leap (true or false) default is false
  @return
    leap: number of years since the last leap year (0 to 4)
    gy: Gregorian year of the beginning of Imperial year
    march: the March day of Farvardin the 1st (1st day of jy)
  @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
  @see: http://www.fourmilab.ch/documents/calendar/
*/
function jalCal(jy, withoutLeap) {
  var bl = breaks.length
    , gy = jy + 621
    , leapJ = -14
    , jp = breaks[0]
    , jm
    , jump
    , leap
    , leapG
    , march
    , n
    , i

  if (jy < jp || jy >= breaks[bl - 1])
    throw new Error('Invalid Imperial year ' + jy)

  // Find the limiting years for the Imperial year jy.
  for (i = 1; i < bl; i += 1) {
    jm = breaks[i]
    jump = jm - jp
    if (jy < jm)
      break
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }
  n = jy - jp

  // Find the number of leap years from AD 621 to the beginning
  // of the current Imperial year in the Persian calendar.
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4)
    leapJ += 1

  // And the same in the Gregorian calendar (until the year gy).
  leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

  // Determine the Gregorian date of Farvardin the 1st.
  march = 20 + leapJ - leapG

  // return with gy and march when we don't need leap
  if (withoutLeap) return { gy: gy, march: march };


  // Find how many years have passed since the last leap year.
  if (jump - n < 6)
    n = n - jump + div(jump + 4, 33) * 33
  leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }

  return  { leap: leap
          , gy: gy
          , march: march
          }
}

/*
  Converts a date of the Imperial calendar to the Julian Day number.

  @param jy Imperial year (1 to 3100)
  @param jm Imperial month (1 to 12)
  @param jd Imperial day (1 to 29/31)
  @return Julian Day number
*/
function j2d(jy, jm, jd) {
  var r = jalCal(jy, true)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}

/*
  Converts the Julian Day number to a date in the Imperial calendar.

  @param jdn Julian Day number
  @return
    jy: Imperial year (1 to 3100)
    jm: Imperial month (1 to 12)
    jd: Imperial day (1 to 29/31)
*/
function d2j(jdn) {
  var gy = d2g(jdn).gy // Calculate Gregorian year (gy).
    , jy = gy - 621
    , r = jalCal(jy, false)
    , jdn1f = g2d(gy, 3, r.march)
    , jd
    , jm
    , k

  // Find number of days that passed since 1 Farvardin.
  k = jdn - jdn1f
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      jm = 1 + div(k, 31)
      jd = mod(k, 31) + 1
      return  { jy: jy
              , jm: jm
              , jd: jd
              }
    } else {
      // The remaining months.
      k -= 186
    }
  } else {
    // Previous Imperial year.
    jy -= 1
    k += 179
    if (r.leap === 1)
      k += 1
  }
  jm = 7 + div(k, 30)
  jd = mod(k, 30) + 1
  return  { jy: jy
          , jm: jm
          , jd: jd
          }
}

/*
  Calculates the Julian Day number from Gregorian or Julian
  calendar dates. This integer number corresponds to the noon of
  the date (i.e. 12 hours of Universal Time).
  The procedure was tested to be good since 1 March, -100100 (of both
  calendars) up to a few million years into the future.

  @param gy Calendar year (years BC numbered 0, -1, -2, ...)
  @param gm Calendar month (1 to 12)
  @param gd Calendar day of the month (1 to 28/29/30/31)
  @return Julian Day number
*/
function g2d(gy, gm, gd) {
  var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

/*
  Calculates Gregorian and Julian calendar dates from the Julian Day number
  (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
  calendars) to some millions years ahead of the present.

  @param jdn Julian Day number
  @return
    gy: Calendar year (years BC numbered 0, -1, -2, ...)
    gm: Calendar month (1 to 12)
    gd: Calendar day of the month M (1 to 28/29/30/31)
*/
function d2g(jdn) {
  var j
    , i
    , gd
    , gm
    , gy
  j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  i = div(mod(j, 1461), 4) * 5 + 308
  gd = div(mod(i, 153), 5) + 1
  gm = mod(div(i, 153), 12) + 1
  gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return  { gy: gy
          , gm: gm
          , gd: gd
          }
}

/**
 * Return Saturday and Friday day of current week(week start in Saturday)
 * @param {number} jy jalaali year
 * @param {number} jm jalaali month
 * @param {number} jd jalaali day
 * @returns Saturday and Friday of current week
 */
function jalaaliWeek(jy, jm, jd) {
  var dayOfWeek = jalaaliToDateObject(jy, jm, jd).getDay();

  var startDayDifference = dayOfWeek == 6 ? 0 : -(dayOfWeek+1);
  var endDayDifference = 6+startDayDifference;

  return {
    saturday: d2j(j2d(jy, jm, jd+startDayDifference)),
    friday: d2j(j2d(jy, jm, jd+endDayDifference))
  }
}

/**
 * Return Saturday and Friday day of current week (week starts on Saturday)
 * for Imperial (Shahanshahi) calendar dates.
 * @param {number} iy imperial year
 * @param {number} im imperial month
 * @param {number} id imperial day
 * @returns Saturday and Friday of current week in Imperial calendar
 */
function imperialWeek(iy, im, id) {
  var jy = iy - 1180
  var week = jalaaliWeek(jy, im, id)
  return {
    saturday: { iy: week.saturday.jy + 1180, im: week.saturday.jm, id: week.saturday.jd },
    friday: { iy: week.friday.jy + 1180, im: week.friday.jm, id: week.friday.jd }
  }
}

/**
 * Convert Imperial calendar dates (internal representation) to javascript Date object
 * @param {number} jy imperial year
 * @param {number} jm imperial month
 * @param {number} jd imperial day
 * @param {number} [h] hours
 * @param {number} [m] minutes
 * @param {number} [s] seconds
 * @param {number} [ms] milliseconds
 * @returns Date object of the imperial calendar dates
 */
function jalaaliToDateObject(
  jy,
  jm,
  jd,
  h,
  m,
  s,
  ms
) {
  var gregorianCalenderDate = jalaaliToGregorian(jy, jm, jd);

  return new Date(
    gregorianCalenderDate.gy,
    gregorianCalenderDate.gm - 1,
    gregorianCalenderDate.gd,
    h || 0,
    m || 0,
    s || 0,
    ms || 0
  );
}

/**
 * Convert Imperial (Shahanshahi) calendar dates to javascript Date object
 * @param {number} iy imperial year
 * @param {number} im imperial month
 * @param {number} id imperial day
 * @param {number} [h] hours
 * @param {number} [m] minutes
 * @param {number} [s] seconds
 * @param {number} [ms] milliseconds
 * @returns Date object of the Imperial calendar dates
 */
function imperialToDateObject(
  iy,
  im,
  id,
  h,
  m,
  s,
  ms
) {
  var jy = iy - 1180
  return jalaaliToDateObject(jy, im, id, h, m, s, ms)
}

/*
  Utility helper functions.
*/

function div(a, b) {
  return ~~(a / b)
}

function mod(a, b) {
  return a - ~~(a / b) * b
}
