#level raw
# Runs inside PLL (see build.py): executes each example from examples.json, in
# order, in one shared environment (so later examples can use names that earlier
# ones defined), and records what each one produces (including the SVG of any
# image) in results.json.

import ast
import contextlib
import io
import json
import pprint

examples = json.load(open("examples.json"))
env = dict(globals())
results = []


def describe(value, n):
    """what to show for the value of an example's last expression"""
    if value is None:
        return None
    if isinstance(value, Table):
        columns = value.columns()
        return {"kind": "table", "columns": columns,
                "rows": [[row[c] for c in columns] for row in value.rows()]}
    if hasattr(value, "to_svg"):  # an image (charts are images too)
        return {"kind": "image", "svg": value.to_svg(),
                "width": image_width(value), "height": image_height(value)}
    return {"kind": "text", "text": pprint.pformat(value, width=80, sort_dicts=False)}


for n, example in enumerate(examples):
    tree = ast.parse(example["code"])
    last = None
    if tree.body and isinstance(tree.body[-1], ast.Expr):
        last = tree.body.pop()
    printed = io.StringIO()
    result = {"printed": "", "value": None, "error": None}
    try:
        with contextlib.redirect_stdout(printed):
            exec(compile(tree, "<example>", "exec"), env)
            if last is not None:
                value = eval(compile(ast.Expression(last.value), "<example>", "eval"), env)
                result["value"] = describe(value, n)
    except Exception as e:
        # (a KeyError's str() is the repr of its message, quotes and all)
        message = e.args[0] if isinstance(e, KeyError) and e.args and isinstance(e.args[0], str) else e
        result["error"] = "%s: %s" % (type(e).__name__, message)
    result["printed"] = printed.getvalue()
    results.append(result)

json.dump(results, open("results.json", "w"))
