# node-notes
Personalized CLI note taking application in node


## Usage
```sh
$ note new
 ```
Create a new note for the day from your template

```sh
$ note <ENTER NOTE DISCRIPTION HERE>
```
Adds the note description to a misc object in the note
If no note exists, it creates one with the default template

```sh
$ note <Note Title> add <ENTER NOTE DESCRIPTION HERE>
```
Pushes the description to the specified object *key* with the description

```sh
$ note <cli-ref> complete -2 
```
Marks the second element in the object with matching cli-ref *value* as compelete via markdown `- [x]`

```sh
$ note <cli-ref> delete -2 
```
Deletes the entry at the second location

```sh
$ note <cli-ref> fail -2 
```
Marks the entry at the second location as failed via markdown `- [-]`


## Example workflow

```sh
$ note new 
```
```sh
$ note nt add Item 4 
```

```sh
$ note nt complete -2
```

```sh
$ note nt fail -2
```

```sh
$ note nt delete -2
```


## Template Config
A template will look like this

`a-config.json`
```json
{
  "Note Title": {
    "cli-ref": "nt",
    "description": "meta data about this note",
    "items": [
      { 
        "description": "Item 1",
        "status": "complete"
      },
      { 
        "description": "Item 2",
        "status": "failed"
      },
      { 
        "description": "Item 3",
        "status": "incomplete"
      },
    ]
  }
}
```

`some-config.json`
```json
{
  "Another Note Title": {
    "cli-ref": "ant",
    "description": "meta data about this note",
    "items": [
      { 
        "description": "Item 1",
        "status": "complete"
      },
      { 
        "description": "Item 2",
        "status": "failed"
      },
      { 
        "description": "Item 3",
        "status": "incomplete"
      },
    ]
  }
}
```

## Some rules
- If no template is specified, the default is made.
- If a template is specified, that note will be pre-filled with that template.
- If no object is specified with a new note, it will add it to an object called `Misc`

Ideas:
Exercise template, Coding template, work template, travel template etc


# Contributing
PR's are always welcome, forking model is fine, if you want to be a contributor send me an email or a tweet!
