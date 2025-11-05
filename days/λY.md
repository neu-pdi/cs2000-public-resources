---
title: Day λY
---

Today, we'll continue with the lambda calculus, and explore one of the most fascinating problems: how to construct recursive functions, when all we have are anonymous functions (which therefore have no way of directly calling themselves). 

To start, we take as inspiration a simple program in the lambda calculus that must involve recursion, since it runs forever!

```pyret title="This construct is called Omega"
(lam(x): x(x) end)(lam(x): x(x) end)
```

How do we exploit that idea to get something useful? Key idea: write a
function that, rather than calling itself (how recursion normally works), expects to be passed the function
that it should call.

```pyret
fact0 = lam(rcall, n):
  if n == 0:
    1
  else:
    n * rcall(n - 1)
  end
end
```

This almost works, but what can we pass as `rcall`? It seems like we'd already
need to have a recursive version of the function to make that work. What if,
however, `rcall` itself also expected to be passed the function to be called on
the next iteration. How would it make a recursive call? Well, if at the next
iteration we wanted to call `rcall`, then we could pass `rcall` both itself (as the
function to call recursively) and the argument. 

```pyret
fact1 = lam(rcall, n):
  if n == 0:
    1
  else:
    n * rcall(rcall, n - 1)
  end
end
```

Now, the question is how can we use this? Well, what if we call `fact1` passing
_itself_ as the first argument.

```pyret
fact1(fact1, 5)
```

This seems to work -- we've figured out how to write recursive functions,
albeit in a slightly clumsy way. Let's figure out how to extract out the
essential parts of the code from the parts that are needed to set up the
recursion.

First, we see that we have this pattern where we define a variable, then call
it with itself as its first argument. I used define to accomplish that, but
define doesn't exist in the pure lambda calculus. We can accomplish the same
thing with lambda and application, though:

```pyret
(lam(fact2):
    fact2(fact2, 5)
  end)(lam(rcall, n):
    if n == 0:
      1
    else:
      n * rcall(rcall, n - 1)
    end
  end)
```

We could extract out the argument, and end up with something like:


```pyret
fact2 = lam(m):
  (lam(fact2):
      fact2(fact2, m)
    end)
    (lam(rcall n):
        if n == 0:
          1
        else: 
          n * rcall(rcall, n - 1)
        end)
  end
```

Now we can call `fact2(5)`, and it behaves like an ordinary function. Good!
Now, how can we make _writing_ these easier? Well, one perhaps non-intuitive
step is that if we make all our functions single argument, we actually might
see opportunity to factor out more:



```pyret
fact3 = lam(m):
  (lam(fact2):
    (fact2(fact2))(m)
  end)(lam(rcall):
    lam(n):
      if n == 0:
        1
      else:
        n * (rcall(rcall))(n - 1)
      end
    end
  end)
end
```

One thing that isn't great about our `lam(rcall) ... end` is that we have this
`rcall(rcall)` on every recursive call. How do we abstract that out? Our first
attempt would be to just add a lambda outside, take the argument (call it
'f') and apply it to itself before passing it as 'rcall'. Now 'rcall' is the
recursive application, and so doesn't need the self-call within the function.
But this doesn't work, as it ends up running forever! But if we _suspect_ the
same thing, and don't actually do the self application until we are actually
_called_, this works fine:

```pyret
fact4 = lam(m):
  (lam(fact2):
    (fact2(fact2))(m)
  end)(lam(f):
    (lam(rcall):
      lam(n):
        if n == 0:
          1
        else:
          n * rcall(n - 1)
        end
      end
    end)(lam(x): (f(f))(x) end)
  end)
end
```


At this point, if we squint, we see in the middle the part that we want to write:

```pyret
fact = lam(rcall):
  lam(n):
    if n == 0:
      1
    else:
      n * rcall(n - 1)
    end
  end
end
```

If we rename 'rcall' to 'fact', this is exactly the code we want to write. So let's extract all of that out as, say 'F':

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
(Y1(fact))(5)
```

Now let's do some renaming: first, 'fact2' really doesn't need to be called that. Let's call it 'g':

```pyret
Y2 = lam(F):
  lam(m):
    (lam(g): (g(g))(m) end)(lam(f):
      F(lam(x): (f(f))(x) end)
    end)
  end
end

(Y2(fact))(5)
```

And once we do that, we notice that the return of the body of the inner
lambda is ((g g) m). But that means that if we instead return (g g), we are
returning a function that takes one argument and returns whatever (g g) m
would return. But that means we can eliminate the outer (lambda (m) ...) and
have the body just be (g g). (In general, (lambda (x) (f x)) is equivalent to
f).

```pyret
Y3 = lam(F):
  (lam(g): g(g) end)(lam(f):
    F(lam(x): (f(f))(x) end)
  end)
end

(Y3(fact))(5)
```

We can make this more symmetric (hence the Y name) by partially applying on
the inside:

```pyret
Y4 = lam(F):
  (lam(f): F(lam(x): (f(f))(x) end) end)
  (lam(f): F(lam(x): (f(f))(x) end) end)
end

(Y4(fact))(5)
```


While there is another example of that pattern inside: (lambda (x) ((f f)
x)), and in theory that is equivalent to (f f) (and indeed, that'll yield the
typical form presented of the Y combinator), in a strict language that
evaluates its arguments before substituting, making that change will cause
the program to run forever. So Y4 is our final version, and just to reiterate use:

```pyret
factorial = Y4(lam(fact):
  lam(n):
    if n == 0:
      1
    else:
      n * fact(n - 1)
    end
  end
end)

factorial(5)
```