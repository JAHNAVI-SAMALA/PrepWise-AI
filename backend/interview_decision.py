from backend.rule_engine import decide_by_rules

def decide_next_step(state, evaluation):

    rule = decide_by_rules(state, evaluation)

    if rule:
        return {
            "action": rule,
            "reason": "Rule-based decision"
        }

    return {
        "action": "NEXT_TOPIC",
        "reason": "Default decision"
    }