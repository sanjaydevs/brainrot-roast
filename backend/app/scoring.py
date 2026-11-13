
from app.schemas import ScreenTimeData

HIGH_STIMULATION_APPS = {
    "instagram",
    "reddit",
    "tiktok",
    "snapchat",
    "facebook",
    "youtube",
    "netflix",
    "x",
    "twitter",
    "threads",
    "twitch",
}


def calculate_brain_rot_score(data: ScreenTimeData):
    total_minutes = data.total_screen_time_minutes

    if total_minutes is None or total_minutes <= 0:
        raise ValueError("Valid total screen time is required.")

    # Component A: Daily screen time (maximum 40)
    if total_minutes < 120:
        time_score = 0
    elif total_minutes < 240:
        time_score = 10
    elif total_minutes < 360:
        time_score = 20
    elif total_minutes < 480:
        time_score = 30
    else:
        time_score = 40

    # Component B and C: High-stimulation usage
    high_stimulation_apps = []

    for app in data.apps:
        if app.name.strip().lower() in HIGH_STIMULATION_APPS:
            high_stimulation_apps.append(app)

    high_stimulation_minutes = sum(
        app.duration_minutes for app in high_stimulation_apps
    )

    # Component B: High-stimulation usage (maximum 40)
    category_ratio = min(high_stimulation_minutes / total_minutes, 1)

    app_score = 40 * category_ratio

    # Component C: App concentration (maximum 20)
    highest_app_minutes = max(
        (app.duration_minutes for app in high_stimulation_apps),
        default=0
    )

    concentration_ratio = min(highest_app_minutes / total_minutes, 1)

    concentration_score = 20 * concentration_ratio

    # Final score
    final_score = round(
        min(time_score + app_score + concentration_score, 100)
    )

    explanations = [
        f"Screen time contributed {time_score}/40 points.",
        f"High-stimulation apps contributed {app_score:.1f}/40 points.",
        f"App concentration contributed {concentration_score:.1f}/20 points.",
        f"You spent {high_stimulation_minutes} minutes on identified high-stimulation apps."
    ]

    return {
        "brain_rot_score": final_score,
        "components": {
            "screen_time": round(time_score, 2),
            "high_stimulation_usage": round(app_score, 2),
            "app_concentration": round(concentration_score, 2)
        },
        "high_stimulation_minutes": high_stimulation_minutes,
        "explanations": explanations
    }
