describe('audio-js', function(){
    describe('instance', function(){
        it('should exist function audioJS', function(){
            expect(audioJS).toBeDefined();
        });

        it('should throw exception if function audioJS not receive parameter when called', function(){
            var instanceFunction = function(){
                audioJS();
            };

            expect(instanceFunction).toThrow();
        });

        describe('parameters', function(){
            beforeEach(function(){
                this.verifyInstanceWithParameters = function(params){
                    var audio = audioJS(params);
                    var isObject = typeof audio === 'object';

                    expect(isObject).toBeTruthy();
                };
            });

            it('should be posible create instance receiving string as parameter', function(){
                this.verifyInstanceWithParameters('abertura.mp3');
            });

            it('should be posible create instance receiving dict as parameter', function(){
                this.verifyInstanceWithParameters({
                    file:'audio.mp3',
                    autoPlay: true
                });
            });

            it('should be posible create instance receiving file as string parameter', function(){
                this.verifyInstanceWithParameters('audio.mp3');
            });

            it('should generate exception if the file format is invalid', function(){
                var instanceFunction = function() {
                    audioJS('audio.mp4');
                };

                expect(instanceFunction).toThrow();
            });
        });
    });

    describe('methods', function(){
        beforeEach(function(){
            this.audioJS = window.audioJS({
                file: 'audio.mp3'
            });

            this.verifyMethod = function(method){
                var isMethod = typeof this.audioJS[method] === 'function';
                expect(isMethod).toBeTruthy();
            };
        });

        it('should exist method play', function(){
            this.verifyMethod('play');
        });

        it('should exist method stop', function(){
            this.verifyMethod('stop');
        });
    });
    
    describe('methods with loop', function(){
        beforeEach(function(){
            this.audioJS = window.audioJS({
                file: 'audio.mp3',
                loop: true
            });

            this.verifyMethod = function(method){
                var isMethod = typeof this.audioJS[method] === 'function';
                expect(isMethod).toBeTruthy();
            };
        });

        it('should exist method play', function(){
            this.verifyMethod('play');
        });

        it('should exist method stop', function(){
            this.verifyMethod('stop');
        });
    });
    
    describe('play and re-play', function(){
        beforeEach(function(){
            this.audioJS = window.audioJS({
                file: 'audio.mp3',
                loop: false
            });

            this.verifyMethod = function(method){
                var isMethod = typeof this.audioJS[method] === 'function';
                expect(isMethod).toBeTruthy();
            };
        });

        it('should exist method play', function(){
            this.verifyMethod('play');
        });

        it('should exist method stop', function(){
            this.verifyMethod('stop');
        });

        it('should be able to stop and play again', function() {
            this.audioJS.stop();
            this.audioJS.play();
        });
    });
});