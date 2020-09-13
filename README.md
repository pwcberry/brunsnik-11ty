# Eleventy for brunsnik.net

## Import Word documents

### Poetry

To import poems, use the `poetry.js` script. You can import Word documents from a directory:

```shell script
node scripts/poetry.js src/website/poetry/ ~/Documents/Writing/Poetry
```

or individual files:

```shell script
node scripts/poetry.js src/website/poetry/ ~/Documents/Writing/Poetry/.docx
```

The parameters for the script are:

```shell script
node scripts/poetry.js [output] [dir] | [file] [file] ...
```
