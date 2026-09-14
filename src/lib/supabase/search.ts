/**
 * Safely embeds a raw user search term into a PostgREST `.or()` filter
 * string built from `col.ilike.%term%` clauses.
 *
 * `.or()` takes a raw PostgREST filter expression (the client library does
 * no sanitization of its own — see its own docstring: "you also need to
 * make sure they are properly sanitized"). Interpolating a search term
 * directly means a comma or parenthesis in the term is parsed as a filter
 * separator/group instead of literal text, which both breaks legitimate
 * searches (e.g. "079,123") and lets a crafted term inject additional
 * filter clauses (e.g. "foo,id.neq.<uuid>"). Per PostgREST's documented
 * syntax, wrapping a value in double quotes (with embedded backslashes/
 * quotes escaped) makes it opaque to the filter grammar.
 */
export function buildIlikeOrFilter(columns: string[], rawTerm: string): string {
  const escaped = rawTerm.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return columns.map((col) => `${col}.ilike."%${escaped}%"`).join(",");
}
