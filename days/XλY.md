---
title: Extra - λY
---

Today, we'll continue with the lambda calculus, and explore a fascinating and challenging problem: **how to construct recursive functions**. This might seem initially easy (at least, as much as recursion was easy in Pyret), but when we stop to think about it, it might instead seem impossible -- **lambdas, indeed, have no name, and therefore have no way of "calling themselves"**. How, then, can we construct functions that call themselves? **This is the puzzle we'll figure out today.**

Let's recap the definitions we have (the ones in `ALLCAPS` are actual lambda calculus terms, the `of...(...)` and `to...(...)` are convenient helpers to make it easier to test our code in Pyret).

Note that **we make a minor change from last time** -- since in Pyret, functions evaluate their arguments _before_ being called, if we use the implementations of booleans (and `IF`, `AND`, `OR`, and `NOT`) that we saw before, we won't get the short-circuiting behavior that we expect -- `IF` will evaluate _both_ the then and the else branches, etc. This worked in the original lambda calculus because there was no defined order of evaluation, but it will make our concrete example today not work.

So we slightly tweak -- expecting the arguments to `TRUE` and `FALSE` to be zero argument functions that get _evaluated_ by `TRUE` and `FALSE` (note the parantheses after `x` and `y` in the definitions of `TRUE` and `FALSE`)

```pyret
TRUE = lam(x,y): x() end
FALSE = lam(x,y): y() end
fun tobool(cb):
  cb(lam(): true end, lam(): false end)
end

IF = lam(c,t,e): c(t,e) end
AND = lam(b1, b2): b1(lam(): b2 end, lam(): FALSE() end) end
OR = lam(b1, b2): b1(lam(): TRUE end, lam(): b2 end) end
NOT = lam(b): b(lam(): FALSE end, lam(): TRUE end) end

ZERO = lam(f, x): x end
ONE = lam(f, x): f(x) end
TWO = lam(f, x): f(f(x)) end
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

PAIR = lam(a,b): lam(z): z(a,b) end end
FIRST = lam(p): p(lam(a,b): a end) end
SECOND = lam(p): p(lam(a,b): b end) end

ADD = lam(n1, n2): lam(f, x): n2(f, n1(f, x)) end end
MUL = lam(n1, n2): n1(lam(y): ADD(n2, y) end, ZERO) end
MINUS1 = lam(n): lam(f,x): FIRST(n(lam(y): PAIR(SECOND(y), f(SECOND(y))) end, PAIR(x,x))) end end

EQUAL0 = lam(n): n(lam(y): FALSE end, TRUE) end
```

## Omega

To start our journey towards Y, we take as inspiration a simple program in the lambda calculus that must involve recursion (or something close enough), since it runs forever!

```pyret
(lam(x): x(x) end)(lam(x): x(x) end)
```

Why does this run forever? Because the argument is `lam(x): x(x) end`, and is substituted for `x` in the first function, which then calls that on itself -- this immediately gets us back to the same program.

## Moving towards recursion
How do we exploit that idea to get something useful? Let's pick a concrete function we want to write: the factorial function. This is about the simplest recursive function that produces a value. 

In Pyret, we would write:

```pyret
fun factorial(n :: Number) -> Number:
  if n == 0:
    1
  else:
    n * factorial(n - 1)
  end
end
```

Importantly, with what we did the previous lecture, can now express all the pieces of this in the lambda calculus _except_ the recursive call. We have `IF`, `EQUAL0`, `ONE`, `MUL`, and `MINUS1`. So a hybrid Pyret-LambdaCalculus version might be:

```pyret
fun factorial(n :: Number) -> Number:
  IF(EQUAL0(N),
     ONE,
     MUL(N, factorial(MINUS1(N))))
end
```

**But how do we handle the recursive call?**

The key idea turns out to be: write a
function that, rather than calling itself (how recursion normally works), expects to be passed the function
that it should call.

This is our first attempt, which doesn't work, but gets us closer (as it eliminates the explicit recursion):
```pyret
FACT0 = lam(rcall, n): 
    IF(EQUAL0(n), ONE, MUL(n, rcall(MINUS1(n)))) 
  end
```

This almost works (and is valid, lambda calculus code), but to use it, we need something to pass as `rcall`. It seems like we'd already
need to have a recursive version of the function to make that work. 

## One more layer
What if,
however, `rcall` itself also expected to be passed the function to be called on
the next iteration. How would it make a recursive call? Well, if at the next
iteration we wanted to call `rcall`, then we could pass `rcall` both itself (as the
function to call recursively) and the argument. 

```pyret
FACT1 = lam(rcall, n): 
    IF(EQUAL0(n), 
       lam(): ONE end, 
       lam(): MUL(n, rcall(rcall, MINUS1(n))) end) 
  end
```

Now, the question is how can we use this? Well, what if we call `fact1` passing
_itself_ as the first argument. This is _not_ recursion -- we aren't cheating -- since we could easily just copy the code we have. Remember, the fact that we are using Pyret constant definitions is a matter of convenience _only_. 

```pyret
check:
  tonum(FACT1(FACT1, 5)) is 120
end
```

And, miraculously, this works! We've figured out how to write recursive functions, in the lambda calculus! 

But, it was slightly clumsy. Let's figure out how to extract out the
essential parts of the code from the parts that are needed to set up the
recursion, so our code can be more natural, and easier to read.

## Moving towards Y

First, we see that we have this pattern where we define a variable, then call
it with itself as its first argument. I used define to accomplish that, but
define doesn't exist in the pure lambda calculus. We can accomplish the same
thing with lambda and application, though:

```pyret
check:
  tonum((lam(fact2):
    fact2(fact2, ofnum(5))
  end)(lam(rcall, n):
  IF(EQUAL0(n), lam(): ONE end, lam(): MUL(n, rcall(rcall, MINUS1(n))) end) end)) is 120
```

We could extract out the argument, and end up with something like:


```pyret
FACT3 = lam(m): (lam(fact2):
      fact2(fact2, m)
    end)(lam(rcall, n):
      IF(EQUAL0(n), 
          lam(): ONE end, 
        lam(): MUL(n, rcall(rcall, MINUS1(n))) end) end)
end
```

Now we are getting somewhere!

```pyret
check:
  tonum(FACT3(ofnum(5))) is 120
end
```

`FACT3` can be called like a normal function! Good!
Now, how can we make _writing_ these easier? Well, one perhaps non-intuitive
step is that if we make all our functions single argument, we actually might
see opportunity to factor out more:



```pyret
FACT4 = lam(m): (lam(fact2):
      fact2(fact2)(m)
    end)(lam(rcall): lam(n):
      IF(EQUAL0(n), 
          lam(): ONE end, 
      lam(): MUL(n, rcall(rcall)(MINUS1(n))) end) end end)
end
```

One thing that isn't great about our `lam(rcall) ... end` is that we have this
`rcall(rcall)` on every recursive call. How do we abstract that out? Our first
attempt would be to just add a lambda outside, take the argument (call it
`f`) and apply it to itself before passing it as `rcall`. Now `rcall` is the
recursive application, and so doesn't need the self-call within the function.
But this doesn't work, as it ends up running forever! But if we _suspend_ the
same thing, and don't actually do the self application until we are actually
_called_, this works fine:

```pyret
FACT5 = lam(m): (lam(fact2):
    fact2(fact2)(m)
  end)(lam(f):
    (lam(rcall):
      lam(n):
        IF(EQUAL0(n), 
          lam(): ONE end, 
      lam(): MUL(n, rcall(MINUS1(n))) end)
      end
    end)(lam(x): f(f)(x) end)
  end)
end
```


At this point, if we squint, we see in the middle the part that we want to write -- I renamed `rcall` to `factorial` -- and this is pretty ideal!:

```pyret
FACT = lam(factorial):
  lam(n):
    IF(EQUAL0(n), 
      lam(): ONE end, 
      lam(): MUL(n, factorial(MINUS1(n))) end)
  end
end
```

If we rename `rcall` to `fact`, this is exactly the code we want to write. So let's extract all of that out as, say `F`, leaving us with the remainder of the code (the code we don't really want to write):

```pyret
Y1 = lam(F):
  lam(m):
    (lam(fact2):
      (fact2(fact2))(m)
    end)(lam(f):
      F(lam(x): (f(f))(x) end)
    end)
  end
end
```

```pyret
check:
  tonum(Y1(FACT)(ofnum(5))) is 120
end
```

Now let's do some renaming: first, `fact2` really doesn't need to be called that -- it really has nothing to do with factorial! Let's call it `g`:

```pyret
Y2 = lam(F):
  lam(m):
    (lam(g): g(g)(m) end)(lam(f):
      F(lam(x): (f(f))(x) end)
    end)
  end
end

check:
  tonum(Y2(FACT)(ofnum(5))) is 120
end
```

And once we do that, we notice that the return of the body of the inner
lambda is `g(g)(m)`. But that means that if we instead return `g(g)`, we are
returning a function that takes one argument and returns whatever `g(g)(m)`
would return. But that means we can eliminate the outer `(lam(m): ... end)` and
have the body just be `g(g)`. (In general, `lam(x): f(x) end` is equivalent to
`f`).

```pyret
Y3 = lam(F):
  (lam(g): g(g) end)(lam(f):
    F(lam(x): f(f)(x) end)
  end)
end

check:
  tonum(Y3(FACT)(ofnum(5))) is 120
end
```

We can make this more symmetric (normally the two functions could be above each other, which gives it a Y shape, but Pyret doesn't want space between them) by partially applying on
the inside, to yield our final form:

```pyret
Y = lam(F):
  (lam(f): F(lam(x): f(f)(x) end) end)(lam(f): F(lam(x): f(f)(x) end) end)
end

check:
  tonum(Y(FACT)(ofnum(5))) is 120
end
```


While there is another example of that pattern inside: `lam(x): f(f)(x) end`, and in theory that is equivalent to `f(f)` (and indeed, that'll yield the
typical form presented of the Y combinator), in a strict language that
evaluates its arguments before substituting, making that change will cause
the program to run forever. So Y is our final version, to see the complete program, which is _pure_ lambda calculus:

```pyret
FACTORIAL = Y(lam(fact):
  lam(n):
    IF(EQUAL0(n), 
      lam(): ONE end, 
      lam(): MUL(n, fact(MINUS1(n))) end)
  end
end)

tonum(FACTORIAL(ofnum(5)))
```