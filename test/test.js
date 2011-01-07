// Make sure that jQuery and our 2 MF namespaces exist
test("Basic requirements", function() {
  expect(3);
  ok( $, "$");
  ok( MF, "MF");
  ok( MonkeyFist, "MonkeyFist");
});

// Confirm that MF is a global and contains all the right stuff
test("MF core", function() {
  expect( 4 );
  ok( window.MF, "MF should be attached to window");
  equals( typeof MF, "object", "MF should be an object");
  equals( typeof MF.constr, "function", "MF.constr() should be a function");
  equals( typeof MF.initialize, "function", "MF.initializer() should be a function");
});

// Test the Constr Method for building callback chains
module("MF.constr()");

  var m,
      i = 0,
      // Foo will keep track of callback execution
      foo = [],
      // This is a basic function to be used as an argument in MF.constr()
      arg = function(){
        if( this.bar ) {
          foo.push("bar");
        } else {
          foo.push(i += 1);
        }
      };

  // This is a reset for our global vars
  function constrTearDown(){
    m = null;
    i = 0;
    foo = [];
  }

  test("Basic requirements", function() {
    expect(1);
    equals( typeof MF.constr( function(){} ), "function", "constr should return a function");
  });

  test("should execute a callback chain", function() {
    m = new MF.constr( arg, arg );
    m();

    expect( 3 );
    equals( foo.length, 2, "each callback should be executed once" );
    equals( foo[0], 1, "foo[0] should equal 1");
    equals( foo[1], 2, "foo[1] should equal 2");

    constrTearDown();
  });

  test("should allow for recursion", function() {
    var x = new MF.constr( arg );
    m = new MF.constr( x, arg );

    m();

    expect( 3 );
    equals( foo.length, 2, "each callback should be executed once" );
    equals( foo[0], 1, "foo[0] should equal 1");
    equals( foo[1], 2, "foo[1] should equal 2");

    constrTearDown();
  });

  test("should continue taking arguments", function() {
    m = new MF.constr( arg );
    m( arg, arg );

    expect( 2 );
    equals( foo.length, 3, "each callback should be executed once");
    equals( foo[2], 3, "foo[2] should equal 3");

    constrTearDown();
  });

  test("should work w/o new", function() {
    m = MF.constr( arg, arg );
    m();

    expect( 3 );
    equals( foo.length, 2, "each callback should be executed once" );
    equals( foo[0], 1, "foo[0] should equal 1");
    equals( foo[1], 2, "foo[1] should equal 2");

    constrTearDown();

  });

  test("should ignore callbacks that aren't functions", function() {
    m = new MF.constr( arg, "string", {}, 9001 );

    m();

    expect( 2 );
    equals( foo.length, 1, "only one callback should have fired");

    foo = [];

    m( "string", 9001, arg, [] );

    equals( foo.length, 2, "only two callbacks should have fired");

    constrTearDown();
  });

  test("should honor contextual data", function() {
    m = new MF.constr( arg );
    m.call({ bar: true });

    expect( 1 );
    equals(foo[0], "bar", "normal functionality is overridden");
    constrTearDown();
  });

module("MF.initialize()");

  var customliveEvents, custombindEvents;

  function setInitDefaults(){
    // overwriting the default namespaced bindevents and live events to confirm execution order
    MF.liveEvents = function(){ foo.push('first'); };
    MF.bindEvents = function(){ foo.push('second'); };
  }

  function initTearDown(){
    customliveEvents = null;
    custombindEvents = null;
    foo = [];
    i = 0;
  }

  test("should support callback hoisting", function() {
    customliveEvents = function(){ foo.push('first'); };
    customliveEvents.params = {};
    customliveEvents.params.hoist = function(){ foo.push('hoisted'); };

    MF.initialize( customliveEvents );

    equals(foo[0], "hoisted", "The 'hoisted' callback is fired first");
    equals(foo[1], "first", "And is followed by the 'normal' callback");

    initTearDown();

  });

  test("should support greedy hoisting", function(){
    var params = {};
    params.hoist = function(){
      foo.push("hoisted");
      return "hoisted";
    };
    params.greedy = true;

    expect( 2 );
    equals(MF.liveEvents.call( params ), "hoisted", "overwriting via contextual `this` in liveEvents");
    equals(MF.bindEvents.call( params ), "hoisted", "overwriting via contextual `this` in bindEvents");

    initTearDown();
  });

  test("should use constructors to execute a callback chain", function(){
    liveEvents = arg;
    bindEvents = arg;

    // NB: Once we've reset the defaults, there's no going back.
    setInitDefaults();

    MF.initialize(liveEvents, bindEvents);

    expect( 4 );
    equals(foo[0], "first", "default callback");
    equals(foo[1], 1, "passed callback");
    equals(foo[2], "second", "default callback #2");
    equals(foo[3], 2, "passed callback #2");

    initTearDown();
  });

  test("should know what to do with null arguments", function(){
    bindEvents = arg;

    MF.initialize(null, bindEvents);

    expect( 3 );
    equals(foo[0], "first", "will fire default callback");
    equals(foo[1], "second", "will fire passed callback");
    equals(foo[2], 1, "will fire default callback #2");

    initTearDown();
  });

  test("should fire defaults if you don't pass it anything", function(){
    MF.initialize();

    equals(foo[0], "first", "fires default callback #1");
    equals(foo[1], "second", "fires default callback #2");
    initTearDown();
  });

module('MF.helper.monkey()');

  function helperMonkeyTearDown(){
      foo = [];
  }

  test("should create a function", function(){
    var m = MF.helper.monkey( arg );

    expect( 2 );
    equals( typeof m, "function", "returns a function");

    m();

    equals( foo[0], 1, "executes second argument");
    helperMonkeyTearDown();
  });

  test("should allow callback hoisting", function(){
    expect( 4 );

    function a(){
      foo.push('normal callback');
    }

    var params = {
      hoist: function(){ foo.push('hoisted callback'); }
    },

    aa = MF.helper.monkey( a );

    aa.call(params);

    equals( foo[0], "hoisted callback", "hoisted is fired first");
    equals( foo[1], "normal callback", "followed by the regular function");

    foo = [];

    params.greedy = true;

    aa.call(params);

    equals( foo[0], "hoisted callback", "hoisted is fired first");
    equals( foo[1], undefined, "and the regular callback never fires");

    helperMonkeyTearDown();
  });

  xtest("should work as a method override for liveEvents & bindEvents", function(){
    var tmpMF = {};

    $.extend(tmpMF, MF);

    MF.liveEvents = MF.helper.monkey('predom', function onReady(){
      foo.push('preDom');
    });

    function preReady(){
      foo.push('passed liveEvents');
    }

    preReady.params = {
      hoist: function(){ foo.push('liveEvents hoist'); }
    };

    MF.bindEvents = MF.helper.monkey('domReady', function onReady(){
      foo.push('domReady');
    });

    function onReady(){
      foo.push('passed onready');
    }
    onReady.params = {
      hoist: function(){ foo.push('onready hosited'); }
    };

    bar = ["liveEvents hoist", "preDom", "passed liveEvents", "onready hoisted", "domReady", "passed onready"];

    MF.initialize(preReady, onReady);

    expect(1);
    deepEqual(foo, bar, "execution order is correct");

    foo = [];
    MF = tmpMF;

  });

