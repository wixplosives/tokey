import { test } from "../test-kit/testing";
import { stripComments } from "../src/parsers/strips-comments";

test("a/*comment*/b", stripComments, "ab");
test("a//comment\nb", stripComments, "ab");
test("a/*comment\nb", stripComments, "a");
test("a/*comment*/b/*comment*/c", stripComments, "abc");
