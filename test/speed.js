(function(){

  var x, fn = function() {},
      fn2 = function() {};
      fn2.params = {
        hoist: fn
      };


  JSLitmus.test('MF.constr(): single callback', function(){
    x = MF.constr( fn );
  });

  JSLitmus.test('MF.constr(): single callback using new', function(){
    x = new MF.constr( fn );
  });

  JSLitmus.test('MF.constr(): multiple callbacks', function(){
    x = MF.constr( fn );
    x( fn, fn );
  });

  JSLitmus.test('MF.constr(): recursive callbacks', function(){
    x = MF.constr( fn );
    x( fn, x );
  });

  JSLitmus.test('MF.initialize(): no callbacks', function(){
    MF.initialize();
  });

  JSLitmus.test('MF.initialize(): normal callbacks', function(){
    MF.initialize( fn, fn );
  });

  JSLitmus.test('MF.initialize(): hoisted callbacks', function(){
    MF.initialize( fn, fn2 );
  });

})();
