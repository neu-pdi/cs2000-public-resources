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
    if hasattr(value, "_pll_table_data"):
        data = value._pll_table_data()
        return {"kind": "table", "columns": data["columns"], "rows": data["rows"]}
    if hasattr(value, "_pll_image_data"):
        data = value._pll_image_data()
        return {"kind": "image", "svg": data["data"],
                "width": data["width"], "height": data["height"]}
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
        result["error"] = "%s: %s" % (type(e).__name__, e)
    result["printed"] = printed.getvalue()
    results.append(result)

json.dump(results, open("results.json", "w"))
