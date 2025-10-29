import type { Fact } from "../facts";
import type { Rule } from "../rules";

function nextMatchedRule(fact: Fact, rules: Rule[]) {
  return rules.find((rule) => rule.condition(fact));
}

export class Engine {
  private _fact: Fact;

  constructor(private _rules: Rule[]) {
    this._fact = {};
  }

  get rules() {
    return this._rules;
  }

  set rules(rules: Rule[]) {
    this._rules = rules;
  }

  get fact() {
    return this._fact;
  }

  set fact(fact: Fact) {
    this._fact = fact;
  }

  nextMatchedRule() {
    return nextMatchedRule(this._fact, this.rules);
  }

  applyPatch(patch: Fact) {
    this.fact = { ...this.fact, ...patch };
  }

  step(): boolean {
    const rule = this.nextMatchedRule();
    if (rule === undefined || rule.type !== "condition") {
      return false;
    }
    this.applyPatch(rule.patch);
    return true;
  }
}
