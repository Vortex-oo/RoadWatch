def estimate_severity() -> str:
    # A classification probability is not a measurement of physical damage.
    # Keep severity unknown until a human reviewer or a damage detector assesses it.
    return "unknown"
