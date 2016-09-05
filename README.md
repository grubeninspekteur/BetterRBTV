# BetterRBTV Google Chrome Extension
Erweiterungen für den YouTube-Live-Chat.

## Features
* Ersetzung von Twitch-Keywords
* Timestamps für Nachrichten
* Avatare verbergen
* Autocomplete von Benutzernamen nach "@"
* Chatnachrichten filtern

## Development

### Installation

To use the [Gulp-Tasks](gulpjs.com) you need to:
1. Install [NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
2. Run `$ npm install`

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
