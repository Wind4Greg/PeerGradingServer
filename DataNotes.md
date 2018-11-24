---
title: Notes on example data structures and such
author: Dr. Greg M. Bernstein
created: 2018-11-19T19:20:22.995Z
---

# Date and Time

How to get date-time in and out of JSON for things like due dates and submission dates.

From [post](https://stackoverflow.com/questions/4511705/how-to-parse-json-to-receive-a-date-object-in-javascript) can use 

```javascript
var jsonDate = (new Date()).toJSON();
var backToDate = new Date(jsonDate);
console.log(jsonDate);
```

See [MDN Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) where they have some cross browser concerns.