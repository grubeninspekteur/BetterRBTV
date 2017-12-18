# BetterRBTV Browser Extension
Comfort functions for YouTube™ Gaming Live.

## Features
* Replacement of keywords known from another well-known streaming site
* Colored names
* Hide avatars
* Save space
* Ignore/highlight users, filter chat messages

## Development

### Installation

If you want to deploy the add-on, you can use the [Gulp-Tasks](gulpjs.com):
1. Install [NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
2. Run `$ npm install`

If you install npm from your package manager, you may have to `sudo ln -s /usr/bin/nodejs /usr/bin/node`

### Configuration
We use a `config.json` file in the roote directory for configuration.

This file is in the `.gitignore` because it contain secrets and because of that should **NEVER** be commited.

#### Firefox
There is [known bug](http://stackoverflow.com/questions/38345406/error-when-defining-a-firefox-webextensions-options-page/38347820#38347820) with Firefox.

So we need to add our App-ID to the `config.json`:
```json
{
  "firefoxId": "my-extension@example.com"
}
```

### Distribution

Once the changes are in-place and ready for distribution:

1. Run `$ gulp dist`
2. Choose the new Version you want to apply

The `/dist` folder will contain ready to dist packages.
