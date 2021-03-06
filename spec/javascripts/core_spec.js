require('/libs/jquery-1.4.4.min.js');
require('/monkeyfist.js');


describe('MF core', function () {
  it("should return a MF object" , function() {
    expect(MF).toBeTypeOf('object');
  });

  it("should be a global" , function() {
    expect(MF).toBe(window.MF);
  });

  it("should be double namespaced", function() {
    expect(MonkeyFist).toEqual(MF);
  });

});


describe("MF.constr()", function(){

  var g, i = 1,
      foo = [],
      arg = function( biz ){
        if( this.bar ){
          foo.push("baaar");
        } else {
          foo.push( biz || i );
        }
        i += 1;
      };

  afterEach(function(){
    g = null;
    foo = [];
    i = 1;
  });

  it("should return a function", function(){
    g = new MF.constr();
    expect(g).toBeTypeOf("function");
  });

  it("should execute a callback chain", function(){
    g = new MF.constr(arg, arg);
    g();

    expect(g).toBeTypeOf("function");
    expect(foo[0]).toEqual(1);
    expect(foo[1]).toEqual(2);
  });

  it("should continue taking arguments", function(){
    g = new MF.constr( arg, arg );
    g( arg, arg);

    expect(foo[2]).toEqual(3);
    expect(foo[3]).toEqual(4);
  });

  it("should work more than once", function(){
    g = new MF.constr( arg, arg );

    g();
    g();

    expect(foo[2]).toEqual(3);
    expect(foo[3]).toEqual(4);
  });

  it("should honor contextual data", function(){
    g = new MF.constr( arg );
    g.apply({ bar: true }, [ arg ]);

    expect( foo[1] ).toMatch(/^ba+r$/);
  });

  it("should ignore callbacks that aren't functions", function(){
    g = new MF.constr( arg('soup'), "string" );
    g();

    expect( foo.length ).toEqual(1);
    expect( foo[0] ).toEqual("soup");
  });

});

describe("MF.initialize()", function(){

  var customliveEvents, custombindEvents,
      i = 1,
      foo = [],

      arg = function( biz ){
        if( this.bar ){
          foo.push("baaar");
        } else {
          foo.push( biz || i );
        }
        i += 1;
      };

  afterEach(function(){
    customliveEvents = null;
    custombindEvents = null;
    foo = [];
    i = 1;
  });

  function setDefaults(){
    // overwriting the default namespaced bindevents and live events to confirm execution order
    MF.liveEvents = function(){ foo.push('first'); };
    MF.bindEvents = function(){ foo.push('second'); };
    defaults_set = true;
  }

  it("should support callback hoisting", function(){
    customliveEvents = function(){ foo.push('first'); };
    customliveEvents.params = {};
    customliveEvents.params.hoist = function(){ foo.push('hoisted'); };

    MF.initialize( customliveEvents );

    expect(foo[0]).toEqual("hoisted");
    expect(foo[1]).toEqual("first");
  });

  it("should support greedy hoisting", function(){
    var params = {};
    params.hoist = function(){
      foo.push("hoisted");
      return "hoisted";
    };
    params.greedy = true;

    expect(MF.liveEvents.call( params )).toEqual("hoisted");
    expect(MF.bindEvents.call( params )).toEqual("hoisted");
  });

  it("should use constructors to execute a callback chain", function(){
    liveEvents = arg;
    bindEvents = arg;

    // NB: Once we've reset the defualts, there's no going back.
    setDefaults();

    MF.initialize(liveEvents, bindEvents);

    expect(foo[0]).toEqual("first");
    expect(foo[1]).toEqual(1);
    expect(foo[2]).toEqual("second");
    expect(foo[3]).toEqual(2);
  });

  it("should know what to do with null arguments", function(){
    bindEvents = arg;

    MF.initialize(null, bindEvents);

    expect(foo[0]).toEqual("first");
    expect(foo[1]).toEqual("second");
    expect(foo[2]).toEqual(1);
  });

  it("should fire defaults if you don't pass it anything", function(){
    MF.initialize();

    expect(foo[0]).toEqual("first");
    expect(foo[1]).toEqual("second");
  });



});


describe('MF.helper.monkey()', function(){

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

  afterEach(function(){
    foo = [];
  });

  it("should create a function", function(){
    var m = MF.helper.monkey( arg );

    expect( typeof m ).toEqual("function");

    m();

    expect( foo[0]).toEqual(1);
  });

  it("should allow callback hoisting", function(){

    function a(){
      foo.push('normal callback');
    }

    var params = {
      hoist: function(){ foo.push('hoisted callback'); }
    },

    aa = MF.helper.monkey( a );

    aa.call(params);

    expect( foo[0]).toEqual("hoisted callback");
    expect( foo[1]).toEqual("normal callback");

    foo = [];

    params.greedy = true;

    aa.call(params);

    expect( foo[0]).toEqual( "hoisted callback" );
    expect( foo[1]).toEqual( undefined );

  });



});
