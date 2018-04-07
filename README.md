# The New York Time Scraper

### Overview

"yourNews" is a scraper app which captures the title and image of articles of People Magazine. The user is able to save their preferred articles and  add notes. and edit notes to one or multiple articles. 

You can check this app using heroku

https:

### Dependencies

`express`: builds server-side routes and functions

`request`: enables `cheerio` to get access to front-end code of http://people.com/news/

`cheerio`: scrapes front-end code from http://people.com/news/

`mongoose`: is in charge of database 

`morgan`: logs server-side requests and helps with debugging

`express-handlebars`: handles multiple html pages