/*
  * audioJS
  * author: Evandro Leopoldino Gonçalves <evandrolgoncalves@gmail.com>
  * https://github.com/evandrolg
  * License: MIT
*/
(function(window){
    'use strict';

    var ajax = function(params) {
        var httpRequest = new XMLHttpRequest();

        httpRequest.addEventListener('load', function() {
            params.success(httpRequest.response);
        }, false);

        httpRequest.open('GET', params.file, true);
        httpRequest.responseType = 'arraybuffer';
        httpRequest.send();
    };

    var CallbackManager = function() {
        return {
            register: function(obj) {
                this.callback = obj.callback;
                this.context = obj.context;
            },

            execute: function() {
                if (this.callback) {
                    this.callback.call(this.context);
                }
            }
        };
    };

    var AudioJS = function(params) {
        if (!params) {
            throw 'You need to pass a value as parameter!';
        }

        this._cachedVariabes(params);
        this._load();
    };

    AudioJS.prototype = {
        _validateFormat: function() {
            var regex = /\.(mp3|opus|ogg|wav|m4a|weba)$/;
            var isValid = regex.test(this.file);

            if(!isValid) {
                throw 'The format of the audio file is invalid!';
            }
        },

        _createInstance: function() {
            var AudioContext = window.AudioContext || window.webkitAudioContext || null;
            var hasSupport = AudioContext;

            if (!hasSupport) {
                throw 'Your browser does not support API AudioContext!';
            }

            this.audioContext =  new AudioContext;
        },

        _cachedVariabes: function(params) {
            this._createInstance();

            var isString = typeof params === 'string';

            if (isString) {
                this.file = params;
            } else {
                this.file = params.file;
                this.autoPlay = params.autoPlay;
                this.loop = params.loop || false;
                this.volume = params.volume || 1;
            }

            this._validateFormat();

            this.callbackManager = new CallbackManager();
        },

        _load: function() {
            var that = this;

            ajax({
                file: this.file,
                success: function(response) {
                    that._decodeAudioData.call(that, response);
                }
            });
        },

        _decodeAudioData: function(response) {
            var that = this;
            var audioContext = this.audioContext;

            audioContext.decodeAudioData(response,
                function(buffer) {
                    that.source = audioContext.createBufferSource();
                    that.source.buffer = buffer;
                    that.source.connect(audioContext.destination);
                    that.source.gain.value = that.volume;

                    if (that.autoPlay || that.shouldPlay) {
                        that.callbackManager.register({
                            callback: that._play,
                            context: that
                        });

                        that.callbackManager.execute();
                    }
                },

                function(){
                    throw 'Decoding the audio buffer failed!';
                }
            );
        },

        _play: function() {
            this.source.loop = this.loop;
            this.source.start(0);
            this.isStarted = true;
        },

        play: function() {
            this.callbackManager.register({
                callback: this._play,
                context: this
            });

            this.shouldPlay = true;
        },

        stop: function() {
            if (this.isStarted) {
                this.source.stop(0);
                this.isStarted = false;
            }
        }
    };

    window.audioJS = function(params) {
        return new AudioJS(params);
    };
}(this));