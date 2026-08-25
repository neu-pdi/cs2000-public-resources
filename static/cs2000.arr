use context empty-context

import essentials2024 as BASIC
provide from BASIC: *, type *, data * end
include from BASIC: *, type *, data * end
################################################################
# CS2000 Support
# August 2026
# maintained by Daniel Patterson

# This is a customized version of the DCIC context.

include tables
include chart 
import statistics as S 
#  import lists as L
import sets as ST
import constants as C
import global as G

provide: 
  get-row,
  get-column,
  table-length,
  filter-with,
  order-by,
  build-column,
  add-row,
  add-col,
  select-columns,
  drop-column,
  transform-column,
  create-table-with-col,
  empty-table,
  mean,
  median,
  modes,
  stdev,
  sum,
  histogram,
  scatter-plot,
  labeled-scatter-plot,
  box-plot,
  freq-bar-chart,
  lr-plot,
  labeled-lr-plot,
  function-plot,
  group,
  count,
  count-many,
  render-chart,
  pie-chart,
  bar-chart,
  dot-plot,
  labeled-dot-plot
end

provide from C:
  E
end

provide from G:
  string-find-index,
  string-find-opt,
  string-find,
  string-get-index,
end

# ----------- TABLE FUNCTIONS -----------

fun table-length(t :: Table) -> Number:
    t.length()
end

fun get-row(t :: Table, index :: Number) -> Row:
  t.row-n(index)
end

fun is-row-or-table(x): is-row(x) or is-table(x) end

fun get-column(x :: Any%(is-row-or-table), col :: String):
  if is-row(x):
    x[col]
  else if is-table(x):
    x.get-column(col)
  else:
    raise("get-column: given a value that was not a Row or a Table: " + to-repr(x))
  end
end

fun filter-with(t :: Table, test :: (Row -> Boolean)) -> Table:
  fun run-per-row(x):
    test(x)
  end
  t.filter(run-per-row)
end

fun order-by(t :: Table, col :: String, sort-up :: Boolean) -> Table:
  t.order-by(col, sort-up)
end


fun build-column<A>(t :: Table, col :: String, builder :: (Row -> A)) -> Table:
  fun run-per-row(x):
    builder(x)
  end
  t.build-column(col, run-per-row)
end

fun add-row(t :: Table, r :: Row) -> Table: t.add-row(r) end

fun add-col(t :: Table, name :: String, c :: List) -> Table: t.add-column(name, c) end

fun select-columns(t :: Table, names :: List<String>) -> Table: t.select-columns(names) end

fun drop-column(t :: Table, name :: String) -> Table: t.drop(name) end

fun transform-column<A,B>(t :: Table, name :: String, f :: (A -> B)) -> Table:
  t.transform-column(name, f)
end

fun create-table-with-col(colname :: String, colvals :: List) -> Table:
  base = table: dummy end
  mt-table = base.rename-column("dummy", colname) 
  fold(lam(t, cval): t.add-row([raw-row: {colname ; cval}]) end,
    mt-table, colvals)
end

fun empty-table(t :: Table) -> Table: t.empty() end

# ------ AGGREGATING --------------------
fun mean(  t :: Table, col :: String) -> Number: S.mean(t.column(col)) end
fun median(t :: Table, col :: String) -> Number: S.median(t.column(col)) end
fun modes( t :: Table, col :: String) -> List<Number>: S.modes(t.column(col)) end
fun stdev( t :: Table, col :: String) -> Number: S.stdev(t.column(col)) end
fun sum(   t :: Table, col :: String) -> Number: fold(lam(x,y): x + y end, 0, t.column(col)) end

# ----------- PLOTTING ------------------

# re-export render-chart
shadow render-chart = render-chart

fun histogram(t :: Table, vals :: String, bin-width :: Number) -> Image:
  doc: "wrap histogram so that the bin-width is set"
  if not(is-number(t.column(vals).get(0))):
    raise("Cannot make a histogram, because the '" + vals + 
      "' column does not contain quantitative data")
  else:
    render-chart(from-list.histogram(t.column(vals)).bin-width(bin-width))
      .x-axis(vals)
      .y-axis("count")
      .display()
  end
end

fun scatter-plot(t :: Table, xs :: String, ys :: String) -> Image:
  render-chart(from-list.scatter-plot(t.column(xs), t.column(ys)))
    .x-axis(xs)
    .y-axis(ys)
    .display()
end

fun labeled-scatter-plot(t :: Table, ls :: String, xs :: String, ys :: String) -> Image:
  render-chart(from-list.labeled-scatter-plot(t.column(ls).map(to-string), t.column(xs), t.column(ys)))
    .x-axis(xs)
    .y-axis(ys)
    .display()
end

fun pie-chart(t :: Table, ls :: String, vs :: String) -> Image:
  render-chart(from-list.pie-chart(t.column(ls).map(to-string), t.column(vs))).display()
end

fun bar-chart(t :: Table, ls :: String, vs :: String) -> Image:
  render-chart(from-list.bar-chart(t.column(ls).map(to-string), t.column(vs)))
    .y-axis(vs)
    .display()
end

fun dot-plot(t :: Table, vs :: String) -> Image:
  xs = t.column(vs)
  ys = repeat(length(xs), 0)
  render-chart(from-list.scatter-plot(xs, ys)).x-axis(vs).display()
end

fun labeled-dot-plot(t, ls, vs):
  xs = t.column(vs)
  ys = repeat(length(xs), 0)
  render-chart(from-list.labeled-scatter-plot(t.column(ls).map(to-string), xs, ys)).x-axis(vs).display()
end

fun box-plot(t :: Table, vs :: String) -> Image:
  render-chart(from-list.labeled-box-plot([list: vs], [list: t.column(vs)])).display()
end

fun freq-bar-chart(t :: Table, vs :: String) -> Image:
  values = t.column(vs).map(to-string)
  render-chart(from-list.freq-bar-chart(values))
    .x-axis(vs)
    .y-axis("count")
    .display()
end

fun lr-plot(t :: Table, xs :: String, ys :: String) -> Image:
  scatter = from-list.scatter-plot(t.column(xs), t.column(ys))
  fn = S.linear-regression(t.column(xs), t.column(ys))
  fn-plot = from-list.function-plot(fn)
  r-sqr-str = num-to-string-digits(S.r-squared(t.column(xs), t.column(ys), fn), 3)
  alpha-str = num-to-string-digits(fn(2) - fn(1), 3)
  beta-str = num-to-string-digits(fn(0) * -1, 3)
  title-str = "y=" + alpha-str + "x + " + beta-str + ";     " + "r-sq: " + r-sqr-str
  render-charts([list: scatter, fn-plot]).title(title-str)
    .x-axis(xs)
    .y-axis(ys)
    .display()
end

fun labeled-lr-plot(t :: Table, ls :: String, xs :: String, ys :: String) -> Image:
  scatter = from-list.labeled-scatter-plot(t.column(ls).map(to-string), t.column(xs), t.column(ys))
  fn = S.linear-regression(t.column(xs), t.column(ys))
  fn-plot = from-list.function-plot(fn)
  r-sqr-str = num-to-string-digits(S.r-squared(t.column(xs), t.column(ys), fn), 3)
  alpha-str = num-to-string-digits(fn(2) - fn(1), 3)
  beta-str = num-to-string-digits(fn(0) * -1, 3)
  title-str = "y=" + alpha-str + "x + " + beta-str + ";     " + "r-sq: " + r-sqr-str
  render-charts([list: scatter, fn-plot]).title(title-str)
    .x-axis(xs)
    .y-axis(ys)
    .display()
end

fun function-plot(f :: (Number -> Number)) -> Image:
  render-chart(from-list.function-plot(f))
    .x-axis("x")
    .y-axis("y")
    .display()
end

fun group(tab, col):
  values = ST.list-to-list-set(tab.get-column(col)).to-list()
  for fold(shadow grouped from table: value, subtable end, v from values):
    grouped.stack(table: value, subtable
        row: v, tab.filter-by(col, {(val): val == v})
      end)
  end
end

fun count(tab, col):
  drop-column(build-column(group(tab, col), "count", {(r): table-length(get-column(r, "subtable"))}), "subtable")
end

fun count-many(tab, cols):
  for fold(shadow grouped from table: col, subtable end, c from cols):
    grouped.stack(table: col, subtable
        row: c, count(tab, c)
      end)
  end
end
