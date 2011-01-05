## MonkeyFist

                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                         `.::::/+/-....`                      
                                                                     `--os+::/++hmNo::/++:.                   
                                                                 `/+yo+/oyh+:smd-.---+so/smd+.`               
                                                                -h/```:-``-:--sms+:+yshh:-/+s/o+`             
                                                             .osoyss+-..:/``:.`.//.+y+/--/s+/s:/y/`           
                                                           `oho/:``.+s:/omy:.:/` .. `/o/smy.`:y/-ds.          
                                                           od/-.:o:` .-``:yooohy-`./` -/-h:`:+:/yyyo`         
                                                         -/s:-/+o+dh+..o. `-..oho++hs. /mh//- `oh+oy.         
                                                       `o/..-. `--`-os+hy:``+:`./-.+hs/+Nd/` `/sh. oo`        
                                                      `o+/+-`.-. `:` ::./yy:/do .:. `:::No..-.`-+ .oso        
                                                  ` `-.syosdy/+d+./o. /: .:--odo-.+- `ohm+-``.+h:.:.`h-       
                 `   ` ``````````````...:---`-/:-..-/s--:d/-o+-yy+shy-`/- `-` `s//sm+:yh-....ody-  .s+s.      
                .--/+:.+o:-+s+::/s+..-sho:.---so+:.` `.+dmo:. :+.:/-odo+y: `-` `:-`dmho:````.+/---/yd.ho`     
         .`  ::``.-/ho.`-//``-:.``-/:+:`  ``````.../o:  :d- .-+o:. -o:.+dho:o+  :yss-..--./shy//:.:ys/ss`     
      `  -+:` -/:` .+dd+` -o- `:o- `:o- `+ddhy+/:--+mmo`/+.:-`os` :o+`./-`hNNmyso//-```...oy-``./yh:.-yo`     
     `::-`.+s-``-+:..omho. .//.-so/` `/+yh+sh:```.:s++:odd+` -y-.-.:hs.  .oNdo+/------:/os+-.:-.oh:./+::`     
       .:/+/yyo:-/dho:.`:y.  -:. :my-  -yh: .//.    .:-yN/  .-+h: `/h/ `:--d-...` `-.-+y:` ``.:oh/--../-      
            `   .-+yyh/-/ys+.`.ooysyy+. `/s/``../-.    :m::+-`so` --o:-:` oh` `-+ososys+//:/:-hh-..-+do       
                   :hd+-` `..-//++..-+y+-:-:/+:-:oho+..+dds. :do::` /hy.`.-m+/+:+hy/-.     `:+so:::::y-       
                    ``        ```   ``.``...````.....`.--y/ -/.ys` `.s. .``Nh+:....:-.///syo:.```.-oy.        
                                                         oo:+``+: -:`/`.. :sy..-:-.--.:/oso-`.--:+hh-         
                                                         .hd- -o:/o` sso -:.s/``-:hdds:--..````.:/:`          
                                                          .o: :--d` `.+s -``/yd+:+so/-`..:/::sys-             
                                                           `/oh- /:`. -y:+``:.sy/...-+o+/:--+/.               
                                                             -++:ymo- .-ss`-: /`/hyyhy+/+-`                   
                                                                .:+so+s-`shms`-y/:ohs:`                       
                                                                     .:++ydyo/shhys.                          
                                                                         ``                                   
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              

v0.01

a jQuery micro-framework that allows for crazy monkey patching (not
really) and
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

1. **the really good code**
2. myAwesomeLiveEvents()
3. **extra special doc ready code**
4. myAwesomeBindEvents()

When setting `params.greed = true`, the default callbacks **are not
fired**.

## That's pretty cool, but what else can it do?

Since MonkeyFist is a micro-framework, so it's feature set it pretty small.
But it does have methods other than `initialize()`.

`MF.constr()` is a factory for producing callback chains. The first time
you call constr(), you can pass it as many functions as you want, and
these become the base for your callback chain.

    var m = MF.constr( yourRadFunction, anotherCoolFunction );
    m();

Executes the arguements in order and stores the base callback in `m`.
You can tack on an ad hoc callback onto this really easily.

    m( someOtherFunction );

That will execute the first 2 functions, then `someOtherFunction()`.

If you need to store another callback permanently, just rebuild it with
`MF.constr()`.

    m = MF.constr( m, someOtherFunction );

Now, whenever you invoke `m()`, it will execute the original contents
_and_ the additional callback:

    yourRadFunction(); anotherCoolFunction(); someOtherFunction();


#### And there's more on the way!

## Tests

Tests for MonkeyFist come in two varieties:

* [Qunit](http://docs.jquery.com/Qunit)
* [Jasmine](https://github.com/pivotal/jasmine) (w/ some help from [Evergreen](https://github.com/jnicklas/evergreen))

Both test suites have identical coverage.

#### QUnit

The QUnit tests live in the `/test` directory. Just open
`/test/index.html` in a browser to watch them run.

There are also some [JSLitmus](http://www.broofa.com/Tools/JSLitmus/) benchmarks.

#### Jasmine & Evergreen

To run the Jasmine tests, you'll need a version of Ruby and Rubygems that support [Bundler](http://gembundler.com/). I
also highly recommend creating a gemset with [rvm](http://rvm.beginrescueend.com/) to isolate the dependencies from your global gemset.

Once you've got that, just run

    gem install bundle
    bundle install

to install all dependencies ([Jasmine](https://github.com/pivotal/jasmine) and [evergreen](https://github.com/jnicklas/evergreen) both have a handful of dependencies).

Then run the test suite with

    evergreen run

### License

It's MIT, yo.
