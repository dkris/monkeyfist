(function( $ ) {

  var MonkeyFist, MF = (function MF() {
    var slice = Array.prototype.slice,

    fn = {
      // ##MF.initialize() 
      // Creates 2 callback functions: preReady & onReady,
      // which act as callback chains for passed in arguments with
      // over-rideable defaults. Uses `apply()` to pass additional
      // arguments
      initialize: function(preDom, postDom){
        var pre_params = (preDom && !!preDom.params) ? preDom.params: null,
            ready_params = (postDom && !!postDom.params) ? postDom.params: null,
            preReady = new fn.constr( fn.liveEvents ),
            onReady = new fn.constr ( fn.bindEvents );

        preReady.apply( pre_params, [ preDom ] );
        $( onReady.apply( ready_params, [ postDom ] ) );
      },
      // ##MF.constr()
      // Creates a constructor that returns a callback chain for
      // with any functions passed as arguments. If any of the arguments have a params object, that 
      // will passed to each function.
      constr: function() {
        var args_orig = slice.call(arguments);

        return function constr(){
          var args = args_orig.concat(slice.call(arguments)),
              i = 0,
              a = args.length,
              params = $.isPlainObject(this) === true ? this: null;

          for(i; i < a; i += 1 ) {
            if( $.isFunction( args[i] ) ) {
                args[i].call(params);
            }
          }
        };
      }
    };

    fn.liveEvents = function(){
      var params = this;
      if( $.isPlainObject(params) && $.isFunction( params.hoist ) ){
        if( !!params.greedy ) {
          return params.hoist();
        } else {
          params.hoist();
        }
      }
      /** Your custom code lives here :) */
    };

    fn.bindEvents = function(){
      var params = this;
      if( $.isPlainObject(params) && $.isFunction( params.hoist ) ){
        if( !!params.greedy ) {
          return params.hoist();
        } else {
          params.hoist();
        }
      }
      /** Your custom code lives here :) */
    };

    return fn;
  })();

  // Attach MF object to window for later use
  window.MF = window.MonkeyFist = MF;
})(jQuery);
/**
  Copyright (C) 2011 by Samuel Breed and Quick Left

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
