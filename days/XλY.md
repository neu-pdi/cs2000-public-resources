---
title: Extra - λY
---

Today, we'll continue with the lambda calculus, and explore a fascinating and challenging problem: **how to construct recursive functions**. This is important, as recursion can be used to express iteration, and all sorts of other important computational patterns. It might seem initially easy, by just having functions call themselves (indeed, while recursion in Python may have been confusing, it wasn't hard to do), but when we stop to think about it, we run into a problem -- **lambdas have no name, and therefore have no way of "calling themselves"**. 

How, then, can we construct functions that call themselves? **This is the puzzle we'll figure out today.**

Let's recap the definitions we have (the ones in `ALLCAPS` are actual lambda calculus terms, the `of...(...)` and `to...(...)` are convenient helpers to make it easier to test our code in Python; as last time, we write them all with `def`).

Note that **we make a minor change from last time** -- since in Python, functions evaluate their arguments _before_ being called, if we use the implementations of booleans (and `IF`, `AND`, `OR`, and `NOT`) that we came up with last time, we won't get the short-circuiting behavior that we expect -- `IF` will evaluate _both_ the then and the else branches, etc. This worked in the original lambda calculus because there was no defined order of evaluation, but it will make our concrete example today not work.

So we slightly tweak -- expecting the arguments to `TRUE` and `FALSE` to be zero argument functions that get _evaluated_ by `TRUE` and `FALSE` (note the parantheses after `x` and `y` in the definitions of `TRUE` and `FALSE`)

```python
def TRUE(x, y):
    return x()

def FALSE(x, y):
    return y()

def tobool(cb):
    def yes():
        return True
    def no():
        return False
    return cb(yes, no)

def IF(c, t, e):
    return c(t, e)

def AND(b1, b2):
    def then_b2():
        return b2
    def else_false():
        return FALSE
    return b1(then_b2, else_false)

def OR(b1, b2):
    def then_true():
        return TRUE
    def else_b2():
        return b2
    return b1(then_true, else_b2)

def NOT(b):
    def then_false():
        return FALSE
    def else_true():
        return TRUE
    return b(then_false, else_true)

def ZERO(f, x):
    return x

def ONE(f, x):
    return f(x)

def TWO(f, x):
    return f(f(x))

def ofnum(n: int):
    def church_numeral(f, x):
        def r(m):
            if m == 0:
                return x
            else:
                return f(r(m - 1))
        return r(n)
    return church_numeral

def tonum(cn) -> int:
    def add1(y):
        return y + 1
    return cn(add1, 0)

def PAIR(a, b):
    def pair(z):
        return z(a, b)
    return pair

def FIRST(p):
    def first_of_two(a, b):
        return a
    return p(first_of_two)

def SECOND(p):
    def second_of_two(a, b):
        return b
    return p(second_of_two)

def ADD(n1, n2):
    def sum_of_n1_n2(f, x):
        return n2(f, n1(f, x))
    return sum_of_n1_n2

def MUL(n1, n2):
    def add_n2_to_y(y):
        return ADD(n2, y)
    return n1(add_n2_to_y, ZERO)

def MINUS1(n):
    def one_less(f, x):
        def step(y):
            return PAIR(SECOND(y), f(SECOND(y)))
        return FIRST(n(step, PAIR(x, x)))
    return one_less

def EQUAL0(n):
    def always_false(y):
        return FALSE
    return n(always_false, TRUE)
```

Let's do a little review -- we'll use some normal Python features (including `lambda`) in these tests, and then we'll stick with pure lambda calculus for the rest of the lecture:

```python
def test_review():
    assert IF(TRUE, lambda: 1, lambda: 2) == 1
    assert IF(FALSE, lambda: 1, lambda: 2) == 2
    assert IF(AND(OR(FALSE, TRUE), NOT(FALSE)), lambda: "a", lambda: "b") == "a"

    FOUR = ofnum(4)

    assert FOUR(lambda y: y + 1, 0) == 4
    assert FOUR(lambda y: y + 1, 3) == 7
    assert FOUR(lambda y: y + 2, 1) == 9

    assert TWO(lambda s: "Hi! " + s, "Bye!") == "Hi! Hi! Bye!"

    # Python's `not` is an operator, rather than a function, so we
    # write `lambda b: not b` to get a function that does the same thing.
    assert ZERO(lambda b: not b, True)
    assert not ONE(lambda b: not b, True)
    assert TWO(lambda b: not b, True)
```

## Omega

To start our journey towards Y, we take as inspiration a simple program in the lambda calculus that must involve recursion (or something close enough), since it runs forever!

```python
(lambda x: x(x))(lambda x: x(x))
```

Why does this run forever? Because the argument is `lambda x: x(x)`, and is substituted for `x` in the first function, which then calls that on itself -- this immediately gets us back to the same program. (If you try it in Python, it stops with a `RecursionError`: Python limits how many function calls can be in progress at once, and this program would need infinitely many.)

## Moving towards recursion
How do we exploit that idea to get something useful? Let's pick a concrete function we want to write: the factorial function. This is about the simplest recursive function that produces a value. 

In Python, we would write:

```python
def factorial(n: int) -> int:
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)
```

Importantly, with what we did the previous lecture, can now express all the pieces of this in the lambda calculus _except_ the recursive call. We have `IF`, `EQUAL0`, `ONE`, `MUL`, and `MINUS1`. So a hybrid Python-LambdaCalculus version might be:

```python
def factorial(n):
    return IF(EQUAL0(n),
              lambda: ONE,
              lambda: MUL(n, factorial(MINUS1(n))))
```

**But how do we handle the recursive call?**

The key idea turns out to be: write a
function that, rather than calling itself (how recursion normally works), expects to be passed the function
that it should call.

This is our first attempt, which doesn't work, but gets us closer (as it eliminates the explicit recursion). From here on, we'll write our functions with Python's `lambda`, since each one is a single expression, and since the whole point of what follows is to get rid of the names that we'd need to write them with `def`:
```python
FACT0 = lambda rcall, n: IF(EQUAL0(n), lambda: ONE, lambda: MUL(n, rcall(MINUS1(n))))
```

This almost works (and is valid, lambda calculus code), but to use it, we need something to pass as `rcall`. It seems like we'd already
need to have a recursive version of the function to make that work. 

## One more layer
What if,
however, `rcall` itself also expected to be passed the function to be called on
the next iteration. How would it make a recursive call? Well, if at the next
iteration we wanted to call `rcall`, then we could pass `rcall` both itself (as the
function to call recursively) and the argument. 

```python
FACT1 = lambda rcall, n: IF(EQUAL0(n),
                            lambda: ONE,
                            lambda: MUL(n, rcall(rcall, MINUS1(n))))
```

Now, the question is how can we use this? Well, what if we call `fact1` passing
_itself_ as the first argument. This is _not_ recursion -- we aren't cheating -- since we could easily just copy the code we have. Remember, the fact that we are giving names to our definitions (like `FACT1`) is a matter of convenience _only_. 

```python
def test_fact1():
    assert tonum(FACT1(FACT1, ofnum(5))) == 120
```

And, miraculously, this works! We've figured out how to write recursive functions, in the lambda calculus! 

But, it was slightly clumsy. Let's figure out how to extract out the
essential parts of the code from the parts that are needed to set up the
recursion, so our code can be more natural, and easier to read.

## Moving towards Y

First, we see that we have this pattern where we define a variable, then call
it with itself as its first argument. I used a definition (`FACT1 = ...`) to accomplish that, but
definitions don't exist in the pure lambda calculus. We can accomplish the same
thing with lambda and application, though:

```python
def test_fact2():
    assert tonum((lambda fact2: fact2(fact2, ofnum(5)))(
        lambda rcall, n: IF(EQUAL0(n),
                            lambda: ONE,
                            lambda: MUL(n, rcall(rcall, MINUS1(n)))))) == 120
```

We could extract out the argument, and end up with something like:


```python
FACT3 = lambda m: (lambda fact2: fact2(fact2, m))(
    lambda rcall, n: IF(EQUAL0(n),
                        lambda: ONE,
                        lambda: MUL(n, rcall(rcall, MINUS1(n)))))
```

Now we are getting somewhere!

```python
def test_fact3():
    assert tonum(FACT3(ofnum(5))) == 120
```

`FACT3` can be called like a normal function! Good!
Now, how can we make _writing_ these easier? Well, one perhaps non-intuitive
step is that if we make all our functions single argument, we actually might
see opportunity to factor out more:



```python
FACT4 = lambda m: (lambda fact2: fact2(fact2)(m))(
    lambda rcall: lambda n: IF(EQUAL0(n),
                               lambda: ONE,
                               lambda: MUL(n, rcall(rcall)(MINUS1(n)))))
```

One thing that isn't great about our `lambda rcall: ...` is that we have this
`rcall(rcall)` on every recursive call. How do we abstract that out? Our first
attempt would be to just add a lambda outside, take the argument (call it
`f`) and apply it to itself before passing it as `rcall`. Now `rcall` is the
recursive application, and so doesn't need the self-call within the function.
But this doesn't work, as it ends up running forever! But if we _suspend_ the
same thing, and don't actually do the self application until we are actually
_called_, this works fine:

```python
FACT5 = lambda m: (lambda fact2: fact2(fact2)(m))(
    lambda f: (lambda rcall: lambda n: IF(EQUAL0(n),
                                          lambda: ONE,
                                          lambda: MUL(n, rcall(MINUS1(n)))))(
        lambda x: f(f)(x)))
```


At this point, if we squint, we see in the middle the part that we want to write -- I renamed `rcall` to `factorial` -- and this is pretty ideal!:

```python
FACT = lambda factorial: lambda n: IF(EQUAL0(n),
                                      lambda: ONE,
                                      lambda: MUL(n, factorial(MINUS1(n))))
```

If we rename `rcall` to `fact`, this is exactly the code we want to write. So let's extract all of that out as, say `F`, leaving us with the remainder of the code (the code we don't really want to write):

```python
Y1 = lambda F: lambda m: (lambda fact2: (fact2(fact2))(m))(
    lambda f: F(lambda x: (f(f))(x)))
```

```python
def test_y1():
    assert tonum(Y1(FACT)(ofnum(5))) == 120
```

Now let's do some renaming: first, `fact2` really doesn't need to be called that -- it really has nothing to do with factorial! Let's call it `g`:

```python
Y2 = lambda F: lambda m: (lambda g: g(g)(m))(
    lambda f: F(lambda x: (f(f))(x)))

def test_y2():
    assert tonum(Y2(FACT)(ofnum(5))) == 120
```

And once we do that, we notice that the return of the body of the inner
lambda is `g(g)(m)`. But that means that if we instead return `g(g)`, we are
returning a function that takes one argument and returns whatever `g(g)(m)`
would return. But that means we can eliminate the outer `lambda m: ...` and
have the body just be `g(g)`. (In general, `lambda x: f(x)` is equivalent to
`f`).

```python
Y3 = lambda F: (lambda g: g(g))(
    lambda f: F(lambda x: f(f)(x)))

def test_y3():
    assert tonum(Y3(FACT)(ofnum(5))) == 120
```

We can make this more symmetric (normally the two functions could be written one above the other, which gives it a Y shape) by partially applying on
the inside, to yield our final form:

```python
Y = lambda F: (lambda f: F(lambda x: f(f)(x)))(lambda f: F(lambda x: f(f)(x)))

def test_y():
    assert tonum(Y(FACT)(ofnum(5))) == 120
```


While there is another example of that pattern inside: `lambda x: f(f)(x)`, and in theory that is equivalent to `f(f)` (and indeed, that'll yield the
typical form presented of the Y combinator), in a strict language that
evaluates its arguments before substituting, making that change will cause
the program to run forever. So Y is our final version, to see the complete program, which is _pure_ lambda calculus:

```python
FACTORIAL = Y(lambda fact: lambda n: IF(EQUAL0(n),
                                        lambda: ONE,
                                        lambda: MUL(n, fact(MINUS1(n)))))

tonum(FACTORIAL(ofnum(5)))
```