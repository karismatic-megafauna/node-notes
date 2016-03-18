# node-notes
Personalized CLI note taking application in node


## Usage
```sh
$ note new -1
 ```
Create a new note for the day from your template

```sh
$ note <ENTER NOTE DISCRIPTION HERE>
```
Adds the description to your last note object

```sh
$ note -work <ENTER NOTE DESCRIPTION HERE>
```
Pushes the description to your work note object

```sh
$ note -work -2c
```
Marks the second element in the work object as compelete via markdown `- [x]`

```sh
$ note -work -2d
```
Deletes the entry at the second location

```sh
$ note -work -2f
```
Marks the entry at the second location as failed via markdown `- [-]`

## Template Config
A template will look like this

```json
export const template1 = {
  "Note Title": {
    "cli-ref": "nt",
    "description": "meta data about this note",
    "items": [
      "Item 1",
      "Item 2",
      "Item 3",
      "Item 4"
    ]
  }
}
```
If no template is specified, the default is made.
If a template is specified, that note will be pre-filled with that template.

Ideas:
Exercise template, Coding template, work template, travel template etc


# Contributing
PR's are always welcome, forking model is fine, if you want to be a contributor send me an email or a tweet!
