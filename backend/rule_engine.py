def decide_by_rules(state, evaluation):

    # Current topic
    topic = state.current_topic["topic"]

    # Weak answer → ask a follow-up
    if evaluation["overall_score"] < 5:
        return "FOLLOW_UP"

    # Count how many questions have been asked on this topic
    topic_count = sum(
        1 for item in state.history
        if item["topic"] == topic
    )

    # After 2 questions, move to the next topic
    if topic_count >= 2:
        return "NEXT_TOPIC"

    # Strong performance → increase difficulty
    if state.average_score >= 8.5:
        return "INCREASE_DIFFICULTY"

    # Weak performance → decrease difficulty
    if state.average_score <= 5:
        return "DECREASE_DIFFICULTY"

    # Otherwise continue with the current difficulty/topic
    return None