# CarBug

داشبورد فارسی عیب‌یابی خودرو از روی صدا، بو و دود؛ سایت ایستا برای GitHub Pages.

بخش‌ها: داشبورد، عیب‌ها، عیب‌یاب، چراغ‌ها، ذخیره‌ها و تنظیمات (تم، انیمیشن، پاک‌سازی).

## ساختار
```
index.html            صفحه‌ی اصلی
css/style.css         ظاهر و انیمیشن‌ها
js/app.js             منطق برنامه
data/faults.js        فهرست عیب‌ها (اینجا ویرایش کنید)
data/lights.js        چراغ‌های داشبورد
sounds/               فایل‌های صوتی دارای مجوز
assets/icons/         آیکن‌ها
sw.js, manifest.webmanifest   آفلاین و نصب PWA
scripts/validate.js   اعتبارسنجی داده‌ها
.github/              workflow انتشار و اعتبارسنجی، قالب Issue
```

## انتشار
فایل‌ها را در مخزن بگذارید و در Settings ← Pages منبع را «GitHub Actions» کنید.

## افزودن ایراد (data/faults.js)
```js
{cat:"موتور",t:"تق‌تق",sev:2,cost:1,title:"...",sound:"...",when:"...",causes:["..."],act:"...",
 q:"engine knocking sound", link:"https://...", m:["پراید"], audio:"sounds/x.mp3"}
```
`sev` و `cost` از 1 تا 3 هستند؛ `q`، `link`، `m` و `audio` اختیاری‌اند. قبل از PR: `node scripts/validate.js`.
فایل صوتی بعد از اولین پخش برای حالت آفلاین ذخیره می‌شود؛ فقط فایل‌های دارای مجوز اضافه کنید.

داده‌ها راهنما هستند و باید با مکانیک تأیید شوند.
