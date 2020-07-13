# My Library

## Functionality

* Clicking on Add New Book pulls up a form. When submitted a new row is added to the table.
* Clicking the read checkbox will save the changed state.
* Clicking the X will delete the visual row and data in the database.
* Pressing escape on the form will take you back to the table view.

## Process

This is the first time I've used a table in a project. I learned a great deal about the different types of inputs and the many attributes that go along with it. Radio  buttons and checkboxes were the hardest inputs to set up because of the multiple attributes needed to get them to work properly.

Being that the table is a two dimensional object flexbox works well with formatting it to meet my needs. The toughest part of pulling the CSS together was the animation on the form button. I couldn't get my head around how the translate function manipulated the coordinates. After a bit of tinkering I got a sense of how translate works and was able to produce a slick animation.

The purpose of this project was to utilize the object constructor to create multiple objects with the ability to edit all entries. This project helped me familiarize myself with for...in and for...of loops. My ability to grab references to objects with nested functions has gotten stronger as well.

I used Firebase to connect the web app to a real time database. The pathing was tough to get down but after spending a day with familiarizing myself with the program I was able to connect all the data points to the database. Instead of starting with objects in the myLibrary array I started with the objects in Firebase so that every time books were added to the table they would reappear even if I refreshed the page.
