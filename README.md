# audioJS
AudioJS is a agnostic and cross-browser lib to work easily with the AudioContext API of HTML5.

## Browser Compatibility
AudioJS is compatible with the following browsers/version:
* Google Chrome 27.0+
* Firefox 23.0+
* Safari 6.0+
* IOS Safari 6.0-6.1+
* Opera 15.0+

# Properties
* **file** <code>String</code> (<code>undefined</code> by default)
* **autoPlay** <code>Boolean</code> (<code>false</code> by default)

## Methods
* audioJS.<code>play()</code>
* audioJS.<code>stop()</code>

**Examples**
```js
	var audio = window.audioJS({
		file: 'audio.mp3'
	});

	audio.play();

	window.setTimeout(function(){
		audio.stop();
	}, 4000);
```
