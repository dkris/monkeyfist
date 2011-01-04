## MonkeyFist

v0.01

a jQuery micro-framework that allows for crazy monkey patching and
callback chaining.

If you're sick and tired of having to use more than one doc ready when loading multiple scripts, MonkeyFist has an answer.

## Usage

Define the jqueries that you want fired on every page (or not) in
fn.liveEvents and fn.bindEvents in monkeyfist.js. There's super
voodoo-juju at the tops of those functions, so be sure to declare your
custom functionality after the comments. These will be your defaults
that get called on doc ready everytime you call MF.initialize() (or
not).

At some later point in time, in some other file, all you need to do to
add onto your global defaults is declare some named functions, and pass
them into MF.initialize() like so:

    monkeyfist.js:

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

    ...

    someOtherFile.js:

    function myAwesomeLiveEvents(){
      // rad sick jqueries
    }

    function myAwesomeBindEvents(){
      // even moar rad sick jqueries
    }

    MF.initialize( myAwesomeLiveEvents, myAwesomeBindEvents );

Doing that will cause the following to happen:

1. Call default liveEvents
2. Call myAwesomeLiveEvents
3. Wait for document ready
4. Call default bindEvents
5. Call myAwesomeBindEvents

## There's even more!

So if that wasn't cool enough, this *probably* is:

Say you're really, really in need of firing something **before** one
of your default functions. Piece of cake.

    (same code from above)
    ...

    function myAwesomeBindEvents(){
      // even moar rad sick jqueries
    }

    myAwesomeBindEvents.params = {
      hoist: function(){
        // your extra special code
      }
    };

    MF.initialize( myAwesomeLiveEvents, myAwesomeBindEvents );

Now, this will happen:

1. Call default liveEvents
2. Call myAwesomeLiveEvents
3. Wait for document ready
4. ** Your special code **
5. Call default bindEvents
6. Call myAwesomeBindEvents

This works for both liveEvents and bindEvents.

## But wait! There's still something left!

So if you're still unconvinced, what if I told you that you could
selectively override those defaults? That's pretty easy too.

    (same code from the previous 2 examples)
    ...

    myAwesomeLiveEvents.params = {
      hoist: function(){
        // the really good code goes here
      },
      greedy: true
    };

    myAwesomeBindEvents.params {
      hoist: function(){
        // your extra special doc ready code
      },
      greedy: true
    };

    MF.initialize( myAwesomeLiveEvents, myAwesomeBindEvents );

Now this:

1. the really good code
2. myAwesomeLiveEvents()
3. extra special doc ready code
4. myAwesomeBindEvents()

## And there's more on the way!

## Tests

If you want to pull this down and run the tests, you'll need a version
of ruby and rubygems that support [Bundler](http://gembundler.com/). Once you've got that,

    gem install bundle
    bundle install

to install all dependencies ([Jasmine](https://github.com/pivotal/jasmine), [evergreen](https://github.com/jnicklas/evergreen)).

To run the tests, use

    evergreen run

### License

It's MIT, yo
