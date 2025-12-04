---
title: Extra - λ
---

> Thanks to Chris Coombes for feedback on an earlier draft of this, and for doing so much with a much earlier presentation so as to inspire the work at all.

For today, we are going back to foundations -- some of the **oldest**, and most **fundamental** and **fascinating** ideas in the entire field of computer science.

To get there, we have to talk about a few people. 

## Act 1. The Logicians

The first, you may have heard of, **Alan Turing**. 

![Turing](/img/turing.jpg)

Turing was a **mathematician** and **logician** by training, and like many logicians around that time -- in the **1930s** -- he was fascinated by the problem of how you express _reasoning in mechanical ways_. 

In the present, we might call this programming, but remember, **this is the 1930s -- there are no computers**, so this was entirely on paper, on chalkboards, or described from person to person. 

However, it was these people, and the discoveries that they made, that enabled the breakthroughs that allowed the first computers to be built. The ideas were needed first before the machines could be built! **Today we'll rediscover some of those fundamental ideas.**

### Turing's accomplishments
Turing did many things -- he's famous for at least three that are worth mentioning --

1. From the very beginning, he was fascinated by the idea of **thinking machines**. He devised a test for whether a machine was intelligent. He was also interested in chess, and designed a **program to automatically play chess in 1948**; the extremely early computers that existed at that point were not capable enough for it, so he never saw it run.
2. During WWII, he helped figure out how to use machines (essentially, pre-computers) to crack what was previously unbreakable Nazi encryption. These involved the first somewhat programmable computers.
<figure>
     ![WWII Decryption Bombe](/img/bombe.jpg)
<figcaption>1945, Bletchley Park Bombe, used to break Nazi Enigma encryption</figcaption>
</figure>
3. Relevant to our class today, Turing also established fundamental results related to what can be expressed by a computer program. A model of computation he came up with, which involves an infinite tape and a machine in the middle that can read and write to the tape, **is still used to model what we can express in computers**. While this machine cannot be constructed (as the tape must be infinite in length), other models, **including the topic of todays lecture**, can be.
<figure>
   ![Turing Machine](/img/turingmachine.jpg)
<figcaption>Approximation of Turing Machine (with a finite tape), built in 2012</figcaption>
</figure>

### Persecution
Turing also, after WWII, was **publicly prosecuted** because he was gay and had no interest in hiding it. 

As a result of the conviction for homosexuality, Turing was prevented from being involved in any further government work, which essentially **cut him out of the ongoing development of computers**. This was work that built upon both his theoretical contributions and his practical work during WWII. He was also denied entry to the US based on the conviction, and forced to undergo hormone treatment. 

Just a few years later, at age 41, he took his own life. 

It's worth reflecting on this, both to **remember the ugliness that exists within our society**, not so long ago, and to think about how much more a person like Turing may have done in a society that accepted him -- the astounding quantity he accomplished in essentially 20 years of work is such that the [highest award in computer science](https://en.wikipedia.org/wiki/Turing_Award) is named after him. Who knows what he would have done if he had continued to work into the 60s and 70s, as computers expanded from massive and extremely limited government projects to powerful devices that began to resemble those we have today.

It's also a good reminder for us to **reflect on how many people may have never entered the field** -- we are so lucky that Turing did, and gave us these brilliant ideas, even if the high profile that it gave him ultimately led to such prosecution.

It's also important to remember these things aren't so distant in the past. Turing was only officially pardoned in England in 2013, and a law that pardoned men more generally who were convicted under laws banning homosexuality only passed in 2017. 

### Impossibility Results

The legacy that Turing gave us is incredible.

A fascinating example is that Turing proved what is now known as the **Halting Problem**, which was one of the first so-called **impossibility results**. 

The Halting Problem (which he _proved_) says:

> It is impossible to construct a program that, given another program as input, can determine whether or not the input program will run forever.

What is so interesting about that proof (and it parallels work by logician Kurt Gödel with other impossibility results) is that even while Turing and others were establishing the **immense generality of this new idea of computation**, they already were figuring out that **computation itself had fundamental limits.** 

**There were programs that were impossible to write.** Not, difficult to write, or, we don't know how to write, but mathematically impossible. 

### Computation is Complex
Computation is, indeed, deep. From the same era -- 1937 -- mathematician Lothar Collatz presented this seemingly simple problem:

**Is there an integer, when passed to the following function, that causes it to run forever?**

```pyret
fun collatz(n :: Number) -> Number:
  if n <= 1:
    n
  else if num-modulo(n,2) == 0:
    collatz(n / 2)
  else:
    collatz((n * 3) + 1)
  end
end
```

**It's a simple program**. You could have written it a couple weeks into this class. And yet, **we are 88 years later and we still don't know**. We've tried it on very large numbers ([all of them up to `2.36×10^21`](https://en.wikipedia.org/wiki/Collatz_conjecture)), and all that we have tried it has terminated for, but still we have no idea if there might be some very large number for which it runs forever.

## Act 2. Models of Computation

One central contribution that Turing gave was to create a **universal model of computation**, which is now called the Turing machine, which is a idealized model of a machine (it cannot be constructed in reality -- an approximation, where the tape is finite, is in a picture above) that is capable of expressing any program that can be expressed on any machine. 

This is a deep idea on its own -- that _anything_ that _any_ computer could express could be expressed on this simple machine dreamed up in the 1930s (even if the particular machine cannot be constructed). 

But, perhaps even more fascinating, that era involved **many different universal models of computation**, and one of Turings other results was showing that his Turing machine was equivalent to another -- the **Lambda Calculus** of his PhD advisor, Alonzo Church. 

### Moving towards the Lambda Calculus
The lambda calculus, unlike a Turing machine, can and has been used in real programs -- indeed, most languages can express it. It involves three things, all of which you have used in Pyret:

- lambda (anonymous functions) -- `lam(...): ... end`
- variables (necessary for lambda, really) -- `x`, `y`, etc.
- function application (to use the lambdas)  -- `f(x)`, etc.

And **that's it**. What Church and Turing showed was that **with these three things, and _nothing_ else, any program could be expressed.**
    
Now, if you pause and reflect a little, **this probably seems impossible**. 

Don't we need **numbers**, and **strings**, and **booleans**, and **conditionals**, and **adding**, and **for loops**, and **recursion**, and any number of other things that you've learned this semester? 

The goal of today, and next class, is to show you that you don't. There may be practical reasons to have these in languages (they allow programs to run faster, as they allow what we write to be closer to what our machines actually run), but **they do not allow us to write programs we could not write with just lambda, variables, and application**. 

This is a fascinating and fundamental result, and gets to the heart of the power and flexibility of computation.

## Act 3. The Lambda Calculus

Let us begin.

### Booleans: True, False, If

While we started class back in September with numbers, booleans are simpler data, so we begin our exploration of the lambda calculus with booleans. 

We want to be able to write programs like:

```pyret
true

true and false

if true:
  true
else:
  false
end

if not(true) or false:
  false
else: 
  true
end
```

In order to do that, we need a way of expressing, using just our three tools (lambda, variables, application), `true`, `false`, `and`, `or`, `not`, and `if`.

If we focus on `true` and `false`, these are _values_. i.e., they don't evaluate. Our only _value_ in the lambda calculus is... lambda. So it must be that:

```pyret
true = lam(...): ... end
false = lam(...): ... end
```

I write `=` here -- what I mean is that we are going to have a value (a `lam`) that _represents_ `true` and `false`. We won't have `true` and `false` in our language, but we can use these particular forms of `lam` to write programs that express boolean logic. i.e., all the examples above should be expressible with whatever choice we make.

Clearly, these two values should be _different_ (true is not false). 

Since there are lots of different lambda functions, just picking two different ones probably isn't enough -- let's think about we will want to use them `if`, and see if that helps us narrow down what they should be. Specifically, we want to be able to express:

```pyret
if COND:
  THEN
else:
  ELSE
end
```
Where `COND`, `THEN`, and `ELSE` are expressions -- `COND` should be a boolean (one of our `lam` booleans! As in, whatever we choose to represent true and false, that, or a program that evaluates to that, will be here), `THEN` and `ELSE` can be arbitrary. 

What `if` is doing, fundamentally, is using `COND` (our lambda calculus boolean) to decide whether to evaluate to `THEN` or to `ELSE`. 

**How can we possibly express this _decision_ when all we have are lambdas, variables, and function application?**

**And what should our representation of true and false be, using lambda, anyway?**

The answer to both of these questions ends up being the same:

> **A boolean is a function of _two_ arguments that returns only _one_ of them**. Then the `true` version can return one, and the `false` version can return the other. If we do this, `if` can work by _applying_ the boolean it gets. Essentially, the boolean encodes the choice, rather than `if`.

Let's make this concrete:

```pyret
TRUE = lam(x, y): x end
FALSE = lam(x, y): y end

IF = lam(c,t,e): c(t,e) end
```

If we apply this to a concrete example, like one of the ones we wanted to be able to express:

```pyret
if true:
  true
else:
  false
end
```

We can translate that to our lambda calculus representation as:

```pyret
IF(TRUE,TRUE,FALSE)
```

Or, if we substitute for our constants:

```pyret
(lam(c,t,e): c(t,e))( # if
  lam(x, y): x end,   # true
  lam(x, y): x end,   # true
  lam(x, y): y end    # false
  )
```

If we _run_ this, first we apply the `IF` lambda, substituting for the three arguments, yielding:

```pyret
(lam(x, y): x end)( # true
  lam(x, y): x end, # true
  lam(x, y): y end  # false
  )
```

This is another application (of `TRUE` to `TRUE` and `FALSE`), so we now apply it -- in this case, the second argument is ignored, and the body is just the first argument, so the result is:

```pyret
lam(x, y): x end
```

Or, `TRUE` -- exactly as desired.

Reading programs written in the pure lambda calculus can be pretty tricky (like the example we just had). 

For the rest of this lecture and the next, in order to make them easier to read, we'll use constant definitions we define for fragments of the lambda calculus that we want to re-use, and to the extent we can leave them as constants, or do multiple steps at once, we'll do that. These definitions won't ever involve recursion, so they can always just be substituted (yielding programs that look like the above). This means we are still writing programs in the pure lambda calculus, but always using the constants makes things a lot easier to read. 

So for the above, we would write:

```pyret
IF(TRUE,TRUE,FALSE)
```

And then would say that this steps to:

```pyret
TRUE
```

### Testing in Pyret

As we come up with more and more sophisticated **encodings** (a fancy word for what we just did with booleans -- figure out representations in the lambda calculus for `true`, `false`, and `if`), it will be more likely that we make mistakes. It will be really helpful to be able to actually _run_ our examples -- indeed, part of the benefit of using the lambda calculus for this (instead of, e.g., a Turing Machine) is that what we are writing are real programs.

However, one issue is that since our results will always be functions (the only value we have), Pyret will just print these out as `<function:anonymous>`, so we won't be able to tell if we what we got is what we wanted. 

  And functions, in Pyret (and many languages) cannot be compared for equality (as usually you wouldn't want to be checking that the actual code was equal, you'd want to know that the _behavior_ was equal, but that'd require calling the two functions on potentially infinite arguments!).

One way around this is to add a little bit of code to convert _back_ to ordinary Pyret values -- e.g., we can do this for our lambda calculus booleans (called **Church Booleans** after Alonzo Church) using the following function:

```pyret
fun tobool(cb):
  cb(true, false)
end
```

If we call `tobool(...)` on one of our lambda calculus booleans, we will get back a normal Pyret boolean. This means we can, for example, take our previous example and wrap it appropriately, and write a test:

```pyret
check:
  tobool(IF(TRUE,TRUE,FALSE)) is true
end
```

Clearly, `tobool(..)` is _not_ a term in the lambda calculus (it includes Pyret `true` and `false`, as well as a non-anonymous function). But, we'll only use this for testing, in order to read results, or, in some cases (e.g., for numbers), to be able to more easily construct example inputs (converting normal Pyret numbers into ones in the lambda calculus).

### And, Or, Not

So we've figured out `if`, `true`, and `false`, but the true test of our representation is if we can also come up with lambda calculus representations of `and`, `or`, and `not` that work with out representations of `true` and `false`. 

**What does that mean?**

Well, each should be a function -- `and` and `or` both take two booleans and return one boolean; `not` takes a boolean and returns a boolean. 

So:

```pyret
AND = lam(b1, b2): ... end
```

What should go in the `...`? Well, if `b1` is true (our representation of true!), then this function should return whatever `b2` is (as if `b2` is true, then `b1 and b2` is true, and if `b2` is false, then `b1 and b2` is false). Whereas if `b1` is false, then `b1 and b2` is false no matter what `b2` is.

So let's translate that into code, thinking about how `TRUE` and `FALSE` work.

If `b1` is `TRUE`, we know it is a function that returns its first argument, so in that case. In that case, we would want `AND` to be:

```pyret
AND = lam(b1, b2): b1(b2, ...) end
```

Since as we already figured out, if `b1` is true, then we want to just return `b2`.

What should the second argument to `b1` be? Well, if `b1` is `TRUE`, it doesn't matter. But if `b1` is `FALSE`, then it will ignore its first argument (so its fine if its `b2`) and will instead return whatever its _second_ argument is. What do we want that to return? `FALSE`! So let's make `AND` be:

```pyret
AND = lam(b1, b2): b1(b2, FALSE) end
```

`or` is similar -- except now if `b1` is `TRUE`, we want to return `TRUE`, and if it is `FALSE` want to return whatever `b2` is:

```pyret
OR = lam(b1, b2): b1(TRUE, b2) end
```

For `not`, we have a single boolean argument, and if we get `TRUE` as input, want to return `FALSE`, and if we get `FALSE`, want to return `TRUE`.

How can we do that? Well, we know that `TRUE` will return its first argument, so:

```pyret
NOT = lam(b): b(FALSE, ...) end
```

And if we get `FALSE`, then we know it will return its second argument, so we can complete as:


```pyret
NOT = lam(b): b(FALSE, TRUE) end
```

So, we can express booleans. Let's move on to numbers -- specifically, we'll stick to natural numbers (0,1,2,...).

### Numbers

Again we have task of representing values, this time things like:

```pyret
0
1
2
3
...
1 + 2
3 * 4
...
```

Let's focus on the numbers. Again, they are values, so we need to figure out a way to represent them with lambda, i.e.:

```pyret
ZERO = lam(...): ... end
ONE = lam(...): ... end
TWO = lam(...): ... end
...
```

And it should work for any natural number! How can we do that? One idea would be to have the number correspond to the number of arguments, i.e., 1 would be a one argument function 2 would be a two argument function (and whose body did...)... but since we can't create functions of dynamic number of arguments, it would seem to be impossible to implement something like `+`. 

A better idea is to have each be a function with two arguments: a function and a value and have the function be _applied_ a certain number of times to the value. Not in a row (since, until we implement mutation, running a function once and then running it again will produce the same result), but _nested_. i.e.,

```pyret
ZERO = lam(f, x): x end
ONE = lam(f, x): f(x) end
TWO = lam(f, x): f(f(x)) end
...
```

Now, clearly we can construct any natural number this way -- pick a number and nest the calls the right number of times. 

We can even create a helper `ofnum(..)` that takes a Pyret natural number and produces one of these (essentially -- it's not technically the exact same code, but it behaves the same way, and is extremely convenient for our understanding), and a corresponding `tonum(..)` that goes the other way:

```pyret
fun ofnum(n :: Number):
  lam(f, x):
    fun r(m):
      if m == 0:
        x
      else:
        f(r(m - 1))
      end
    end
    r(n)
  end
end

fun tonum(cn) -> Number:
  cn(lam(y): y + 1 end, 0)
end
```

Now, of course, in order for these to be useful, we need to be able to express `+` and `*` (and others!), so lets do that, starting with `+`.

Addition takes two numbers and returns one, so we can start with:

```pyret
ADD = lam(n1, n2): ... end
```

Now, what should the result be? Well, we want a function `lam(f,x): f(f(...f(x))) end` where there are `n1 + n2` copies of `f`. Now, we know that `n1` and `n2` have this form already, but if we are going to be able to do anything with them, we have to apply them, so somehow it seems like we will need an `f` and `x` to pass to `n1` or `n2`. So lets expand our solution to:

```pyret
ADD = lam(n1, n2): # ADD is a lambda taking two numbers
  lam(f, x): # Returning a number -- numbers are represented as lam(f,x)
    ... 
  end 
end
```

So how can we get the inner applications? Well, if we apply `n1(f,x)`, this should give us back `f(f(...f(x)))` where there are `n1` copies (where we interpret `n1` as a number). If we want another `n2` applications of `f`, we can pass this as the starting value (the `x`) to `n2`, and we get the following. We use local definitions to make it easier to understand, but like our constants, we can substitute them -- so they aren't breaking our rules of only using lambdas, variables, and application.

```pyret
ADD = lam(n1, n2): # ADD is a lambda taking two numbers
  lam(f, x): # Returning a number -- numbers are represented as lam(f,x)
    n2-applied = n2(f, x) # First we apply f n2 times to x
    n2-then-n1-applied = n1(f, n2-applied) # Now we apply f n1 times to the prev result
    n2-then-n1-applied # And this is what we return
  end 
end
```

How do we do multiplication? There are multiple ways of doing it, but one is noticing that `n1 * n2` is the same as _adding_ `n2`, `n1` times, starting at 0. Note here that we are making particular choices for both `f` and `x`, knowing that our choice of `f` will be applied to our choice of `x` exactly `n1` times. Like with `ADD`, we present this with local definitions to make it easier to read.

i.e.,:

```pyret
MUL = lam(n1, n2): # MUL is a lambda that takes two numbers
  add-n2-to-y = lam(y): ADD(n2, y) end # We construct a function that adds n2 to its input
  add-n2-n1-times = n1(add-n2-to-y, ZERO) # And then do that n1 times, starting with 0
  add-n2-n1-times # This is what we return
end
```

This would mean if we had 4 multiplied by 3, we get:

```pyret
MUL(FOUR,THREE) # -->
FOUR(lam(y): ADD(THREE, y) end, ZERO) # -->
ADD(THREE, ADD(THREE, ADD(THREE, ADD(THREE, ZERO))))
```

To confirm, we can use our conversions:

```pyret
check:
  tonum(MUL(ofnum(5), ofnum(6))) is 30
end
```

What about subtraction? Before we try to do `n - m`, let's do a simpler thing -- implement `n - 1`. 

```pyret
MINUS1 = lam(n): ... end
```

Somehow, this has to take a function `lam(f, x): f(f(...f(x))) end` and return `lam(f,x): f(...f(x)) end` -- i.e., apply the function one fewer time. 

How can we do that? Well, the easiest way to do it is actually to take a slight detour, to define our first _structured_ data (which we can do, of course -- Church and Turing proved we can express _everything_) -- structured data with two values, which we'll call a pair.

Essentially, we want to define three things:

```pyret
PAIR = lam(a,b): ... end
FIRST = lam(p): ... end
SECOND = lam(p): ... end
```

Where the ideas is that pairs are _created_ with `PAIR`, and then one of the two values that was stored in the pair can be gotten out with `FIRST` or `SECOND` respectively. 

How do we do that? Well, the idea is similar to how booleans work -- `PAIR` will create a lambda function, and then `FIRST` and `SECOND` will apply it in the right way (in this case by passing in functions that cause the right value to be passed back). Let's see:

```pyret
PAIR = lam(a,b): lam(z): z(a,b) end end
FIRST = lam(p): p(lam(a,b): a end) end
SECOND = lam(p): p(lam(a,b): b end) end
```

We can confirm this is working using some of our other helpers, i.e.,:

```pyret
check:
  tonum(FIRST(PAIR(ofnum(10), ofnum(5)))) is 10
end
```

Why do we want pairs anyway? Well, the trouble with trying to subtract one is that, with church numerals, that amounts to applying a function _one fewer time_. 

i.e., if the input is `lam(f,x): f(f(f(x)) end`, we want the output to be `lam(f,x): f(f(x)) end`. 

A very clever idea (due to another logician working around the same time, Stephen Kleene) was to construct, at each step, a _pair_ of the current step and the next step. Then getting the previous step amounts to extracting the first part of the pair. 

Let's see:

```pyret
MINUS1 = lam(n): lam(f,x): FIRST(n(lam(y): PAIR(SECOND(y), f(SECOND(y))) end, PAIR(x,x))) end end
```

```pyret
check:
  tonum(MINUS1(tonum(10))) is 9
end
```

Now we could implement general substraction using the same strategy as we did for multiplication -- by repeatedly subtracting 1, but let's move on, to one last task we'd like to be able to do: check for equality. 

As before, we'll start with a small problem -- just checking if a number is equal to 0.

```pyret
EQUAL0 = lam(n): ... end
```

How can we do that? Well, we want to return a boolean -- true if it is 0 and false in all other cases. In this case, we can use the fact that numbers are composed of `f(f(...f(x)))`, i.e., if it is 0, then it is just whatever `x` is, and if it is non-zero, it is some number of applications of `f`:

```pyret
EQUAL0 = lam(n): n(lam(y): FALSE end, TRUE) end

check:
  tobool(EQUAL0(ZERO)) is true
  tobool(EQUAL0(ofnum(10))) is false
end
```

(We can get to general equality by combining generalized subtraction with `EQUAL0`, but we won't today).
